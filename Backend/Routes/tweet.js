const express = require("express");
const { authenticateToken } = require("./userAuth");

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
        return res.status(201).json({
          message: "User liked your tweet.",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  });
  

// Get All Tweets (Own + Following)
router.get("/alltweets/:id", authenticateToken, async (req, res) => {
    try {
      const id = req.params.id;
      const loggedInUser = await User.findById(id);
      
      if (!loggedInUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      const loggedInUserTweets = await Tweet.find({ userId: id });
  
      // Fetch tweets from all users the logged-in user is following
      const followingUserTweet = await Promise.all(
        loggedInUser.following.map((otherUsersId) => {
          return Tweet.find({ userId: otherUsersId });
        })
      );
  
      // Flatten the array and merge the tweets
      const allTweets = loggedInUserTweets.concat(...followingUserTweet.flat());
  
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
  

module.exports = router;
