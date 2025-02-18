const adminAuth = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return next(new ErrorHandler("Access denied. Admins only.", 403));
    }
    next();
}

module.exports = adminAuth;