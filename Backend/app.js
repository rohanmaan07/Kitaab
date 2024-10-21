const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const User = require("./Routes/user");
const Book = require("./Routes/book");
const Fav = require("./Routes/fav");
const Order = require("./Routes/order");
const Cart = require("./Routes/cart");
const main = require("./Connections/conn");
require("dotenv").config();

const _dirname=path.resolve();

main()
  .then(() => {
    console.log("MongoDB connected successfully..");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });


app.use(express.json());

// Routes
app.use(cors());
app.use("/api/v1", User);
app.use("/api/v1", Book);
app.use("/api/v1", Fav);
app.use("/api/v1", Order);
app.use("/api/v1", Cart);

app.use(express.static(path.join(_dirname,"/Frontend/dist")));
app.get('*',(_,res)=>{
  res.sendFile(path.resolve(_dirname,"Frontend","dist","index.html"));
});

app.listen(8080, () => {
  console.log("Server is listening on port 8080..");
});
