import { Router } from 'express'
import addAI from '../../controllers/property-select-controllers/ai-controllers/add-ai.controller.js'
import getAllAI from '../../controllers/property-select-controllers/ai-controllers/get-ai.controller.js'
import authMiddleware from '../../middlewares/auth.middleware.js'

const aiRoutes = Router()

aiRoutes.post('/add-ai', authMiddleware, addAI)
aiRoutes.post('/get-ai', authMiddleware, getAllAI)

export default aiRoutes
