import { Router } from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import addStaff from '../controllers/staff-controllers/add-staff.controller.js'
import getAllStaff from '../controllers/staff-controllers/get-staff.controller.js'
import getAllStaffNames from '../controllers/staff-controllers/get-staff-name.controller.js'
import staffStatusToggler from '../controllers/staff-controllers/staff-status-toggle.controller.js'
import updateStaff from '../controllers/staff-controllers/update-staff.controller.js'
import getSingleStaff from '../controllers/staff-controllers/get-single-staff.controller.js'
import captureIpAddress from '../middlewares/ip.middleware.js'

const staffRoutes = Router()

staffRoutes.post('/add-staff', authMiddleware, captureIpAddress, addStaff)
staffRoutes.post(
  '/get-all-staff',
  authMiddleware,
  captureIpAddress,
  getAllStaff
)
staffRoutes.post(
  '/get-staff-names',
  authMiddleware,
  captureIpAddress,
  getAllStaffNames
)
staffRoutes.post(
  '/staff-status-toggler',
  authMiddleware,
  captureIpAddress,
  staffStatusToggler
)
staffRoutes.post(
  '/staff/:staffId',
  authMiddleware,
  captureIpAddress,
  updateStaff
)
staffRoutes.post(
  '/get-staff/:staffId',
  authMiddleware,
  captureIpAddress,
  getSingleStaff
)

export default staffRoutes
