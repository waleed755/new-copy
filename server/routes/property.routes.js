import { Router } from 'express'
import addProperty from '../controllers/property-controllers/add-property.controller.js'
import getAllProperties from '../controllers/property-controllers/get-property.controller.js'
import getAllPropertiesNames from '../controllers/property-controllers/get-properties-name.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import getSingleProperty from '../controllers/property-controllers/get-single-property.controller.js'
import updateProperty from '../controllers/property-controllers/update-property.controller.js'
import propertyStatusToggler from '../controllers/property-controllers/property-status-toggle.controller.js'
import getAllBranchesNamesWithActiveStatus from '../controllers/branch-controllers/get-branch-name-with-active-status.contorller.js'
import captureIpAddress from '../middlewares/ip.middleware.js'
import multer from 'multer'

const propertyRoutes = Router()

const storage = multer.memoryStorage()

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
}).fields([
  { name: 'keyImages' }, // handle multiple KeyImages
  { name: 'aiFiles' }, // handle multiple aiFiles
  { name: 'propertyPhotos' }, // handle multiple propertyPhotos
])

propertyRoutes.post(
  '/add-property',
  authMiddleware,
  captureIpAddress,
  upload,
  addProperty
)
propertyRoutes.post(
  '/get-properties',
  authMiddleware,
  captureIpAddress,
  getAllProperties
)
propertyRoutes.post(
  '/property-status-toggler',
  authMiddleware,
  captureIpAddress,
  propertyStatusToggler
)
propertyRoutes.post(
  '/get-property/:propertyId',
  authMiddleware,
  captureIpAddress,
  getSingleProperty
)
propertyRoutes.post(
  '/property/:propertyId',
  authMiddleware,
  captureIpAddress,
  upload,
  updateProperty
)
propertyRoutes.post(
  '/get-properties-names',
  authMiddleware,
  captureIpAddress,
  getAllPropertiesNames
)
propertyRoutes.post(
  '/get-properties-names-with-active-status',
  authMiddleware,
  captureIpAddress,
  getAllBranchesNamesWithActiveStatus
)

export default propertyRoutes
