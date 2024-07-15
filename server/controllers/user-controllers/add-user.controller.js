import companyModel from '../../models/company.model.js'
import userModel from '../../models/user.model.js'
import bcrypt from 'bcrypt'
import auditReport from '../../services/audit-report.service.js'

export const addUser = async (req, res) => {
  const { userData } = req.body
  const ipAddress = req.ipAddress

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    const loginUser = await userModel.findById(req.userId)

    const company = await companyModel.findById(loginUser.companyId)

    const findEmail = userData.email.trim().toLowerCase()

    const existingUser = await userModel.findOne({
      email: findEmail,
    })
    if (existingUser) {
      return res
        .status(400)
        .json({ error: true, message: 'User with this email already exists' })
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10)

    userData.email = findEmail
    userData.password = hashedPassword
    userData.companyId = company._id
    userData.companyName = loginUser.companyName

    const user = await userModel.create(userData)

    // Add user to company's users list
    company.users.push(user._id)
    await company.save()

    //! adding add-user in the audit record
    const userObjectId = user._id
    const userStringId = userObjectId.toString()
    const userCurrentDate = new Date()
    const addUserAuditReport = await auditReport(
      loginUser._id,
      userCurrentDate,
      'User is Added',
      `${loginUser.fullName} has added a new user name ${user.fullName}`,
      ipAddress,
      'User',
      userStringId
    )
    console.log('addUserAuditReport = ', addUserAuditReport)

    res.json({ success: true, message: 'User Added!!', user: user })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default addUser
