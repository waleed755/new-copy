import multer from 'multer'
import path from 'path'
import { Router } from 'express'
import authMiddleware from '../../middlewares/auth.middleware.js'
import addAIFiles from '../../controllers/property-select-controllers/ai-controllers/ai-file-controllers/add-ai-files.controller.js'
import getAIFiles from '../../controllers/property-select-controllers/ai-controllers/ai-file-controllers/get-ai-files.controller.js'

const aiFilesRoutes = Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../../../client/public/images') // Where to save the documents
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    )
  },
})

const upload = multer({ storage: storage })

aiFilesRoutes.post(
  '/add-ai-files',
  upload.array('aiFiles'),
  authMiddleware,
  addAIFiles
)
aiFilesRoutes.post('/get-ai-files', authMiddleware, getAIFiles)

export default aiFilesRoutes
