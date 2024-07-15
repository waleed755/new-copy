import flatFeeServiceModel from '../../../models/property-select-models/flat-fee-service.model.js'

export const addFlatFeeService = async (req, res) => {
  const { data } = req.body

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    // Creating a new Flat Fee Service Data
    await flatFeeServiceModel.create(data)

    res.json({ success: true, message: 'Flat Fee Service Added!!' })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default addFlatFeeService
