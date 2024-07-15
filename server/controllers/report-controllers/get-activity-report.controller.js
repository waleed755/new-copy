import activityModel from '../../models/activity.model.js'
import propertyModel from '../../models/property.model.js'
import userModel from '../../models/user.model.js'

export const getActivityReport = async (req, res) => {
  const {
    startDate,
    endDate,
    branchId,
    customerId,
    propertyId,
    type,
    activityStatus,
  } = req.body

  let filteredActivities = []
  let reportActivities = []
  let fee = 0
  let totalTime

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  // Function to convert "HH-MM" to total seconds
  function timeToSeconds(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number)
    return Number(hours) * 3600 + Number(minutes) * 60
  }

  // Function to convert total seconds to "HH-MM"
  function secondsToTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600)
    totalSeconds %= 3600
    const minutes = Math.floor(totalSeconds / 60)
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0'
    )}`
  }

  // Function to add two times and convert the result into total minutes
  function getTimeInMinutes(time1, time2) {
    const totalSeconds1 = timeToSeconds(time1)
    const totalSeconds2 = timeToSeconds(time2)
    const totalCombinedSeconds = Number(totalSeconds2) - Number(totalSeconds1)

    // Convert total combined seconds into minutes
    const totalMinutes = Math.floor(totalCombinedSeconds / 60)

    return { totalMinutes }
  }

  // Function to add two times and compare with a third time
  function compareTimes(time1, time2, comparisonTime) {
    const totalSeconds1 = timeToSeconds(time1)
    const totalSeconds2 = timeToSeconds(time2)
    const totalCombinedSeconds = Number(totalSeconds1) - Number(totalSeconds2)
    const totalComparisonSeconds = Number(comparisonTime) * 60

    return { totalCombinedSeconds, totalComparisonSeconds }
  }

  try {
    // ! finding the login user
    const user = await userModel.findById(req.userId)
    const companyId = user.companyId

    // Parse startDate and endDate
    const startDateParsed = new Date(startDate)
    const endDateParsed = new Date(endDate)

    // console.log(
    //   '========================================================================================================'
    // )
    // console.log('startDate = ', startDate)
    // console.log('endDate = ', endDate)
    // console.log('startDateParsed = ', startDateParsed)
    // console.log('endDateParsed = ', endDateParsed)

    // console.log(
    //   '========================================================================================================'
    // )

    //! Find Required Activities
    let activityQuery = {}
    activityQuery.companyId = companyId
    activityQuery.activityStartDate = { $gte: startDateParsed }
    activityQuery.activityFinishDate = { $lte: endDateParsed }

    //  If BranchId exists
    if (branchId) {
      activityQuery.branchId = branchId
    }

    //  If customerId exists
    if (customerId) {
      activityQuery.customerId = customerId
    }

    //  If PropertyId exists
    if (propertyId) {
      activityQuery.propertyId = propertyId
    }

    //  If type exists
    if (type) {
      activityQuery.activityType = type
    }

    //  If activityStatus exists
    if (activityStatus) {
      activityQuery.activityStatus = activityStatus
    }

    filteredActivities = await activityModel.find(activityQuery)

    if (!filteredActivities || filteredActivities.length === 0) {
      return res.status(200).json({ activities: [] })
    }

    // console.log(
    //   '========================================================================================================'
    // )
    // console.log(' filteredActivities length = ', filteredActivities.length)
    // console.log(' filteredActivities = ', filteredActivities)
    // console.log(
    //   '========================================================================================================'
    // )

    // return res.status(200).json({
    //   activities: filteredActivities,
    //   activitiesLength: filteredActivities.length,
    // })

    //! Find Required Activities on the basis of Activities
    for (let i = 0; i < filteredActivities.length; i++) {
      // console.log(' filteredActivities = ', filteredActivities[i])

      if (
        filteredActivities[i].activityOnSiteTime !== null &&
        filteredActivities[i].activityOnSiteTime !== undefined
      ) {
        if (
          filteredActivities[i].activityOffSiteTime !== null &&
          filteredActivities[i].activityOffSiteTime !== undefined
        ) {
          let activityType = filteredActivities[i].activityType

          const property = await propertyModel.findById(
            filteredActivities[i].propertyId
          )

          // flatFeeServices = [...property.propertyFlatFeeServiceData]
          // console.log('flatFeeServices = ', property.propertyFlatFeeServiceData)

          let filteredFlatFeeServicesType =
            property.propertyFlatFeeServiceData?.find(service => {
              console.log(
                'Comparing serviceName:',
                service.serviceName.toLowerCase(),
                'with activityType:',
                activityType.toLowerCase()
              )
              return (
                service.serviceName.toLowerCase() === activityType.toLowerCase()
              )
            })

          console.log(
            'filteredFlatFeeServicesType = ',
            filteredFlatFeeServicesType
          )

          // !===========
          // console.log(
          //   'filteredFlatFeeServicesType.initialTimeMinutes = ',
          //   typeof filteredFlatFeeServicesType.initialTimeMinutes
          // )
          // !===========

          if (
            filteredFlatFeeServicesType !== null &&
            filteredFlatFeeServicesType !== undefined
          ) {
            let { totalCombinedSeconds, totalComparisonSeconds } = compareTimes(
              filteredActivities[i].activityOnSiteTime,
              filteredActivities[i].activityOffSiteTime,
              filteredFlatFeeServicesType.initialTimeMinutes
            )

            if (totalCombinedSeconds <= totalComparisonSeconds) {
              fee = filteredFlatFeeServicesType.initialTimeFees
              filteredActivities[i].activityTotalFee = Number(fee)
              let { totalMinutes } = getTimeInMinutes(
                filteredActivities[i].activityOnSiteTime,
                filteredActivities[i].activityOffSiteTime
              )
              totalTime = String(totalMinutes)
              // console.log(' fee 1 = ', fee)
              // console.log('totalTime 1 = ', totalTime)
              filteredActivities[i].activityTotalTime = totalTime
            } else if (totalCombinedSeconds >= totalComparisonSeconds) {
              const additionalTime = parseInt(
                (totalCombinedSeconds - totalComparisonSeconds) / 900,
                10
              )
              const additionalFees =
                additionalTime *
                Number(filteredFlatFeeServicesType.additionalTimeFees)
              fee = Number(additionalFees)
              filteredActivities[i].activityTotalFee = fee
              let { totalMinutes } = getTimeInMinutes(
                filteredActivities[i].activityOnSiteTime,
                filteredActivities[i].activityOffSiteTime
              )
              totalTime = String(totalMinutes)
              filteredActivities[i].activityTotalTime = totalTime
            }

            // filteredActivities[i].activityTotalTime = totalTime
            // filteredActivities[i].activityTotalFee = fee
            // reportActivities.push(filteredActivities[i])
          }
          reportActivities.push(filteredActivities[i])
        }
      }
    }

    return res.json({
      success: true,
      activities: reportActivities,
    })
  } catch (error) {
    console.error('Error fetching report:', error)
    res.status(500).json({ error: true, message: error.message })
  }
}

export default getActivityReport
