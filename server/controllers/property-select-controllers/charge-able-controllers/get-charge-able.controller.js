import chargeAbleModel from '../../../models/property-select-models/charge-able.model.js'

export const getAllChargeAbles = async (req, res) => {
  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    const chargeAble = await chargeAbleModel.find({})
    res.json({ success: true, chargeAble: chargeAble })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default getAllChargeAbles
