import { Router } from 'express'
import addType from '../../controllers/property-select-controllers/type-controllers/add-type.controller.js'
import getAllTypes from '../../controllers/property-select-controllers/type-controllers/get-type.controller.js'
import authMiddleware from '../../middlewares/auth.middleware.js'

const typeRoutes = Router()

typeRoutes.post('/add-type', authMiddleware, addType)
typeRoutes.post('/get-type', authMiddleware, getAllTypes)

export default typeRoutes
