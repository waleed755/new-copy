import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  // Get token from request header
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' })
  }

  // Verify token
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' })
    }
    req.userId = decoded.userId
    next()
  })
}

export default authMiddleware
