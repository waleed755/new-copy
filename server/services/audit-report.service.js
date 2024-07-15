import auditReportModel from '../models/audit-report.model.js'

export const auditReport = async (
  userId,
  createdDate,
  action,
  description,
  ipAddress,
  actionType,
  value
) => {
  const data = {
    userId: userId,
    createdDate: createdDate,
    action: action,
    description: description,
    ipAddress: ipAddress,
    actionType: actionType,
    value: value,
  }
  const auditReport = await auditReportModel.create(data)

  return auditReport
}

export default auditReport
