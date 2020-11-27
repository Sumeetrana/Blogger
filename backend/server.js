const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const blogRoutes = require("./routes/blog");
const authRoutes = require("./routes/auth");

const app = express();

mongoose
  .connect(process.env.DATABASE_CLOUD, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"));

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
if ((process.env.NODE_ENV = "developement")) {
  app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}

app.use("/api", blogRoutes);
app.use("/api", authRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
