import { Router } from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import multer from 'multer'
import addOfficerResponse from '../controllers/officer-response-controller/add-officer-response.controller.js'
import getAllOfficersResponse from '../controllers/officer-response-controller/get-All-officer-responses.controller.js'
import getSingleOfficerResponse from '../controllers/officer-response-controller/get-officer-response.controller.js'
import updateOfficerResponse from '../controllers/officer-response-controller/update-officer-response.controller.js'
import officerResponseAlreadyFilled from '../controllers/officer-response-controller/officer-response-already-filled.controller.js'
import updateOfficerResponseAlreadyFilled from '../controllers/officer-response-controller/update-response-already-filled.controller.js'
import captureIpAddress from '../middlewares/ip.middleware.js'
import getSingleOfficerResponsePublic from '../controllers/officer-response-controller/get-officer-response-public.controller.js'
import resetOfficerResponseAlreadyFilled from '../controllers/officer-response-controller/reset-officer-response-already-filled.controller.js'

const officerResponseRoutes = Router()

const storage = multer.memoryStorage()

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
}).fields([
  { name: 'photos' }, // handle multiple photos
  { name: 'videos' }, // handle multiple videos
])

officerResponseRoutes.post(
  '/add-officer-response/:activityId',
  authMiddleware,
  captureIpAddress,
  upload,
  addOfficerResponse
)
officerResponseRoutes.post(
  '/officer-response/:officerResponseId',
  authMiddleware,
  captureIpAddress,
  upload,
  updateOfficerResponse
)

officerResponseRoutes.post(
  '/get-all-officers-response',
  authMiddleware,
  captureIpAddress,
  getAllOfficersResponse
)

officerResponseRoutes.post(
  '/get-single-officer-response',
  authMiddleware,
  captureIpAddress,
  getSingleOfficerResponse
)

officerResponseRoutes.post(
  '/officer-response-already-filled/:activityId',
  authMiddleware,
  captureIpAddress,
  officerResponseAlreadyFilled
)

officerResponseRoutes.post(
  '/update-officer-response-already-filled/:officerResponseId',
  authMiddleware,
  captureIpAddress,
  updateOfficerResponseAlreadyFilled
)

officerResponseRoutes.post(
  '/reset-officer-response-already-filled/:officerResponseId',
  authMiddleware,
  captureIpAddress,
  resetOfficerResponseAlreadyFilled
)

//  public Urls
officerResponseRoutes.post(
  '/get-single-officer-response-public',
  captureIpAddress,
  getSingleOfficerResponsePublic
)

export default officerResponseRoutes
