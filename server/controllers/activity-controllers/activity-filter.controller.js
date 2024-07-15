import activityModel from '../../models/activity.model.js'

export const getFilteredActivity = async (req, res) => {
  const { customerId, branchId, propertyId, type, dueDate, status } = req.body

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    let query = { companyId }

    // Check if customerId is provided
    if (customerId) {
      query.assignedToCustomerId = customerId
    }

    // Check if branchId is provided
    if (branchId) {
      query.branchId = branchId
    }

    // Check if propertyId is provided
    if (propertyId) {
      query.propertyId = propertyId
    }

    // Check if Status is provided
    if (status) {
      query.activityStatus = status
    }

    // Check if date is provided
    if (dueDate) {
      query.activityFinishDate = { $lte: new Date(dueDate) }
    }

    // Check if type is provided
    if (type) {
      query.activityType = type
    }

    const activities = await activityModel.find(query)

    if (!activities || activities.length === 0) {
      return res.status(404).json({ message: 'No activities found!' })
    }

    return res.json({
      success: true,
      activities,
    })
  } catch (error) {
    console.error('Error fetching report:', error)
    res.status(500).json({ error: true, message: error.message })
  }
}

export default getFilteredActivity
