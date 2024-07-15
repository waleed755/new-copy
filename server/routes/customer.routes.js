import { Router } from 'express'
import addCustomer from '../controllers/customer-controllers/add-customer.controller.js'
import getAllCustomers from '../controllers/customer-controllers/get-customer.controller.js'
import getAllCustomerNames from '../controllers/customer-controllers/get-customer-name.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import updateCustomer from '../controllers/customer-controllers/update-customer.controller.js'
import customerStatusToggler from '../controllers/customer-controllers/customer-status-toggle.controller.js'
import getAllCustomerNamesWithActiveStatus from '../controllers/customer-controllers/get-customer-name-with-active-status.controller.js'
import captureIpAddress from '../middlewares/ip.middleware.js'

const customerRoutes = Router()

customerRoutes.post(
  '/add-customer',
  authMiddleware,
  captureIpAddress,
  addCustomer
)
customerRoutes.post(
  '/get-customers',
  authMiddleware,
  captureIpAddress,
  getAllCustomers
)
customerRoutes.post(
  '/get-customer-names',
  authMiddleware,
  captureIpAddress,
  getAllCustomerNames
)
customerRoutes.post(
  '/get-customer-names-with-active-status',
  authMiddleware,
  captureIpAddress,
  getAllCustomerNamesWithActiveStatus
)
customerRoutes.post(
  '/customer-status-toggler',
  authMiddleware,
  captureIpAddress,
  customerStatusToggler
)
customerRoutes.post(
  '/customer/:customerId',
  authMiddleware,
  captureIpAddress,
  updateCustomer
)

export default customerRoutes
