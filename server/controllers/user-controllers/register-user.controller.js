import companyModel from '../../models/company.model.js'
import userModel from '../../models/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const registerUser = async (req, res) => {
  const { userData } = req.body
  const { companyId } = req.params

  try {
    const findEmail = userData.email.trim().toLowerCase()

    const existingUser = await userModel.findOne({ email: findEmail })
    if (existingUser) {
      return res
        .status(400)
        .json({ error: true, message: 'User with this email already exists' })
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10)

    const company = await companyModel.findById(companyId)

    if (company) {
      return res
        .status(400)
        .json({ error: true, message: 'Company  Not Found!!' })
    }

    userData.email = findEmail
    userData.password = hashedPassword
    userData.companyId = company._id
    userData.companyName = company.companyName

    const user = await userModel.create(userData)

    // Add user to company's users list
    company.users.push(user._id)
    await company.save()

    const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    })

    res.json({
      success: true,
      message: 'User Registered Successfully!!!',
      token: token,
    })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default registerUser
