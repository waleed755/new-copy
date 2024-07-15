import { Router } from 'express'
import login from '../controllers/auth-controllers/login.controller.js'
import register from '../controllers/auth-controllers/register.controller.js'
import verifyEmail from '../controllers/auth-controllers/email-verification.controller.js'
import resetPassword from '../controllers/auth-controllers/reset-password.controller.js'
import otpVerify from '../controllers/auth-controllers/otp-verify.controller.js'
import reSendOTP from '../controllers/auth-controllers/resend-otp.controller.js'
import captureIpAddress from '../middlewares/ip.middleware.js'

const authRoutes = Router()

// const storage = multer.memoryStorage()

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
// }).fields([
//   // { name: 'userPhoto', maxCount: 1 }, // handle single user photo
//   { name: 'userPhoto' },
// ])

authRoutes.post('/login', captureIpAddress, login)
authRoutes.post('/register', captureIpAddress, register)
authRoutes.post('/verify-email', captureIpAddress, verifyEmail)
authRoutes.post('/verify-otp', captureIpAddress, otpVerify)
authRoutes.post('/resend-otp', captureIpAddress, reSendOTP)
authRoutes.post('/reset-password', captureIpAddress, resetPassword)

export default authRoutes
