const Order = require('../models/OrderModel');
const Product = require('../models/ProductModel');
const ErrorHandler = require('../utils/ErrorHandler');
const CatchAsyncError = require("../middleware/CatchAsyncErrors");

// Create new Order
exports.newOrder = CatchAsyncError(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        order
    })
})

// Get Single Order
exports.getSingleOrder = CatchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if (!order) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    res.status(200).json({
        success: true,
        order
    })
});


// Get logged in user Orders
exports.myOrders = CatchAsyncError(async (req, res, next) => {
    const order = await Order.find({ user: req.user._id })


    res.status(200).json({
        success: true,
        order
    })
});

// Get All Orders --- Admin
exports.getAllOrders = CatchAsyncError(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    })
});

// update Order Status --- Admin
exports.updateOrder = CatchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);


    if (!order) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }
    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have already delivered this Order ", 400));
    }

    order.orderItems.forEach(async (o) => {
        await updateStock(o.product, o.quantity);
    })
    console.log("order.orderStatus", order.orderStatus)

    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }
    await order.save({ validateBeforeSave: false });


    res.status(200).json({
        success: true,
    })
});

// updateStock to update stock for given product
async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    product.stock = product.stock - quantity;

    await product.save({ validateBeforeSave: false });
}


// delete Order --- Admin
exports.deleteOrder = CatchAsyncError(async (req, res, next) => {
    const orders = await Order.findById(req.params.id);

    if (!orders) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }
    await orders.remove();

    res.status(200).json({
        success: true,
        message: "Order deleted successfully",
    })
});



