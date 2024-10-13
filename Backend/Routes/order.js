const router = require("express").Router();
const User = require("../Models/user");
const Order = require("../Models/order");
const { authenticateToken } = require("./userAuth");



router.post("/placeOrder", authenticateToken, async (req, res) => {
  try {
      const { id } = req.headers; 
      const { order } = req.body; 

      for (const orderData of order) {
          const newOrder = new Order({ 
              User: id,
              book: orderData._id,
          });

          const orderDataFromDb = await newOrder.save();

          await User.findByIdAndUpdate(id, {
              $push: { orders: orderDataFromDb._id },
          });

          // Remove the book from the user's cart
          await User.findByIdAndUpdate(id, {
              $pull: { carts: orderData._id },
          });
      }

      return res.json({
          status: "success",
          message: "Order(s) placed successfully and cart cleared.",
      });

  } catch (err) {
      console.error(err); // Log the error for debugging
      res.status(500).json({ message: "Internal Server Error" });
  }
});

//get order History of particular user..
router.get("/getOrderHistory", authenticateToken, async (req, res) => {
    try {
      const { id } = req.headers;
      const userData = await User.findById(id)
        .populate({
          path: "orders",
          populate: { path: "book" }, 
        });
  
      if (!userData || !userData.orders) {
        return res.status(404).json({ message: "No order history found." });
      }
  
      const orderData = userData.orders.reverse();
  
      return res.json({
        status: "success",
        data: orderData,
      });
    } catch (error) {
      console.error("Error fetching order history:", error);
      return res.status(500).json({ message: "An error occurred" });
    }
  });
  
  

//get-all-order ----admin
router.get("/get-all-orders", authenticateToken, async (req, res) => {
    try {
        const userData = await Order.find()
            .populate({
                path: "book",
            })
            .populate({
                path: "user",
            })
            .sort({ createdAt: -1 });
        
        return res.json({
            status: "Success",
            data: userData,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});
//update Order Admin..

router.put("/update-status/:id", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params; // Get ID from URL params, not headers
      const { status } = req.body; // Get status from the body
  
      // Validate the status against the allowed statuses
      if (!["Order Placed", "Out for Delivery", "Delivered", "Cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
  
      // Update the order status
      await Order.findByIdAndUpdate(id, { status }, { new: true });
      return res.json({
        status: "Success",
        message: "Status updated successfully.",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "An error occurred" });
    }
  });
  
module.exports = router;
