import flatFeeServiceModel from '../../../models/property-select-models/flat-fee-service.model.js'

export const getAllFlatFeeService = async (req, res) => {
  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    const flatFeeServices = await flatFeeServiceModel.find({})
    res.json({ success: true, flatFeeServices: flatFeeServices })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default getAllFlatFeeService
