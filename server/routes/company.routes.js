import { Router } from 'express'
import addCompany from '../controllers/company-controllers/add-company.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import getCompany from '../controllers/company-controllers/get-company.controller.js'
import updateCompany from '../controllers/company-controllers/update-company.controller.js'
import captureIpAddress from '../middlewares/ip.middleware.js'

const companyRoutes = Router()

// const storage = multer.memoryStorage()

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
// }).fields([
//   { name: 'companyLogo', maxCount: 1 }, // handle single company photo
// ])

companyRoutes.post(
  '/register-company',
  authMiddleware,
  captureIpAddress,
  addCompany
)
companyRoutes.post(
  '/update-company/:companyId',
  authMiddleware,
  captureIpAddress,
  updateCompany
)
companyRoutes.post(
  '/get-company/:companyId',
  authMiddleware,
  captureIpAddress,
  getCompany
)

export default companyRoutes
