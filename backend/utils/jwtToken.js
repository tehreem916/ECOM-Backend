module.exports = (user, statusCode, res) => {
  const token = user.getJWTToken();
  const expires = Number(process.env.COOKIE_EXPIRE || 7);
  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(Date.now() + expires * 24 * 60 * 60 * 1000),
      httpOnly: true
    })
    .json({ success: true, token, user });
};
