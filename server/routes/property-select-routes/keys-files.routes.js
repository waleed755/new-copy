import multer from 'multer'
import path from 'path'
import { Router } from 'express'
import authMiddleware from '../../middlewares/auth.middleware.js'
import addKeysFiles from '../../controllers/property-select-controllers/keys-controllers/keys-file-controllers/add-keys-files.controller.js'
import getKeysFiles from '../../controllers/property-select-controllers/keys-controllers/keys-file-controllers/get-keys-files.controller.js'

const keysFilesRoutes = Router()

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

keysFilesRoutes.post(
  '/add-keys-files',
  upload.array('keyImages'),
  authMiddleware,
  addKeysFiles
)
keysFilesRoutes.post('/get-keys-files', authMiddleware, getKeysFiles)

export default keysFilesRoutes
