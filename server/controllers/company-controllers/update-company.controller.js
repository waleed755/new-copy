import companyModel from '../../models/company.model.js'

export const updateCompany = async (req, res) => {
  const { companyId } = req.params // Extract companyId from URL parameter
  const { companyData } = req.body
  // const parsedCompanyData = JSON.parse(companyData)
  // console.log(' parsedCompanyData = ', parsedCompanyData)
  console.log(' companyData = ', companyData)

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    // For Company Logo
    // const companyLogo = req.files['companyLogo'][0]

    // const companyParams = {
    //   Bucket: process.env.AWS_S3_BUCKET_NAME,
    //   Key: `${Date.now()}_${path.basename(companyLogo.originalname)}`,
    //   Body: companyLogo.buffer,
    // }

    // const companyUploadResponse = await s3.upload(companyParams).promise()

    // parsedCompanyData.companyLogo = companyUploadResponse.Location

    const updatedCompany = await companyModel.findByIdAndUpdate(
      companyId,
      companyData,
      { new: true }
    )

    res.json({
      success: true,
      message: 'Company Created!!',
      company: updatedCompany,
    })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default updateCompany
