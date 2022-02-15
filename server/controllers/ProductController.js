const Product = require("../models/ProductModel");
const ErrorHandler = require("../utils/ErrorHandler");
const CatchAsyncError = require("../middleware/CatchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");
const CatchAsyncErrors = require("../middleware/CatchAsyncErrors");

// Create Product --- Admin
exports.createProduct = CatchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// Get All Products
exports.getAllProducts = CatchAsyncError(async (req, res, next) => {
  const resultPerPage = 8;
  const productCount = await Product.countDocuments();
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeatures.query.clone();
  console.log("products", products);
  let filteredProductsCount = products.length;
  apiFeatures.pagination(resultPerPage);

  products = await apiFeatures.query;
  console.log("products>>>>", products);

  res.status(200).json({
    success: true,
    products,
    productCount,
    resultPerPage,
    filteredProductsCount,
  });
});

// Get Single Product Details
exports.getProductDetails = CatchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Update Product --- Admin
exports.updateProduct = CatchAsyncError(async (req, res) => {
  let product = await Product.findById(req.params.id);

  // if (!product) {
  //     return res.status(500).json({
  //         success: false,
  //         message: "Product not found",
  //     });
  // }
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    findByIdAndUpdate: true,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete Product --- Admin
exports.deleteProduct = CatchAsyncError(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  // await product.findByIdAndDelete(req.params.id);
  await product.remove();
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

//Reviews
// create new review or update the review
exports.createProductReview = CatchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  // if for edit reviews
  // else for create reviews
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numberOfReviews = product.reviews.length;
  }

  // overall rating
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

// Get All reviews of product
exports.getAllReviews = CatchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete reviews

exports.DeleteReview = CatchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );
  console.log("reviews", reviews);

  // overall rating(avg rating)
  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  const ratings = avg / reviews.length;

  const numberOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numberOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
