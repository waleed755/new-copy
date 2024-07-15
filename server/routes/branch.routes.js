import { Router } from 'express'
import addBranch from '../controllers/branch-controllers/add-branch.controller.js'
import getAllBranches from '../controllers/branch-controllers/get-branches.controller.js'
import getAllBranchesNames from '../controllers/branch-controllers/get-branches-name.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import updateBranch from '../controllers/branch-controllers/update-branch.controller.js'
import branchStatusToggler from '../controllers/branch-controllers/branch-status-toggle.controller.js'
import getAllBranchesNamesWithActiveStatus from '../controllers/branch-controllers/get-branch-name-with-active-status.contorller.js'
import captureIpAddress from '../middlewares/ip.middleware.js'

const branchRoutes = Router()

branchRoutes.post('/add-branch', authMiddleware, captureIpAddress, addBranch)
branchRoutes.post(
  '/get-branches',
  authMiddleware,
  captureIpAddress,
  getAllBranches
)
branchRoutes.post(
  '/branch-status-toggler',
  authMiddleware,
  captureIpAddress,
  branchStatusToggler
)
branchRoutes.post(
  '/get-branches-names',
  authMiddleware,
  captureIpAddress,
  getAllBranchesNames
)
branchRoutes.post(
  '/get-branches-names-with-active-status',
  authMiddleware,
  captureIpAddress,
  getAllBranchesNamesWithActiveStatus
)
branchRoutes.post(
  '/branch/:branchId',
  authMiddleware,
  captureIpAddress,
  updateBranch
)

export default branchRoutes
