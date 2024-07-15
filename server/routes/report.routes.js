import { Router } from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import getPropertyReport from '../controllers/report-controllers/get-property-report.controller.js'
import getActivityReport from '../controllers/report-controllers/get-activity-report.controller.js'
import captureIpAddress from '../middlewares/ip.middleware.js'

const reportRoutes = Router()

reportRoutes.post(
  '/get-property-report',
  authMiddleware,
  captureIpAddress,
  getPropertyReport
)
reportRoutes.post(
  '/get-activity-report',
  authMiddleware,
  captureIpAddress,
  getActivityReport
)

export default reportRoutes
