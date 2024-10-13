const router = require("express").Router();
const User = require("../Models/user");
const { authenticateToken } = require("./userAuth");

//add-book to favourite..
router.put("/addBookFav", async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookfav = userData.favourite.includes(bookid);
    if (isBookfav) {
      return res
        .status(200)
        .json({ message: "Book is already in favourite.." });
    }
    await User.findByIdAndUpdate(id, { $push: { favourite: bookid } });
    return res.status(200).json({ message: "Book Added to favourite.." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//remove-book from fav ek tarah se updation kr rhe hai yha hum..
router.put("/removeBookFav", authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.body; 
    const userId = req.headers.id; 

    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const isBookFav = userData.favourite.includes(bookId);
    if (!isBookFav) {
      return res.status(400).json({ message: "Book not in favourites" });
    }

    // Remove the book from the favourites array
    await User.findByIdAndUpdate(userId, { $pull: { favourite: bookId } });

    return res.status(200).json({ message: "Book removed from favourites" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


//get Favourite books of particular user..
router.get("/getFavouriteBooks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate({
      path: "favourite",
      model: "book",
    });

    // If the user does not exist or favourites are empty
    if (!userData || !userData.favourite) {
      return res
        .status(404)
        .json({ message: "No favourite books found for this user." });
    }

    const favouriteBooks = userData.favourite;

    return res.json({
      status: "Success",
      data: favouriteBooks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

module.exports = router;
