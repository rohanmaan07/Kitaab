const router = require("express").Router();
const User = require("../Models/user");
const { authenticateToken } = require("./userAuth");

router.put("/addToCart", async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookfav = userData.carts.includes(bookid);
    if (isBookfav) {
      return res.status(200).json({ message: "Book is already in Carts.." });
    }
    await User.findByIdAndUpdate(id, { $push: { carts: bookid } });
    return res.status(200).json({ message: "Book Added to Cart.." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//remove-book from fav ek tarah se updation kr rhe hai yha hum..
router.put("/removeFromCart/:bookid", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.params;
    const { id } = req.headers;

    // Ensure the user exists before trying to update
    const userData = await User.findById(id);
    if (!userData) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found." });
    }

    // Remove the book from the user's cart
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $pull: { carts: bookid } }, // Use 'carts' as per your previous code
      { new: true } // Return the updated document
    );

    // Check if the user was updated
    if (!updatedUser) {
      return res
        .status(400)
        .json({ status: "error", message: "Failed to remove book from cart." });
    }

    return res.json({
      status: "success",
      message: "Book removed from cart.",
    });
  } catch (err) {
    console.error("Error in removeFromCart:", err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

//get FCart of particular user..
router.get("/getUserCart", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate({
      path: "carts",
      model: "book",
    });

    if (!userData || !userData.carts) {
      return res
        .status(404)
        .json({ message: "No Carts books found for this user." });
    }

    const carts = userData.carts;

    return res.json({
      status: "success",
      data: carts,
    });
  } catch (error) {
    console.error("Error in getUserCart:", error);
    return res
      .status(500)
      .json({ status: "error", message: "An error occurred" });
  }
});

module.exports = router;
