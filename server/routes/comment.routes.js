import { Router } from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import addComment from '../controllers/comment/add-comment.controller.js'
import captureIpAddress from '../middlewares/ip.middleware.js'

const commentRoutes = Router()

commentRoutes.post('/activity-comment', authMiddleware,captureIpAddress, addComment)

export default commentRoutes
