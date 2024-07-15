import activityModel from '../../models/activity.model.js'
import branchModel from '../../models/branch.model.js'
import companyModel from '../../models/company.model.js'
import customerModel from '../../models/customer.model.js'
import propertyModel from '../../models/property.model.js'
import userModel from '../../models/user.model.js'
import auditReport from '../../services/audit-report.service.js'

// function daysInRange(startDate, endDate) {
//   const start = new Date(startDate)
//   const end = new Date(endDate)

//   // Calculate the difference in time
//   const timeDifference = end.getTime() - start.getTime()

//   // Convert time difference to days
//   const totalDays = timeDifference / (1000 * 3600 * 24) + 1

//   return Math.floor(totalDays)
// }

// ! Way - 1
// function generateActivityReference(
//   activityType,
//   startDate,
//   endDate,
//   startTime,
//   endTime
// ) {
//   // Extract the first letter of each word in activityType
//   let abbreviation = activityType
//     .split(' ')
//     .map(word => word[0])
//     .join('')
//     .toUpperCase()

//   // Combine the start date and start time into a single Date object
//   let dateTimeStr = formatDateAndTime(startDate, startTime)

//   // Combine abbreviation and dateTimeStr
//   let activityReference = `${abbreviation}-${dateTimeStr}`

//   return activityReference
// }

// function formatDateAndTime(date, time) {
//   let dateParts = date.split('-') // Expecting format YYYY-MM-DD
//   let timeParts = time.split(':') // Expecting format HH:MM

//   let day = dateParts[2]
//   let month = dateParts[1]
//   let year = dateParts[0].slice(-2) // Get last two digits of year
//   let hours = timeParts[0]
//   let minutes = timeParts[1]
//   let seconds = '00' // Default seconds to 00 since not provided

//   // Format the date and time as ddmmyyhhiiss
//   return `${day}${month}${year}${hours}${minutes}${seconds}`
// }

// ! Way - 2
function generateActivityReference(activityType, iteration = 0) {
  // Extract the first letter of each word in activityType
  let abbreviation = activityType
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
  let startDate = new Date()
  let startTime = new Date()

  // Parse date and time
  let startDateTime = new Date(startDate)
  let startTimeDateTime = new Date(startTime)

  // Format the date and time
  let dateTimeStr = formatDateAndTime(startDateTime, startTimeDateTime)

  // Combine abbreviation and dateTimeStr
  let activityReference =
    iteration > 0
      ? `${abbreviation}-${dateTimeStr}${iteration}`
      : `${abbreviation}-${dateTimeStr}`

  return activityReference
}

function formatDateAndTime(dateObj, timeObj) {
  let day = String(dateObj.getUTCDate()).padStart(2, '0')
  let month = String(dateObj.getUTCMonth() + 1).padStart(2, '0') // Months are 0-based
  let year = String(dateObj.getUTCFullYear()).slice(-2) // Get last two digits of year
  let hours = String(timeObj.getUTCHours()).padStart(2, '0')
  let minutes = String(timeObj.getUTCMinutes()).padStart(2, '0')
  let seconds = String(timeObj.getUTCSeconds()).padStart(2, '0')

  // Format the date and time as ddmmyyhhiiss
  return `${day}${month}${year}${hours}${minutes}${seconds}`
}

export const addActivity = async (req, res) => {
  const { activityData } = req.body
  const ipAddress = req.ipAddress

  // const days = daysInRange(
  //   activityData.activityStartDate,
  //   activityData.activityFinishDate
  // )
  // let activities = []

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    //! Finding the login User
    const loginUser = await userModel.findById(req.userId)

    // get the assigned Customer
    const customer = await customerModel.findById(activityData.customerId)

    // finding the Branch
    const branch = await branchModel.findById(activityData.branchId)

    // finding the Property
    const property = await propertyModel.findById(activityData.propertyId)

    let currentDate = new Date(activityData.activityStartDate)
    let activities = []

    activityData.customerId = customer._id
    activityData.customerName = customer.accountName
    activityData.propertyId = property._id
    activityData.propertyName = property.propertyName
    activityData.branchId = branch._id
    activityData.branchName = branch.branchName
    activityData.companyId = loginUser.companyId
    activityData.companyName = loginUser.companyName
      ? loginUser.companyName
      : null
    activityData.activityStartDate = new Date(activityData.activityStartDate)
    activityData.activityFinishDate = new Date(activityData.activityFinishDate)
    activityData.activityStatus = 'Pending'
    activityData.activityCreatedByUserId = loginUser._id
    activityData.activityCreatedByUserName = loginUser.fullName

    // ! In cae=se of Vacant Property Check
    if (activityData.activityVpis && activityData.activityVpis > 0) {
      for (let i = 0; i < activityData.activityVpis; i++) {
        activityData.activityReferenceNumber = generateActivityReference(
          activityData.activityType,
          i + 1
        )

        const activity = await activityModel.create(activityData)

        activities.push(activity)

        // Increment the date by one day
        // currentDate.setDate(currentDate.getDate() + 1)

        //! adding create-activity in the audit record
        const activityObjectId = activity._id
        const activityStringId = activityObjectId.toString()
        const activityCurrentDate = new Date()
        const activityAuditReport = await auditReport(
          loginUser._id,
          activityCurrentDate,
          'Activities Created',
          `${loginUser.fullName} created a ${activityData.activityVpis} activities of type  ${activityData.activityType}`,
          ipAddress,
          'Activity',
          activityStringId
        )
        console.log('activityAuditReport = ', activityAuditReport)
      }

      res.json({
        success: true,
        message: 'Activity has been Added!',
        activity: activities,
      })
    } else if (activityData.patrolRequired && activityData.patrolRequired > 0) {
      // ! In case of Patrol
      for (let i = 0; i < activityData.patrolRequired; i++) {
        activityData.activityReferenceNumber = generateActivityReference(
          activityData.activityType,
          i + 1
        )

        const activity = await activityModel.create(activityData)
        activities.push(activity)

        //! adding create-activity in the audit record
        const activityObjectId = activity._id
        const activityStringId = activityObjectId.toString()
        const activityCurrentDate = new Date()
        const activityAuditReport = await auditReport(
          loginUser._id,
          activityCurrentDate,
          'Activities Created',
          `${loginUser.fullName} created a ${activityData.patrolRequired} activities of type  ${activityData.activityType}`,
          ipAddress,
          'Activity',
          activityStringId
        )
        console.log('activityAuditReport = ', activityAuditReport)
      }

      res.json({
        success: true,
        message: 'Activity has been Added!',
        activity: activities,
      })
    } else {
      activityData.activityReferenceNumber = generateActivityReference(
        activityData.activityType
      )

      const activity = await activityModel.create(activityData)

      //! adding create-activity in the audit record
      const activityObjectId = activity._id
      const activityStringId = activityObjectId.toString()
      const activityCurrentDate = new Date()
      const activityAuditReport = await auditReport(
        loginUser._id,
        activityCurrentDate,
        'Activity Created',
        `${loginUser.fullName} created an activity of type  ${activityData.activityType}`,
        ipAddress,
        'Activity',
        activityStringId
      )
      console.log('activityAuditReport = ', activityAuditReport)

      res.json({
        success: true,
        message: 'Activity has been Added!',
        activity: activity,
      })
    }
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default addActivity
