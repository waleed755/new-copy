import userModel from '../../models/user.model.js'
import auditReport from '../../services/audit-report.service.js'
import sendEmail from '../../services/send-email.service.js'

export const inviteUser = async (req, res) => {
  const { users } = req.body
  const ipAddress = req.ipAddress
  console.log('Users = ', users)

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  //! Finding the login User
  const loginUser = await userModel.findById(req.userId)
  let allEmailsSent = true

  for (let i = 0; i < users.length; i++) {
    const email = users[i].email.trim().toLowerCase()
    const user = await userModel.findOne({ email })
    if (user) {
      return res.status(401).json({
        error: true,
        message: 'Email already exists. Repetition of Email is not allowed!',
        email: user.email,
      })
    }
  }

  for (let i = 0; i < users.length; i++) {
    users[i].companyId = loginUser.companyId
    users[i].companyName = loginUser.companyName
    const newUser = await userModel.create(users[i])

    const inviteUserURI = `https://rapto.uk/register-user/${newUser._id}`
    // const inviteUserURI = `http://localhost:5173/register-user/${newUser._id}`

    await sendEmail(
      newUser.email,
      `You're Invited to Join Rapto!`,
      `<p>Dear ${newUser.fullName}</p>
        <p>${loginUser.fullName} has invited you to join Rapto! With Rapto, you can efficiently manage and secure your digital workspace with ease. To accept this invitation and register your account, simply follow the link below: </p>
        <p><a href=${inviteUserURI}>${inviteUserURI}</a></p>
        <p>If you have any questions or need assistance, feel free to reach out to our support team at support@rapto.co.uk. </p>
        <p>Welcome to Rapto,</p>
        <p>The Rapto Team</p>
        `,
      'invitation is sent successfully on the entered email!!'
    )

    //! adding user-invite in the audit record
    const userObjectId = newUser._id
    const userStringId = userObjectId.toString()
    const userCurrentDate = new Date()
    const userInviteAuditReport = await auditReport(
      loginUser._id,
      userCurrentDate,
      'User Invited',
      `${loginUser.fullName} has Invited a user name ${newUser.fullName}`,
      ipAddress,
      'User',
      userStringId
    )
    console.log('userInviteAuditReport = ', userInviteAuditReport)
  }

  if (allEmailsSent) {
    return res
      .status(200)
      .json({ success: true, message: 'All invitations sent successfully!' })
  } else {
    return res
      .status(500)
      .json({ message: 'Some invitations could not be sent.' })
  }
}

export default inviteUser
