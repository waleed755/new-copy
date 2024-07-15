import { Router } from 'express'
import getAllFlatFeeService from '../../controllers/property-select-controllers/flat-free-service-controllers/get-flat-fee-service.controller.js'
import addFlatFeeService from '../../controllers/property-select-controllers/flat-free-service-controllers/add-flat-fee-service.controller.js'
import authMiddleware from '../../middlewares/auth.middleware.js'

const flatFeeServiceRoutes = Router()

flatFeeServiceRoutes.post(
  '/add-flat-fee-service',
  authMiddleware,
  addFlatFeeService
)
flatFeeServiceRoutes.post(
  '/get-flat-fee-service',
  authMiddleware,
  getAllFlatFeeService
)

export default flatFeeServiceRoutes
