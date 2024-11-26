const router = require("express").Router();
const User = require("../Models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");

//signup..
router.post("/signup", async (req, res) => {
  try {
    const { username, name, email, password } = req.body;

    if (username.length < 1) {
      return res
        .status(400)
        .json({ message: "Username length should be greater than 1." });
    }
    if (password.length < 5) {
      return res
        .status(400)
        .json({ message: "Password length should be greater than 5." });
    }

    const existinguser = await User.findOne({ username });
    if (existinguser) {
      return res.status(400).json({ message: "Username already exists." });
    }
    const existingemail = await User.findOne({ email });
    if (existingemail) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashPass = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      username,
      password: hashPass,
      email,
    });

    await newUser.save();
    return res.status(201).json({ message: "Signup successfully." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//signIn..
router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existinguser = await User.findOne({ username: username });
    if (!existinguser) {
      res.status(400).json({ message: "Invalid Cridentials.." });
    }

    await bcrypt.compare(password, existinguser.password, (err, data) => {
      if (data) {
        const authClaim = [
          { name: existinguser.username },
          { role: existinguser.role },
        ];
        const token = jwt.sign({ authClaim }, "rohan123");
        res.status(200).json({
          id: existinguser._id,
          role: existinguser.role,
          token: token,
        });
      } else {
        res.status(400).json({ message: "Invalid Cridentials.." });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//user-Information..
router.get("/userInfo", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const data = await User.findById(id).select("-password");
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//bookmark
router.put("/bookmark/:id", authenticateToken, async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const tweetId = req.params.id;
    const user = await User.findById(loggedInUserId);
    
    if (user.bookmarks.includes(tweetId)) {
      // remove bookmark
      await User.findByIdAndUpdate(loggedInUserId, { $pull: { bookmarks: tweetId } });
      return res.status(200).json({
        message: "Removed from bookmarks."
      });
    } else {
      // add to bookmark
      await User.findByIdAndUpdate(loggedInUserId, { $push: { bookmarks: tweetId } });
      return res.status(200).json({
        message: "Saved to bookmarks."
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/profile/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select("-password");
    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/otheruser/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const otherUsers = await User.find({ _id: { $ne: id } }).select("-password");

    if (!otherUsers.length) {
      return res.status(404).json({
        message: "Currently do not have any users."
      });
    }

    return res.status(200).json({
      otherUsers
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.post("/follow/:id", authenticateToken, async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const userId = req.params.id;
    const loggedInUser = await User.findById(loggedInUserId);
    const user = await User.findById(userId);

    if (!user.followers.includes(loggedInUserId)) {
      await user.updateOne({ $push: { followers: loggedInUserId } });
      await loggedInUser.updateOne({ $push: { following: userId } });
    } else {
      return res.status(400).json({
        message: `User already followed ${user.name}`
      });
    }

    return res.status(200).json({
      message: `${loggedInUser.name} just followed ${user.name}`,
      success: true
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.post("/unfollow/:id", authenticateToken, async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const userId = req.params.id;
    const loggedInUser = await User.findById(loggedInUserId);
    const user = await User.findById(userId);

    if (loggedInUser.following.includes(userId)) {
      await user.updateOne({ $pull: { followers: loggedInUserId } });
      await loggedInUser.updateOne({ $pull: { following: userId } });
    } else {
      return res.status(400).json({
        message: "User has not followed yet"
      });
    }

    return res.status(200).json({
      message: `${loggedInUser.name} unfollowed ${user.name}`,
      success: true
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});




module.exports = router;
