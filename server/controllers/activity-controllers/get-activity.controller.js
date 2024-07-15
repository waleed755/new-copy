import activityModel from '../../models/activity.model.js'
import userModel from '../../models/user.model.js'

export const getAllActivities = async (req, res) => {
  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  let myActivities = []

  try {
    // ! finding the login User
    const user = await userModel.findById(req.userId)

    // Extract the companyId from the user document
    const companyId = user.companyId

    const allActivities = await activityModel.find({ companyId })

    // if (allActivities.length !== 0) {
    //   for (let i = 0; i < allActivities.length; i++) {
    //     let activity = await activityModel.findById(allActivities[i]._id)

    //     console.log('activity.activityStartDate = ', activity.activityStartDate)
    //     console.log(
    //       'activity.activityFinishDate = ',
    //       activity.activityFinishDate
    //     )
    //     console.log('new Date() = ', new Date())

    //     if (activity.activityStatus === 'Pending') {
    //       if (activity.activityStartDate > new Date()) {
    //         activity.activityStatus = 'Pending'
    //         console.log('Pending')
    //       }

    //       if (
    //         activity.activityStartDate <= new Date() &&
    //         activity.activityFinishDate >= new Date()
    //       ) {
    //         activity.activityStatus = 'Due'
    //         console.log('Due')
    //       }

    //       if (activity.activityFinishDate < new Date()) {
    //         activity.activityStatus = 'Over Due'
    //         console.log('Over Due')
    //       }
    //     }

    //     myActivities.push(activity)
    //   }
    // }

    if (allActivities.length !== 0) {
      const currentDate = new Date()

      currentDate.setHours(0, 0, 0, 0)

      for (let i = 0; i < allActivities.length; i++) {
        let activity = await activityModel.findById(allActivities[i]._id)

        if (activity.activityStatus === 'Pending') {
          const activityStartDate = new Date(activity.activityStartDate)
          const activityFinishDate = new Date(activity.activityFinishDate)

          // Zero out the time portion of activityStartDate and activityFinishDate for comparison purposes
          activityStartDate.setHours(0, 0, 0, 0)
          activityFinishDate.setHours(0, 0, 0, 0)

          if (activityStartDate > currentDate) {
            activity.activityStatus = 'Pending'
            activity.save()
          } else if (
            activityStartDate <= currentDate &&
            activityFinishDate >= currentDate
          ) {
            activity.activityStatus = 'Due'
            activity.save()
          } else if (activityFinishDate < currentDate) {
            activity.activityStatus = 'Over Due'
            activity.save()
          }
        }

        myActivities.push(activity)
      }
    }

    res.json({ success: true, allActivities: myActivities })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default getAllActivities
