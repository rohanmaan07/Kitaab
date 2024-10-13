const router = require("express").Router();
const User = require("../Models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");

//signup..
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

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



module.exports = router;
