import activityModel from '../../models/activity.model.js'
import s3 from '../../awsConfig.js'
import officerResponseModel from '../../models/officer-response.model.js'
import userModel from '../../models/user.model.js'
import auditReport from '../../services/audit-report.service.js'
import dotenv from 'dotenv'

dotenv.config()

export const addOfficerResponse = async (req, res) => {
  const { activityId } = req.params // Extract activityId from URL parameter
  const ipAddress = req.ipAddress
  const { officerResponseData } = req.body
  const parsedOfficerResponseData = JSON.parse(officerResponseData)
  // console.log('parsedOfficerResponseData', parsedOfficerResponseData)

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    // ! finding the login user
    const user = await userModel.findById(req.userId)

    // Check if the activity exists
    const activity = await activityModel.findById(activityId)
    parsedOfficerResponseData.activityId = activity._id
    parsedOfficerResponseData.activityType = activity.activityType

    if (!activity) {
      return res
        .status(404)
        .json({ error: true, message: 'Activity not found' })
    }

    const photosData =
      req.files && req.files['photos'] ? req.files['photos'] : []
    console.log('photosData  = ', photosData)
    const videosData =
      req.files && req.files['videos'] ? req.files['videos'] : []

    // console.log('photos--1',photos)
    const photosUploadPromises = photosData?.map(async file => {
      const photosParams = {
        Bucket: `${process.env.AWS_S3_BUCKET_NAME}`,
        Key: `${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ACL: `${process.env.AWS_S3_ACL}`,
      }
      // console.log('photosParams', photosParams)
      return s3.upload(photosParams).promise()
    })

    const videosUploadPromises = videosData?.map(async file => {
      const videosParams = {
        Bucket: `${process.env.AWS_S3_BUCKET_NAME}`,
        Key: `${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ACL: `${process.env.AWS_S3_ACL}`,
      }

      return s3.upload(videosParams).promise()
    })

    // Execute all upload promises concurrently
    const [photosUploadResponses, videosUploadResponses] = await Promise.all([
      Promise.all(photosUploadPromises),
      Promise.all(videosUploadPromises),
    ])

    // console.log('photosUploadResponses = ', photosUploadResponses)
    // console.log('videosUploadResponses = ', videosUploadResponses)
    const photosUrls = photosUploadResponses.map(response => response.Location)
    const videosUrls = videosUploadResponses.map(response => response.Location)

    parsedOfficerResponseData.officerPhotos = photosUrls
    parsedOfficerResponseData.officerVideos = videosUrls

    // const officerResponse = await activityModel.findByIdAndUpdate(
    //   activityId,
    //   parsedOfficerResponseData,
    //   { new: true }
    // )

    const officerResponse = await officerResponseModel.create(
      parsedOfficerResponseData
    )

    //! adding create-OfficerResponse in the audit record
    const officerResponseObjectId = officerResponse._id
    const officerResponseStringId = officerResponseObjectId.toString()
    const officerResponseCurrentDate = new Date()
    const addOfficerResponseAuditReport = await auditReport(
      user._id,
      officerResponseCurrentDate,
      'Officer Response is Added',
      `${user.fullName} has added a new Officer Response`,
      ipAddress,
      'Officer Response',
      officerResponseStringId
    )
    console.log(
      'addOfficerResponseAuditReport = ',
      addOfficerResponseAuditReport
    )

    if (!officerResponse) {
      return res
        .status(404)
        .json({ error: true, message: 'Officer Response is Not Added!!' })
    }

    res.json({
      success: true,
      message: 'Officer Response has been Added!',
      officerResponse: officerResponse,
    })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message })
  }
}

export default addOfficerResponse
