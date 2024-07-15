import companyModel from '../../models/company.model.js'
import userModel from '../../models/user.model.js'
import auditReport from '../../services/audit-report.service.js'
import sendEmail from '../../services/send-email.service.js'

export const addCompany = async (req, res) => {
  const { companyData } = req.body
  const ipAddress = req.ipAddress

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  if (!companyData) {
    return res
      .status(400)
      .json({ error: true, message: 'Company data is required' })
  }

  try {
    // For Company Logo
    // const companyLogo = req.files['companyLogo'][0]

    // const companyParams = {
    //   Bucket: 'keyholding',
    //   Key: `${Date.now()}_${companyLogo.originalname}`,
    //   Body: companyLogo.buffer,
    //   ACL: 'public-read',
    // }

    // const companyUploadResponse = await s3.upload(companyParams).promise()
    // adminUser.companyLogo = companyUploadResponse.Location

    //! finding the login user
    const adminUser = await userModel.findById(req.userId)

    const company = await companyModel.create(companyData)
    company.users.push(adminUser._id)
    await company.save()

    if (company) {
      await sendEmail(
        adminUser.email,
        'Confirmation on Registering Company with Rapto!',
        `<p>Dear ${adminUser.fullName}</p>
        <p>Thank you for registering a company with Rapto!</p>
        <p>If you have any questions or need assistance, feel free to reach out to our support team at support@rapto.co.uk. </p>
        <p>The Rapto Team</p>
        `,
        'Confirmation Email Sent Successfully!!!'
      )
    }

    // Making that user Admin of the company & also setting the companyId and companyName
    adminUser.isAdmin = true
    adminUser.companyName = company.companyName
    adminUser.companyId = company._id

    await adminUser.save()

    // const token = jwt.sign(
    //   { userId: updatedUser._id },
    //   process.env.SECRET_KEY,
    //   {
    //     expiresIn: '1h',
    //   }
    // )

    //! adding create-company in the audit record
    const companyObjectId = company._id
    const companyStringId = companyObjectId.toString()
    const companyCurrentDate = new Date()
    const companyAuditReport = await auditReport(
      adminUser._id,
      companyCurrentDate,
      'Company Created',
      `${adminUser.fullName} created a company-(${adminUser.companyName})`,
      ipAddress,
      'Company',
      companyStringId
    )
    console.log('companyAuditReport = ', companyAuditReport)

    res.json({
      success: true,
      message: 'Company Created!!',
      company: company,
      // token: token,
    })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default addCompany
