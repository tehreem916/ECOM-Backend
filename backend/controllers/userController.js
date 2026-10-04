const crypto = require("crypto");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");

const avatarFromBody = (avatar) => {
    if (!avatar || typeof avatar !== "object" || !avatar.url || !avatar.public_id) {
        throw new ErrorHandler("Please provide an avatar with public_id and url", 400);
    }
    return avatar;
};

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    let avatar;
    try {
        avatar = avatarFromBody(req.body.avatar);
    } catch (error) {
        return next(error);
    }
    const user = await User.create({
        name: req.body.name, email: req.body.email, password: req.body.password, avatar
    });
    sendToken(user, 201, res);
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(new ErrorHandler("Please enter email and password", 400));
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }
    sendToken(user, 200, res);
});

exports.logout = catchAsyncErrors(async (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });
    res.status(200).json({ success: true, message: "Logged out" });
});

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(new ErrorHandler("User not found", 404));
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
    try {
        await sendEmail({
            email: user.email,
            subject: "Ecommerce Password Recovery",
            message: `Your password reset token is:\n\n${resetUrl}`
        });
        res.status(200).json({ success: true, message: `Email sent to ${user.email} successfully` });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        next(new ErrorHandler(error.message, 500));
    }
});

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    const token = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpire: { $gt: Date.now() } });
    if (!user) return next(new ErrorHandler("Reset password token is invalid or has expired", 400));
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords do not match", 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res);
});

exports.getUserDetails = catchAsyncErrors(async (req, res) => {
    res.status(200).json({ success: true, user: await User.findById(req.user._id) });
});

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("+password");
    if (!(await user.comparePassword(req.body.oldPassword))) {
        return next(new ErrorHandler("Old password is incorrect", 400));
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords do not match", 400));
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);
});

exports.updateProfile = catchAsyncErrors(async (req, res) => {
    const data = { name: req.body.name, email: req.body.email };
    if (req.body.avatar) data.avatar = avatarFromBody(req.body.avatar);
    const user = await User.findByIdAndUpdate(req.user._id, data, { new: true, runValidators: true });
    res.status(200).json({ success: true, user });
});

exports.getAllUser = catchAsyncErrors(async (req, res) => {
    res.status(200).json({ success: true, users: await User.find() });
});

exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`, 404));
    res.status(200).json({ success: true, user });
});

exports.updateUserRole = catchAsyncErrors(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id,
        { name: req.body.name, email: req.body.email, role: req.body.role },
        { new: true, runValidators: true });
    res.status(200).json({ success: true, user });
});

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`, 404));
    await user.deleteOne();
    res.status(200).json({ success: true, message: "User deleted successfully" });
});
