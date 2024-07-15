import companyModel from '../../models/company.model.js'

export const getCompany = async (req, res) => {
  const { companyId } = req.params // Extract companyId from URL parameter

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    const company = await companyModel.findById(companyId)

    if (!company) {
      return res.status(404).json({ error: true, message: 'Company not found' })
    }

    res.json({ success: true, company: company })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message })
  }
}

export default getCompany
