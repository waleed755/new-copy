import { Router } from 'express'
import authMiddleware from '../../middlewares/auth.middleware.js'
import addChargeAble from '../../controllers/property-select-controllers/charge-able-controllers/add-charge-able.controller.js'
import getAllChargeAbles from '../../controllers/property-select-controllers/charge-able-controllers/get-charge-able.controller.js'

const chargeAbleRoutes = Router()

chargeAbleRoutes.post('/add-charge-able', authMiddleware, addChargeAble)
chargeAbleRoutes.post('/get-charge-able', authMiddleware, getAllChargeAbles)

export default chargeAbleRoutes
