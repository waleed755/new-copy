import { Router } from 'express'
import addKey from '../../controllers/property-select-controllers/keys-controllers/add-keys.controller.js'
import getAllKeys from '../../controllers/property-select-controllers/keys-controllers/get-keys.controller.js'
import authMiddleware from '../../middlewares/auth.middleware.js'

const keysRoutes = Router()

keysRoutes.post('/add-keys', authMiddleware, addKey)
keysRoutes.post('/get-keys', authMiddleware, getAllKeys)

export default keysRoutes
