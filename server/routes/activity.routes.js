import { Router } from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import addActivity from '../controllers/activity-controllers/add-activity.controller.js'
import getAllActivities from '../controllers/activity-controllers/get-activity.controller.js'
import getSingleActivity from '../controllers/activity-controllers/get-single-activity.controller.js'
import getActivitiesByType from '../controllers/activity-controllers/get-activity-type.controller.js'
import getFilteredActivity from '../controllers/activity-controllers/activity-filter.controller.js'
import updateActivityStatus from '../controllers/activity-controllers/update-activity-status.controller.js'
import assignActivityToUser from '../controllers/activity-controllers/assign-activity.model.js'
import updateActivity from '../controllers/activity-controllers/update-activity.controller.js'
import getUserAssignedActivities from '../controllers/activity-controllers/get-user-assigned-activities.controller.js'
import getTodayActivities from '../controllers/activity-controllers/get-today-activities.controller.js'
import captureIpAddress from '../middlewares/ip.middleware.js'
import downloadActivityInvite from '../controllers/activity-controllers/download-activity-invite.controller.js'
import cancelActivity from '../controllers/activity-controllers/update-activity-cancel.controller.js'

const activityRoutes = Router()

activityRoutes.post(
  '/add-activity',
  authMiddleware,
  captureIpAddress,
  addActivity
)
activityRoutes.post(
  '/get-activities',
  authMiddleware,
  captureIpAddress,
  getAllActivities
)

activityRoutes.post(
  '/get-today-activities',
  authMiddleware,
  captureIpAddress,
  getTodayActivities
)

activityRoutes.post(
  '/update-activity-status',
  authMiddleware,
  captureIpAddress,
  updateActivityStatus
)
activityRoutes.post(
  '/get-activity/:activityId',
  authMiddleware,
  captureIpAddress,
  getSingleActivity
)
activityRoutes.post(
  '/activity/:activityId',
  authMiddleware,
  captureIpAddress,
  updateActivity
)
activityRoutes.post(
  '/get-activities-by-type',
  authMiddleware,
  captureIpAddress,
  getActivitiesByType
)

activityRoutes.post(
  '/get-filtered-activities',
  authMiddleware,
  captureIpAddress,
  getFilteredActivity
)

activityRoutes.post(
  '/assign-activity',
  authMiddleware,
  captureIpAddress,
  assignActivityToUser
)
activityRoutes.post(
  '/get-user-assigned-activity',
  authMiddleware,
  captureIpAddress,
  getUserAssignedActivities
)

activityRoutes.post(
  '/cancel-activity',
  authMiddleware,
  captureIpAddress,
  cancelActivity
)

// public url
activityRoutes.post(
  '/download-activity-invite',
  captureIpAddress,
  downloadActivityInvite
)

export default activityRoutes
