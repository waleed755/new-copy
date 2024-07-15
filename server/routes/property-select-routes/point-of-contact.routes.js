import { Router } from 'express'
import addPointOfContact from '../../controllers/property-select-controllers/point-of-contact-controllers/add-point-of-contact.controller.js'
import getAllPointOfContacts from '../../controllers/property-select-controllers/point-of-contact-controllers/get-point-of-contact.controller.js'
import authMiddleware from '../../middlewares/auth.middleware.js'

const pointOfContactRoutes = Router()

pointOfContactRoutes.post(
  '/add-point-of-contact',
  authMiddleware,
  addPointOfContact
)
pointOfContactRoutes.post(
  '/get-point-of-contact',
  authMiddleware,
  getAllPointOfContacts
)

export default pointOfContactRoutes
