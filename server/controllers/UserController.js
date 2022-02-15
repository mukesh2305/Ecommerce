const ErrorHandler = require("../utils/ErrorHandler");
const CatchAsyncError = require("../middleware/CatchAsyncErrors");
const User = require("../models/UserModel");
const sendToken = require("../utils/jwtTokens");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
// Registe a new user
exports.registerUser = CatchAsyncError(async (req, res, next) => {
    console.log("this");
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "this is public id",
            url: "profilepicUrl",
        },
    });

    sendToken(user, 201, res);

    // const token = user.getJWTToken();

    // res.status(201).json({
    //     success: true,
    //     token,
    // });
});

// Login User
exports.loginUser = CatchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    // checking if user has given email and password both
    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email and Password", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    // console.log(user);
    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password values", 401));
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid Email or Password ", 401));
    }

    sendToken(user, 200, res);
});

// Logout User
exports.logoutUser = CatchAsyncError((req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out Successfully",
    });
});

// Forgot Password
exports.forgotPassword = CatchAsyncError(async (req, res, next) => {
    const user = await User.findOne({
        email: req.body.email
    });

    if (!user) {
        return next(new ErrorHandler("User Not Found", 404));
    }

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token link is :-\n\n ${resetPasswordUrl} \n\n If you didn't request this, please ignore this email.\n\n`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Ecommerce Password Recovery",
            message,
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
})

// Reset Password
exports.resetPassword = CatchAsyncError(async (req, res, next) => {

    // cretaing token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");


    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
        return next(new ErrorHandler("Reset Password Token is Invalid or has been Expired", 400));
    }

    if (req.body.password !== req.body.confirmpassword) {
        return next(new ErrorHandler("Password and Confirm Password should be same", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);

})

// Get User Details 
exports.getUserDetails = CatchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    console.log("user", user);
    res.status(200).json({
        success: true,
        user
    })
});

// update User password 
exports.updateUserPassword = CatchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatch = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatch) {
        return next(new ErrorHandler("old password is incorrect ", 401));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("password does not match", 401));
    }

    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);
})

// update User profile
exports.updateUserProfile = CatchAsyncError(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }

    // we will add cloudinary later 
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })
    res.status(200).json({
        success: true,
    })
})

// Get All Users --- Admin
exports.getAllUsers = CatchAsyncError(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})

// Get single User --- Admin
exports.getSingleUser = CatchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        new next(new ErrorHandler(`User does not exit with id : ${req.params.id} `, 404))
    }
    res.status(200).json({
        success: true,
        user
    })
})

// update User role --- Admin
exports.updateUserRole = CatchAsyncError(async (req, res, next) => {
    console.log("this");
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })
    res.status(200).json({
        success: true,
    })
})

// Delete User  --- Admin
exports.deleteUser = CatchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.params.id);
    if (!user) {
        next(new ErrorHandler(`User does not exit with id: ${req.params.id}`, 404))
    }

    await user.remove();
    // we will remove cloudinary later 

    res.status(200).json({
        success: true,
        message: "User Deleted successfully",
    })
})



