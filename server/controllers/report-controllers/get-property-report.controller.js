import propertyModel from '../../models/property.model.js'
import userModel from '../../models/user.model.js'

// Function to calculate days in a specific month and year
// Function to calculate days in a specific month and year
function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

// Function to calculate months and days between two dates
function monthsAndDaysInRange(startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  let fullMonth = 0
  let fullDays = 0
  let currentDate = new Date(start)
  while (currentDate <= end) {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const days = daysInMonth(year, month)
    const daysToAdd = Math.min(
      days - currentDate.getDate() + 1,
      (end - currentDate) / (1000 * 60 * 60 * 24) + 1
    )

    if (daysToAdd !== days && fullDays < 31) {
      console.log('full', fullDays)
      fullDays = fullDays + daysToAdd
    } else {
      fullMonth++
    }
    currentDate.setMonth(month + 1)
    currentDate.setDate(1)
  }

  return { fullMonth, fullDays }
}

export const getPropertyReport = async (req, res) => {
  const {
    startDate,
    endDate,
    branchId,
    customerId,
    typeId,
    statusId,
    aiID,
    categoryId,
    propertyChargeable,
  } = req.body

  let finalProperties = []

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    const user = await userModel.findById(req.userId)
    const companyId = user.companyId

    // if (new Date(startDate) >= new Date(endDate)) {
    //   return res
    //     .status(400)
    //     .json({ message: 'Start date must be before end date' })
    // }

    let query = { companyId }

    // Check if customerId is provided
    if (customerId) {
      query.customerId = customerId
    }

    // Check if customerId is provided
    if (branchId) {
      query.branchId = branchId
    }

    // Add filters for typeId, statusId, aiID, categoryId if provided
    if (typeId) {
      query['propertyType.id'] = typeId
    }
    if (statusId) {
      query['propertyStatus.id'] = statusId
    }
    if (aiID) {
      query['propertyAI.id'] = aiID
    }

    if (categoryId) {
      query['propertyCategory.id'] = categoryId
    }
    if (propertyChargeable) {
      query['propertyChargeAble.id'] = propertyChargeable
    }

    const properties = await propertyModel.find(query)

    if (!properties || properties.length === 0) {
      return res.status(200).json({ properties: [] })
    }

    properties.forEach(property => {
      let start = new Date(startDate)
      let end = new Date(endDate)

      if (new Date(property.propertyStartDate) > start) {
        start = new Date(property.propertyStartDate)
      }
      if (
        property.propertyFinishDate &&
        new Date(property.propertyFinishDate) < end
      ) {
        end = new Date(property.propertyFinishDate)
      }

      const daysRange = monthsAndDaysInRange(start, end)
      console.log(daysRange)
      let singleDayValue = 0 // Default to 1 if subscription type is not recognized
      let monthValue = 0
      switch (property.propertySubscriptionFee.value) {
        case 'Monthly':
          if (daysRange.fullMonth) {
            monthValue =
              Number(property.propertySubscriptionFeeValue) *
              daysRange.fullMonth
          }
          if (daysRange.fullDays) {
            singleDayValue =
              (Number(property.propertySubscriptionFeeValue) * 12) / 365
            singleDayValue = singleDayValue * daysRange.fullDays
          }
          property.propertyTotalPrice = singleDayValue + monthValue

          break
        case 'Daily':
          singleDayValue =
            (Number(property.propertySubscriptionFeeValue) * 52) / 365
          singleDayValue = singleDayValue * daysRange.days
          property.propertyTotalPrice = singleDayValue + monthValue

          break
        case 'Weekly':
          singleDayValue =
            (Number(property.propertySubscriptionFeeValue) * 12) / 365
          singleDayValue = singleDayValue * daysRange.days
          property.propertyTotalPrice = singleDayValue + monthValue

          break
        case 'Yearly':
          singleDayValue = Number(property.propertySubscriptionFeeValue) / 365
          singleDayValue = singleDayValue * daysRange.days
          property.propertyTotalPrice = singleDayValue + monthValue

          break
      }
      if (property.propertyTotalPrice) {
        finalProperties.push(property)
      }
    })

    return res.json({
      success: true,
      date: monthsAndDaysInRange(startDate, endDate),
      properties: finalProperties,
    })
  } catch (error) {
    console.error('Error fetching report:', error)
    res.status(500).json({ error: true, message: error.message })
  }
}

export default getPropertyReport
