import userModel from '../../models/user.model.js'
import customerModel from '../../models/customer.model.js'
import branchModel from '../../models/branch.model.js'
import typeModel from '../../models/property-select-models/type.model.js'
import statusModel from '../../models/property-select-models/status.model.js'
import aiModel from '../../models/property-select-models/ai.model.js'
import categoryModel from '../../models/property-select-models/category.model.js'
import keysModel from '../../models/property-select-models/keys.model.js'
import flatFeeServiceModel from '../../models/property-select-models/flat-fee-service.model.js'
import pointOfContactModel from '../../models/property-select-models/point-of-contact.model.js'
import subscriptionFeeModel from '../../models/property-select-models/subscription-fee.model.js'
import propertyModel from '../../models/property.model.js'
import chargeAbleModel from '../../models/property-select-models/charge-able.model.js'
import s3 from '../../awsConfig.js'
import counterModel from '../../models/counter.model.js'
import dotenv from 'dotenv'

dotenv.config()

export const addProperty = async (req, res) => {
  const { propertyData } = req.body
  const ipAddress = req.ipAddress
  const parsedPropertyData = JSON.parse(propertyData)

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  let propertyPointOfContact = []
  let propertyFlatFeeService = []

  const getNextSequenceValue = async sequenceName => {
    const counter = await counterModel.findOneAndUpdate(
      { name: sequenceName },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    )
    return counter.value
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

    // Upload AI files
    const aiFilesUploadPromises = aiFilesData?.map(async file => {
      const aiFilesParams = {
        Bucket: `${process.env.AWS_S3_BUCKET_NAME}`,
        Key: `${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ACL: `${process.env.AWS_S3_ACL}`,
      }
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

    const aiFileUrls = aiFilesUploadResponses.map(response => response.Location)
    const keyImageUrls = keyImagesUploadResponses.map(
      response => response.Location
    )
    const propertyPhotosUrls = propertyPhotosUploadResponses.map(
      response => response.Location
    )

    // !  keyImages: keyFilesUploadResponse.Location,
    // !   aiFiles: aiFilesUploadResponse.Location,

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

    // ! finding the login User
    const user = await userModel.findById(req.userId)

    const customer = await customerModel.findById(parsedPropertyData.customerId)
    const branch = await branchModel.findById(parsedPropertyData.branchId)

    const type = parsedPropertyData.typeId
      ? await typeModel.findById(parsedPropertyData.typeId)
      : null
    const status = parsedPropertyData.statusId
      ? await statusModel.findById(parsedPropertyData.statusId)
      : null

    const chargeable = parsedPropertyData.propertyChargeable
      ? await chargeAbleModel.findById(parsedPropertyData.propertyChargeable)
      : null

    const ai = parsedPropertyData.aiID
      ? await aiModel.findById(parsedPropertyData.aiID)
      : null
    const category = parsedPropertyData.categoryId
      ? await categoryModel.findById(parsedPropertyData.categoryId)
      : null
    const keys = parsedPropertyData.keysId
      ? await keysModel.findById(parsedPropertyData.keysId)
      : null
    const subscriptionFee = parsedPropertyData.subscriptionFeeId
      ? await subscriptionFeeModel.findById(
          parsedPropertyData.subscriptionFeeId
        )
      : null

    // ========  Set Type Values
    const propertyType = type ? { id: type._id, value: type.value } : null

    // ====== Set Status Values
    const propertyStatus = status
      ? { id: status._id, value: status.value }
      : null

    // ====== Set ChargeAble Values
    const propertyChargeable = chargeable
      ? { id: chargeable._id, value: chargeable.value }
      : null

    // ====== Set Category Values
    const propertyCategory = category
      ? { id: category._id, value: category.value }
      : null

    // === Set Ai Values
    const propertyAI = ai ? { id: ai._id, value: ai.value } : null

    //  ====== Set PointOfContact Values
    if (
      parsedPropertyData.pointOfContact &&
      Array.isArray(parsedPropertyData.pointOfContact)
    ) {
      for (const pointId of parsedPropertyData.pointOfContact) {
        await setPointOfContactValues(pointId)
      }
    }

    // ===== Set Keys Values
    const propertyKeys = keys ? { id: keys._id, value: keys.value } : null

    // Set SubscriptionFee Values
    const propertySubscriptionFee = subscriptionFee
      ? { id: subscriptionFee._id, value: subscriptionFee.value }
      : null

    // Set FlatFeeServices Values
    if (
      parsedPropertyData.flatFeeService &&
      Array.isArray(parsedPropertyData.flatFeeService)
    ) {
      for (const flatFeeService of parsedPropertyData.flatFeeService) {
        await setFlatFeeServicesValues(flatFeeService)
      }
    }

    const propertyAddress = parsedPropertyData.address
      ? {
          address: parsedPropertyData.address,
          city: parsedPropertyData.city,
          postCode: parsedPropertyData.postCode,
        }
      : null

    // Generate a unique propertyRandomId
    const propertyRandomId = await getNextSequenceValue('branchId')

    // const currentDate = new Date().toLocaleDateString('en-GB'); // Format: DD-MM-YYYY
    // const propertyStartDate = parsedPropertyData.propertyStartDate || currentDate;
    // const propertyFinishDate = parsedPropertyData.propertyFinishDate || currentDate;

    const finalParsedPropertyData = {
      propertyCreatedByUserId: user._id,
      propertyCreatedByUserName: user.fullName,
      companyId: user.companyId,
      companyName: user.companyName,
      branchId: branch._id,
      branchName: branch.branchName,
      customerId: customer._id,
      customerName: customer.accountName,
      customerRandomId: customer.customerRandomId,
      branchRandomId: branch.branchRandomId,
      propertyRandomId: propertyRandomId,
      propertyId: parsedPropertyData.propertyId || null,
      propertyName: parsedPropertyData.propertyName || null,
      propertyReference: parsedPropertyData.propertyReference || null,
      propertyAddress: propertyAddress,
      propertyType: propertyType,
      propertyStatus: propertyStatus,
      propertyCategory: propertyCategory,
      propertyAI: propertyAI,
      aiNotes: parsedPropertyData.aiNotes || null,
      propertyStartDate: parsedPropertyData.propertyStartDate,
      propertyFinishDate: parsedPropertyData.propertyFinishDate,
      propertyPointOfContact:
        propertyPointOfContact.length > 0 ? propertyPointOfContact : null,
      propertyKeys: propertyKeys,
      propertyChargeable: propertyChargeable,
      propertyKeyValue: parsedPropertyData.propertyKeyValue || null,
      propertySubscriptionFee: propertySubscriptionFee,
      propertySubscriptionFeeValue:
        parsedPropertyData.propertySubscriptionFeeValue || null,
      propertyInternalNotes: parsedPropertyData.propertyInternalNotes || null,
      propertyExternalNotes: parsedPropertyData.propertyExternalNotes || null,
      propertyFlatFeeServiceData:
        propertyFlatFeeService.length > 0 ? propertyFlatFeeService : null,
      aiFiles: aiFileUrls,
      keyImages: keyImageUrls,
      propertyPhotos: propertyPhotosUrls,
    }

    // Creating a new Property Data
    const property = await propertyModel.create(finalParsedPropertyData)

    //! adding property in the audit record
    const propertyObjectId = property._id
    const propertyStringId = propertyObjectId.toString()
    const propertyCurrentDate = new Date()
    const propertyAuditReport = await auditReport(
      user._id,
      propertyCurrentDate,
      'Property Created',
      `${user.fullName} created a property name  ${property.propertyName}`,
      ipAddress,
      'Property',
      propertyStringId
    )

    console.log('propertyAuditReport = ', propertyAuditReport)

    res.json({ success: true, property: property })
  } catch (err) {
    res.status(500).json({
      error: true,
      message: 'Failed to add property',
      errorDetails: err.message,
    })
  }
}

export default addProperty
