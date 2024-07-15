import activityModel from '../../models/activity.model.js'
import branchModel from '../../models/branch.model.js'
import sendEmail from '../../services/send-email.service.js'

export const downloadActivityInvite = async (req, res) => {
  const { activityId } = req.body

  const activity = await activityModel.findById(activityId)

  const branch = await branchModel.findById(activity.branchId)

  const downloadActivityInviteURI = `https://rapto.uk/report/${activityId}`

  await sendEmail(
    branch.branchEmail,
    `View Your Activity Report!`,
    ` <p>Hello,</p>
      <p>To view your report, simply follow the link below:</p>
      <p><a href="${downloadActivityInviteURI}" style="color: #1a73e8; text-decoration: none;">Download Report</a></p>
      <p>If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:support@rapto.co.uk" style="color: #1a73e8; text-decoration: none;">support@rapto.co.uk</a>.</p>
      <p>Thank you for using Rapto!</p>
      <p>Best regards,</p>
      <p>The Rapto Team</p>`,
    'invitation to view activity report is sent successfully on the entered email!!'
  )

  res.status(200).json({
    success: true,
    message: 'invitation to view activity report is sent successfully !',
  })
}

export default downloadActivityInvite
