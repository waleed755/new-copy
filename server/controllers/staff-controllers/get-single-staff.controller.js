import staffModel from '../../models/staff.model.js'

export const getSingleStaff = async (req, res) => {
  const { staffId } = req.params // Extract staffId from URL parameter

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    // Check if the staff exists
    const staff = await staffModel.findById(staffId)

    if (!staff) {
      return res.status(404).json({ error: true, message: 'Staff not found' })
    }

    res.json({ success: true, staff: staff })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message })
  }
}

export default getSingleStaff
