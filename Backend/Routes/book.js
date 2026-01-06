const router = require("express").Router();
const User = require("../Models/user");
const Book = require("../Models/book");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");
require('dotenv').config();


const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Set up Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'book_covers', // Optional: Specify a folder in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

// Set up multer with the Cloudinary storage
const upload = multer({ storage: storage });

// Add Book route
router.post("/addBook", upload.single('url'), authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has admin privileges
    if (user.role !== "admin") {
      return res.status(403).json({ message: "You do not have access to add a book." });
    }

    // Create a new book
    const book = new Book({
      url: req.file.path,
      tittle: req.body.tittle, 
      author: req.body.author,
      price: req.body.price,
      description: req.body.description,
      language: req.body.language,
    });

    // Save the book to the database
    await book.save();
    res.status(200).json({ message: "Book added successfully." }); // Fix the success message
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


//update Books..
router.put("/updateBook", authenticateToken, async (req, res) => {
  try {
      const { bookid } = req.headers;
      console.log("Book ID:", bookid); // Check if bookid is received correctly

      const updatedBook = await Book.findByIdAndUpdate(bookid, {
          url: req.body.url,
          tittle: req.body.tittle, // Use 'title' instead of 'tittle'
          author: req.body.author,
          price: req.body.price,
          description: req.body.description,
          language: req.body.language,
      }, { new: true });

      if (!updatedBook) {
          return res.status(404).json({ message: "Book not found" });
      }

      res.status(200).json({ message: "Book Updated...", updatedBook }); // Send updated book info
  } catch (err) {
      console.log("Update Error:", err); // Log detailed error for debugging
      return res.status(500).json({ message: "Internal Server Error" });
  }
});


//delete book..

router.delete("/deleteBook",authenticateToken,async(req,res)=>{
  try{
    const { bookid } = req.headers;
    await Book.findByIdAndDelete(bookid);
    return res.status(200).json({ message: "Book Deleted..." });
  }catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
}
})

//recently book added...
router.get("/getAllBook",async(req,res)=>{
  try{
    const book=await Book.find().sort({createdAt:-1});
    return res.json({
      status:"Success..",
      data:book,
    })
  }catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
}
})

//recently added book Limit 4..
router.get("/getAllBookRecently",async(req,res)=>{
  try{
    const book=await Book.find().sort({createdAt:-1}).limit(4);
    return res.json({
      status:"Success..",
      data:book,
    })
  }catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
}
});

//book details by id..
router.get("/getBookDetails/:id",async(req,res)=>{
  try{
    const {id}=req.params;
    const book =await Book.findById(id);
    return res.json({
      status:"Success..",
      data:book,
    })
  }catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
}
})

// Get books by category
router.get("/getBooksByCategory/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const books = await Book.find({ category: category }).sort({ createdAt: -1 });
    return res.json({
      status: "Success",
      data: books,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
