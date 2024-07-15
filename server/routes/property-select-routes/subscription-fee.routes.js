import { Router } from 'express'
import addSubscriptionFee from '../../controllers/property-select-controllers/subscription-fee-controllers/add-subscription-fee.controller.js'
import getAllSubscriptionFees from '../../controllers/property-select-controllers/subscription-fee-controllers/get-subscription-fee.controller.js'
import authMiddleware from '../../middlewares/auth.middleware.js'

const subscriptionFeeRoutes = Router()

subscriptionFeeRoutes.post(
  '/add-subscription-fee',
  authMiddleware,
  addSubscriptionFee
)
subscriptionFeeRoutes.post(
  '/get-subscription-fee',
  authMiddleware,
  getAllSubscriptionFees
)

export default subscriptionFeeRoutes
