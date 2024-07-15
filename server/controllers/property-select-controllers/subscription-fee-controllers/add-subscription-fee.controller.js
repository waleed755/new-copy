import subscriptionFeeModel from '../../../models/property-select-models/subscription-fee.model.js'

export const addSubscriptionFee = async (req, res) => {
  const { data } = req.body

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    // ? Creating a new Subscription Fee Data
    await subscriptionFeeModel.create(data)

    res.json({ success: true, message: 'Subscription is Added!!!' })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default addSubscriptionFee
