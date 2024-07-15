import moment from 'moment'

export const dateTransform = (doc, ret, options) => {
  for (const key in ret) {
    if (ret[key] instanceof Date) {
      ret[key] = moment(ret[key]).format('YYYY-MM-DD')
    }
  }
  return ret
}
