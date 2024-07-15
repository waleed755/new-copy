import activityModel from '../../models/activity.model.js'
import s3 from '../../awsConfig.js'
import officerResponseModel from '../../models/officer-response.model.js'
import userModel from '../../models/user.model.js'
import dotenv from 'dotenv'

dotenv.config()

export const updateOfficerResponse = async (req, res) => {
  const { officerResponseId } = req.params // Extract officerResponseId from URL parameter
  const { officerResponseData } = req.body
  const parsedOfficerResponseData = JSON.parse(officerResponseData)
  console.log('parsedOfficerResponseData', parsedOfficerResponseData)

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    // ! finding the login user
    const user = await userModel.findById(req.userId)

    const photosData =
      req.files && req.files['photos'] ? req.files['photos'] : []
    console.log('photosData  = ', photosData)
    const videosData =
      req.files && req.files['videos'] ? req.files['videos'] : []

    const photosUploadPromises = photosData?.map(async file => {
      const photosParams = {
        Bucket: `${process.env.AWS_S3_BUCKET_NAME}`,
        Key: `${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ACL: `${process.env.AWS_S3_ACL}`,
      }
      console.log('photosParams', photosParams)
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

    console.log('photosUploadResponses = ', photosUploadResponses)
    console.log('videosUploadResponses = ', videosUploadResponses)
    const photosUrls = photosUploadResponses.map(response => response.Location)
    const videosUrls = videosUploadResponses.map(response => response.Location)

    parsedOfficerResponseData.officerPhotos = [
      ...photosUrls,
      ...parsedOfficerResponseData.officerFiles,
    ]
    parsedOfficerResponseData.officerVideos = videosUrls
    console.log('officerResponseId', officerResponseId)

    const updatedOfficerResponse = await officerResponseModel.findByIdAndUpdate(
      officerResponseId,
      parsedOfficerResponseData,
      { new: true }
    )
    if (!updatedOfficerResponse) {
      return res
        .status(404)
        .json({ error: true, message: 'Officer Response is Not Updated!!' })
    }

    const activity = await activityModel.findById(
      updatedOfficerResponse.activityId
    )
    activity.officerResponseUpdatedAtDate = updatedOfficerResponse.updatedAt
    activity.officerResponseModifiedByUserId = user._id
    activity.officerResponseModifiedByUserName = user.fullName
    await activity.save()

    res.json({
      success: true,
      message: 'Officer Response has been Updated!',
      officerResponse: updatedOfficerResponse,
    })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message })
  }
}

export default updateOfficerResponse
