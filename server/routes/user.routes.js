import { Router } from 'express'
import addUser from '../controllers/user-controllers/add-user.controller.js'
import inviteUser from '../controllers/user-controllers/invite-user.controller.js'
import findUser from '../controllers/user-controllers/find-user.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import registerUser from '../controllers/user-controllers/register-user.controller.js'
import getAllUsers from '../controllers/user-controllers/get-users.controller.js'
import getSingleUser from '../controllers/user-controllers/get-single-user.controller.js'
import updateUser from '../controllers/user-controllers/update-user.controller.js'
import userStatusToggler from '../controllers/user-controllers/user-status-toggle.controller.js'
import fillUserPassword from '../controllers/user-controllers/fill-user-password.controller.js'
import captureIpAddress from '../middlewares/ip.middleware.js'
import multer from 'multer'
import updateUserMfa from '../controllers/user-controllers/user-mfa.controller.js'

const userRoutes = Router()

const storage = multer.memoryStorage()

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
}).fields([
  { name: 'userPhoto', maxCount: 1 }, // handle single user photo
])

userRoutes.post('/add-user', authMiddleware, captureIpAddress, upload, addUser)
userRoutes.post('/get-all-users', authMiddleware, captureIpAddress, getAllUsers)
userRoutes.post(
  '/get-user/:userId',
  authMiddleware,
  captureIpAddress,
  getSingleUser
)
userRoutes.post(
  '/update-user/:userId',
  authMiddleware,
  captureIpAddress,
  upload,
  updateUser
)
userRoutes.post(
  '/user-status-toggler',
  authMiddleware,
  captureIpAddress,
  userStatusToggler
)
userRoutes.post('/register-user/:companyId', captureIpAddress, registerUser)
userRoutes.post('/invite-user', authMiddleware, captureIpAddress, inviteUser)
userRoutes.post(
  '/fill-user-password/:userId',
  captureIpAddress,
  fillUserPassword
)
userRoutes.post('/find-user', authMiddleware, captureIpAddress, findUser)
userRoutes.post('/find-user', authMiddleware, captureIpAddress, findUser)
userRoutes.post(
  '/set-user-mfa',
  authMiddleware,
  captureIpAddress,
  updateUserMfa
)

export default userRoutes
