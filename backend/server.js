const express = require("express");
const data = require("./data");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const seedRouter = require("./routes/seedRoutes.js");
const productRouter = require("./routes/productRoutes.js");
const userRouter = require("./routes/userRoutes.js");
const orderRouter = require("./routes/orderRoutes.js");
const uploadRouter = require("./routes/uploadRoutes.js");

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/upload", uploadRouter);
app.use("/api/seed", seedRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
