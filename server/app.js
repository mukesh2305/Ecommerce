const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const ErrorMiddleware = require("./middleware/Error");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Route imports
const product = require("./routes/ProductsRoutes");
const user = require("./routes/UserRoutes");
const order = require("./routes/OrderRoutes");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);

// Middleware for Error Handling
app.use(ErrorMiddleware);

module.exports = app;
