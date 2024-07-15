import activityModel from '../../models/activity.model.js'
import branchModel from '../../models/branch.model.js'
import customerModel from '../../models/customer.model.js'
import propertyModel from '../../models/property.model.js'
import userModel from '../../models/user.model.js'

export const updateActivity = async (req, res) => {
  const { activityId } = req.params // Extract activityId from URL parameter
  const { activityData } = req.body
  console.log('activityData  = ', activityData)

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    // get the assigned Customer
    const user = activityData.assignedToUserId
      ? await userModel.findById(activityData.assignedToUserId)
      : null

    // get the assigned Customer
    const customer = await customerModel.findById(activityData.customerId)

    // finding the Branch
    const branch = await branchModel.findById(activityData.branchId)

    // finding the Property
    const property = await propertyModel.findById(activityData.propertyId)

    const newActivity = {
      customerId: customer._id,
      customerName: customer.accountName,
      propertyId: property._id,
      propertyName: property.propertyName,
      branchId: branch._id,
      branchName: branch.branchName,
      activityStartDate: new Date(activityData.activityStartDate),
      activityFinishDate: new Date(activityData.activityFinishDate),
      activityStartTime: activityData.activityStartTime,
      activityFinishTime: activityData.activityFinishTime,
      activityType: activityData.activityType,
      activityStatus: activityData.activityStatus,
      activityVpis: activityData.activityVpis || null,
      activityReferenceNumber: activityData.activityReferenceNumber || null,
      activityInternalReference: activityData.activityInternalReference || null,
      patrolRequired: activityData.patrolRequired || null,
      patrolSchedule: activityData.patrolSchedule || null,
      activityAdditionalInstructions:
        activityData.activityAdditionalInstructions || null,
      activityInternalNotes: activityData.activityInternalNotes || null,
      activityStaffDetails: activityData.activityStaffDetails || null,
      activityIsArchived: activityData.activityIsArchived || null,
      comments: activityData.comments || null,
      assignedToUserId: user && user._id,
      assignedToUserName: user && user.fullName,
    }

    const updatedActivity = await activityModel.findByIdAndUpdate(
      activityId,
      newActivity,
      { new: true }
    )

    if (!updatedActivity) {
      return res
        .status(404)
        .json({ error: true, message: 'Activity is not Updated!' })
    }

    res.json({
      success: true,
      message: 'Activity has been Added!',
      activity: updatedActivity,
    })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default updateActivity
