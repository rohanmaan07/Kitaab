const express = require("express");
const { authenticateToken } = require("./userAuth");
const { createNotification } = require("./notification");

const router = express.Router();

// Models
const Tweet = require("../Models/tweet");
const User = require("../Models/user");

// Routes
// Create Tweet
router.post("/create", authenticateToken, async (req, res) => {
  try {
    const { description, id } = req.body;
    if (!description || !id) {
      return res.status(401).json({
        message: "Fields are required.",
        success: false,
      });
    }
    const user = await User.findById(id).select("-password");
    await Tweet.create({
      description,
      userId: id,
      userDetails: user,
    });
    return res.status(201).json({
      message: "Tweet created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});



// Delete Tweet
router.delete("/delete/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Tweet.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Tweet deleted successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Like or Dislike Tweet
router.put("/like/:id", authenticateToken, async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const tweetId = req.params.id;

    if (!loggedInUserId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({ success: false, message: "Tweet not found" });
    }

    if (tweet.like.includes(loggedInUserId)) {
      // Dislike
      await Tweet.findByIdAndUpdate(tweetId, { $pull: { like: loggedInUserId } });
      return res.status(200).json({
        message: "User disliked your tweet.",
      });
    } else {
      // Like
      await Tweet.findByIdAndUpdate(tweetId, { $push: { like: loggedInUserId } });
      
      // Create notification for tweet owner
      const liker = await User.findById(loggedInUserId);
      await createNotification(
        tweet.userId.toString(),
        loggedInUserId,
        "like",
        `${liker.username} liked your poetry`,
        tweetId
      );
      
      return res.status(201).json({
        message: "User liked your tweet.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});


// Get All Tweets (Smart Feed - For You)
router.get("/alltweets/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const loggedInUser = await User.findById(id);

    if (!loggedInUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Get current time and 1 hour ago
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    // 1. Get recent tweets from following (last 1 hour)
    const recentFollowingTweets = await Tweet.find({
      userId: { $in: loggedInUser.following },
      createdAt: { $gte: oneHourAgo }
    }).sort({ createdAt: -1 });

    // 2. Get user's own recent tweets (last 1 hour)
    const recentOwnTweets = await Tweet.find({
      userId: id,
      createdAt: { $gte: oneHourAgo }
    }).sort({ createdAt: -1 });

    // 3. Get random tweets from all users (for discovery)
    // Exclude already shown tweets and get 20 random posts
    const shownTweetIds = [
      ...recentFollowingTweets.map(t => t._id),
      ...recentOwnTweets.map(t => t._id)
    ];

    const randomTweets = await Tweet.aggregate([
      {
        $match: {
          _id: { $nin: shownTweetIds }
        }
      },
      { $sample: { size: 20 } }, // Get 20 random tweets
      { $sort: { createdAt: -1 } }
    ]);

    // Combine: Recent (following + own) first, then random
    const allTweets = [
      ...recentOwnTweets,
      ...recentFollowingTweets,
      ...randomTweets
    ];

    return res.status(200).json({
      tweets: allTweets,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});


// Get Tweets From Following Users
router.get("/followingtweets/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const loggedInUser = await User.findById(id);

    if (!loggedInUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Fetch tweets from users that the logged-in user is following
    const followingUserTweet = await Promise.all(
      loggedInUser.following.map((otherUsersId) => {
        return Tweet.find({ userId: otherUsersId });
      })
    );

    // Flatten the array of tweets and return the response
    return res.status(200).json({
      tweets: followingUserTweet.flat(),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Get Tweets By Specific User ID (for profile pages)
router.get("/usertweets/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all tweets by this specific user
    const userTweets = await Tweet.find({ userId: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      tweets: userTweets,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});


module.exports = router;

