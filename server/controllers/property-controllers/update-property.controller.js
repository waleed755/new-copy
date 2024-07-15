import branchModel from '../../models/branch.model.js'
import customerModel from '../../models/customer.model.js'
import aiModel from '../../models/property-select-models/ai.model.js'
import categoryModel from '../../models/property-select-models/category.model.js'
import chargeAbleModel from '../../models/property-select-models/charge-able.model.js'
import flatFeeServiceModel from '../../models/property-select-models/flat-fee-service.model.js'
import keysModel from '../../models/property-select-models/keys.model.js'
import pointOfContactModel from '../../models/property-select-models/point-of-contact.model.js'
import statusModel from '../../models/property-select-models/status.model.js'
import subscriptionFeeModel from '../../models/property-select-models/subscription-fee.model.js'
import typeModel from '../../models/property-select-models/type.model.js'
import propertyModel from '../../models/property.model.js'
import s3 from '../../awsConfig.js'
import dotenv from 'dotenv'

dotenv.config()

export const updateProperty = async (req, res) => {
  const { propertyId } = req.params // Extract propertyId from URL parameter
  const { propertyData } = req.body
  const parsedPropertyData = JSON.parse(propertyData)
  console.log('parsedPropertyData', parsedPropertyData)

  let propertyPointOfContact = []
  let propertyFlatFeeService = []

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    const aiFilesData =
      req.files && req.files['aiFiles'] ? req.files['aiFiles'] : []
    const keyImagesData =
      req.files && req.files['keyImages'] ? req.files['keyImages'] : []
    const propertyPhotosData =
      req.files && req.files['propertyPhotos']
        ? req.files['propertyPhotos']
        : []

    // console.log('aiFiles--1',aiFiles)
    // Upload AI files
    const aiFilesUploadPromises = aiFilesData?.map(async file => {
      const aiFilesParams = {
        Bucket: `${process.env.AWS_S3_BUCKET_NAME}`,
        Key: `${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ACL: `${process.env.AWS_S3_ACL}`,
      }
      console.log('aiFilesParams', aiFilesParams)
      return s3.upload(aiFilesParams).promise()
    })

    const keyImagesUploadPromises = keyImagesData?.map(async file => {
      const keyImagesParams = {
        Bucket: `${process.env.AWS_S3_BUCKET_NAME}`,
        Key: `${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ACL: `${process.env.AWS_S3_ACL}`,
      }

      return s3.upload(keyImagesParams).promise()
    })

    const propertyPhotosUploadPromises = propertyPhotosData?.map(async file => {
      const propertyPhotosParams = {
        Bucket: `${process.env.AWS_S3_BUCKET_NAME}`,
        Key: `${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ACL: `${process.env.AWS_S3_ACL}`,
      }

      return s3.upload(propertyPhotosParams).promise()
    })

    // Execute all upload promises concurrently
    const [
      aiFilesUploadResponses,
      keyImagesUploadResponses,
      propertyPhotosUploadResponses,
    ] = await Promise.all([
      Promise.all(aiFilesUploadPromises),
      Promise.all(keyImagesUploadPromises),
      Promise.all(propertyPhotosUploadPromises),
    ])

    console.log('aiFilesUploadResponses = ', aiFilesUploadResponses)
    console.log('keyImagesUploadResponses = ', keyImagesUploadResponses)
    console.log(
      'propertyPhotosUploadResponses = ',
      parsedPropertyData.aiFileUrls
    )

    const aiFileUrls = aiFilesUploadResponses.map(response => response.Location)
    const keyImageUrls = keyImagesUploadResponses.map(
      response => response.Location
    )
    const propertyPhotosUrls = propertyPhotosUploadResponses.map(
      response => response.Location
    )

    if (!Array.isArray(parsedPropertyData.aiFileUrls)) {
      parsedPropertyData.aiFileUrls = []
    }

    parsedPropertyData.aiFiles = [
      ...aiFileUrls,
      ...parsedPropertyData.aiFileUrls,
    ]
    parsedPropertyData.keyImages = [
      ...keyImageUrls,
      ...parsedPropertyData.keyFiles,
    ]
    parsedPropertyData.propertyPhotos = propertyPhotosUrls

    // Check if the property exists
    const property = await propertyModel.findById(propertyId)

    if (!property) {
      return res
        .status(404)
        .json({ error: true, message: 'Property not found' })
    }

    // function for PointOfContact Values
    const setPointOfContactValues = async id => {
      if (id) {
        const pointOfContact = await pointOfContactModel.findById(id)
        if (pointOfContact) {
          propertyPointOfContact.push({
            id: pointOfContact._id,
            name: pointOfContact?.name,
            address: pointOfContact?.address,
            postCode: pointOfContact?.postCode,
            city: pointOfContact?.city,
            contact: pointOfContact?.contact,
            email: pointOfContact?.email,
          })
        }
      }
    }

    // function for FlatFeeServices Values
    const setFlatFeeServicesValues = async flatService => {
      if (flatService) {
        const flatFee = await flatFeeServiceModel.findById(flatService.id)
        if (flatService) {
          propertyFlatFeeService.push({
            serviceId: flatFee._id,
            serviceName: flatFee?.value,
            initialTimeMinutes: flatService?.initialTimeMinutes,
            initialTimeFees: flatService?.initialTimeFees,
            additionalTimeMinutes: flatService?.additionalTimeMinutes,
            additionalTimeFees: flatService?.additionalTimeFees,
          })
        }
      }
    }

    //
    const customer = await customerModel.findById(parsedPropertyData.customerId)
    const branch = await branchModel.findById(parsedPropertyData.branchId)

    parsedPropertyData.branchId = branch._id
    parsedPropertyData.branchName = branch.branchName
    parsedPropertyData.customerId = customer._id
    parsedPropertyData.customerName = customer.accountName

    // if Status is Updated
    if (parsedPropertyData.statusId) {
      const status =
        parsedPropertyData.statusId &&
        (await statusModel.findById(parsedPropertyData.statusId))

      const propertyStatus = status && { id: status._id, value: status.value }

      parsedPropertyData.propertyStatus = propertyStatus
    }

    // if Category is Updated
    if (parsedPropertyData.categoryId) {
      const category =
        parsedPropertyData.categoryId &&
        (await categoryModel.findById(parsedPropertyData.categoryId))

      const propertyCategory = category && {
        id: category._id,
        value: category.value,
      }

      parsedPropertyData.propertyCategory = propertyCategory
    }

    // if Address Updated
    const propertyAddress = parsedPropertyData.address && {
      address: parsedPropertyData?.address,
      city: parsedPropertyData?.city,
      postCode: parsedPropertyData?.postCode,
    }
    parsedPropertyData.propertyAddress = propertyAddress

    // if Type is Updated
    if (parsedPropertyData.typeId) {
      const type =
        parsedPropertyData.typeId &&
        (await typeModel.findById(parsedPropertyData.typeId))

      const propertyType = type && {
        id: type._id,
        value: type.value,
      }

      parsedPropertyData.propertyType = propertyType
    }

    // if AI is Updated
    if (parsedPropertyData.aiID) {
      const ai =
        parsedPropertyData.aiID &&
        (await aiModel.findById(parsedPropertyData.aiID))

      const propertyAI = ai && {
        id: ai._id,
        value: ai.value,
      }

      parsedPropertyData.propertyAI = propertyAI
    }

    // if Point of Contact is Updated
    if (
      parsedPropertyData.pointOfContact &&
      Array.isArray(parsedPropertyData.pointOfContact)
    ) {
      for (const pointId of parsedPropertyData.pointOfContact) {
        await setPointOfContactValues(pointId)
      }
      parsedPropertyData.propertyPointOfContact = propertyPointOfContact
    }

    // if keys are Updated
    if (parsedPropertyData.keysId) {
      const keys =
        parsedPropertyData.keysId &&
        (await keysModel.findById(parsedPropertyData.keysId))

      const propertyKeys = keys && {
        id: keys._id,
        value: keys.value,
      }

      parsedPropertyData.propertyKeys = propertyKeys
    }

    // if chargeAble are Updated
    if (parsedPropertyData.propertyChargeable) {
      const chargeAble =
        parsedPropertyData.propertyChargeable &&
        (await chargeAbleModel.findById(parsedPropertyData.propertyChargeable))

      const propertyChargeable = chargeAble && {
        id: chargeAble._id,
        value: chargeAble.value,
      }

      parsedPropertyData.propertyChargeable = propertyChargeable
    }

    // if Subscription are Updated
    if (parsedPropertyData.subscriptionFeeId) {
      const subscriptionFee =
        parsedPropertyData.subscriptionFeeId &&
        (await subscriptionFeeModel.findById(
          parsedPropertyData.subscriptionFeeId
        ))

      const propertySubscriptionFee = subscriptionFee && {
        id: subscriptionFee._id,
        value: subscriptionFee.value,
      }

      parsedPropertyData.propertySubscriptionFee = propertySubscriptionFee
    }

    // if Flat Fee Services Updated
    if (
      parsedPropertyData.flatFeeService &&
      Array.isArray(parsedPropertyData.flatFeeService)
    ) {
      for (const flatFeeService of parsedPropertyData.flatFeeService) {
        await setFlatFeeServicesValues(flatFeeService)
      }

      parsedPropertyData.propertyFlatFeeServiceData = propertyFlatFeeService
    }

    const updateProperty = await propertyModel.findByIdAndUpdate(
      propertyId,
      parsedPropertyData,
      { new: true }
    )

    if (!updateProperty) {
      return res
        .status(404)
        .json({ error: true, message: 'Property not Updated!' })
    }

    res.json({
      success: true,
      message: 'Property updated successfully',
      property: updateProperty,
    })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message })
  }
}

export default updateProperty
