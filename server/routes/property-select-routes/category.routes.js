import { Router } from 'express'
import getAllCategory from '../../controllers/property-select-controllers/category-controllers/get-category.controller.js'
import addCategory from '../../controllers/property-select-controllers/category-controllers/add-category.controller.js'
import authMiddleware from '../../middlewares/auth.middleware.js'

const categoryRoutes = Router()

categoryRoutes.post('/add-category', authMiddleware, addCategory)
categoryRoutes.post('/get-category', authMiddleware, getAllCategory)

export default categoryRoutes
