import subscriptionFeeModel from '../../../models/property-select-models/subscription-fee.model.js'

export const getAllSubscriptionFees = async (req, res) => {
  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    const subscriptionFees = await subscriptionFeeModel.find({})
    res.json({ success: true, subscriptionFees: subscriptionFees })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default getAllSubscriptionFees
