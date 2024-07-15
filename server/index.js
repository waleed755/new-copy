import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import companyRoutes from './routes/company.routes.js'
import userRoutes from './routes/user.routes.js'
import authRoutes from './routes/auth.routes.js'
import customerRoutes from './routes/customer.routes.js'
import branchRoutes from './routes/branch.routes.js'
import propertyRoutes from './routes/property.routes.js'
import typeRoutes from './routes/property-select-routes/type.routes.js'
import categoryRoutes from './routes/property-select-routes/category.routes.js'
import statusRoutes from './routes/property-select-routes/status.routes.js'
import aiRoutes from './routes/property-select-routes/ai.routes.js'
import keysRoutes from './routes/property-select-routes/keys.routes.js'
import pointOfContactRoutes from './routes/property-select-routes/point-of-contact.routes.js'
import subscriptionFeeRoutes from './routes/property-select-routes/subscription-fee.routes.js'
import flatFeeServiceRoutes from './routes/property-select-routes/flat-fee-service.routes.js'
import aiFilesRoutes from './routes/property-select-routes/ai-files.routes.js'
import keysFilesRoutes from './routes/property-select-routes/keys-files.routes.js'
import reportRoutes from './routes/report.routes.js'
import chargeAbleRoutes from './routes/property-select-routes/charge-able.routes.js'
import staffRoutes from './routes/staff.routes.js'
import activityRoutes from './routes/activity.routes.js'
import officerResponseRoutes from './routes/officer-response.routes.js'
import commentRoutes from './routes/comment.routes.js'

dotenv.config()
// http://localhost:5173
// https://rapto.uk
const app = express()
app.use(
  cors({
    origin: ['https://rapto.uk'],
    methods: ['POST', 'GET'],
    credentials: true,
  })
)

// app.use(cors())

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MONGODB CONNECTED'))
  .catch(err => console.error(err))

app.get('/', (req, res) => {
  res.json('Welcome to Home Page')
})

app.use('/', authRoutes)
app.use('/', companyRoutes)
app.use('/', userRoutes)
app.use('/', customerRoutes)
app.use('/', branchRoutes)
app.use('/', propertyRoutes)
app.use('/', staffRoutes)
app.use('/', activityRoutes)
app.use('/', officerResponseRoutes)
app.use('/', commentRoutes)

//! property Select Routes
app.use('/', typeRoutes)
app.use('/', categoryRoutes)
app.use('/', statusRoutes)
app.use('/', aiRoutes)
app.use('/', keysRoutes)
app.use('/', pointOfContactRoutes)
app.use('/', subscriptionFeeRoutes)
app.use('/', flatFeeServiceRoutes)
app.use('/', chargeAbleRoutes)

// ! Report Route
app.use('/', reportRoutes)

// ! handling AI & Keys Images/Files
app.use('/', aiFilesRoutes)
app.use('/', keysFilesRoutes)

const PROT = process.env.PROT || 8000
app.listen(PROT, () => {
  console.log(`Server running on PROT ${PROT}`)
})

export default app
