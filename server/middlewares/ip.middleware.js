export const captureIpAddress = (req, res, next) => {
  const ipAddress =
    req.headers['x-forwarded-for'] ||
    req.headers['cf-connecting-ip'] ||
    req.socket.remoteAddress ||
    null
  req.ipAddress = ipAddress
  next()
}

export default captureIpAddress
