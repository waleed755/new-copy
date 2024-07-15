import { Router } from 'express'
import addStatus from '../../controllers/property-select-controllers/status-controllers/add-status.controller.js'
import getAllStatuses from '../../controllers/property-select-controllers/status-controllers/get-status.controller.js'
import authMiddleware from '../../middlewares/auth.middleware.js'

const statusRoutes = Router()

statusRoutes.post('/add-status', authMiddleware, addStatus)
statusRoutes.post('/get-status', authMiddleware, getAllStatuses)

export default statusRoutes
