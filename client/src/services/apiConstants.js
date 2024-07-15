import axios from 'axios'
import { BASE_URL } from '../config.js'
import {
  ADD_AI,
  ADD_BRANCH,
  ADD_CATEGORY,
  ADD_CUSTOMER,
  ADD_KEYS,
  ADD_POINT_OF_CONTACT,
  ADD_PROPERTY,
  ADD_TYPE,
  ADD_USER,
  FIND_USER,
  GET_AI,
  GET_BRANCHES,
  GET_BRANCHES_NAMES,
  GET_CATEGORY,
  GET_CUSTOMERS,
  GET_CUSTOMER_NAMES,
  GET_FLAT_FEE_SERVICE,
  GET_KEYS,
  GET_POINT_OF_CONTACT,
  GET_PROPERTIES,
  GET_PROPERTIES_NAMES,
  GET_STATUS,
  GET_SUBSCRIPTION_FEE,
  GET_TIME_BASED_SERVICE,
  GET_TYPE,
  INVITE_USER,
  LOGIN,
  VERIFY_OTP,
  REGISTER,
  REGISTER_COMPANY,
  RESEND_OTP,
  RESET_PASSWORD,
  GET_CHARGE_ABLE,
  CUSTOMER_STATUS_TOGGLER,
  BRANCH_STATUS_TOGGLER,
  PROPERTY_STATUS_TOGGLER,
  VERIFY_EMAIL,
  ADD_STAFF,
  GET_ALL_STAFF,
  GET_STAFF_NAMES,
  STAFF_STATUS_TOGGLER,
  ADD_ACTIVITY,
  GET_ALL_ACTIVITIES,
  GET_ACTIVITIES_BY_TYPE,
  GET_ALL_USERS,
  USER_STATUS_TOGGLER,
  GET_FILTERED_ACTIVITIES,
  UPDATE_ACTIVITY_STATUS,
  GET_PROPERTY_REPORT,
  GET_ACTIVITY_REPORT,
  ASSIGN_ACTIVITY,
  GET_ALL_OFFICERS_RESPONSE,
  GET_SINGLE_OFFICER_RESPONSE,
  GET_USER_ASSIGNED__ACTIVITIES,
  GET_CUSTOMER_NAMES_WITH_ACTIVE_STATUS,
  GET_BRANCHES_NAMES_WITH_ACTIVE_STATUS,
  GET_PROPERTIES_NAMES_WITH_ACTIVE_STATUS,
  GET_TODAY_ACTIVITIES,
  DOWNLOAD_ACTIVITY_INVITE,
  GET_SINGLE_OFFICER_RESPONSE_PUBLIC,
  ADD_ACTIVITY_COMMENT,
  CANCEL_ACTIVITY,
} from './api.js'

//! =============== Auth
const token = typeof window !== 'undefined' && localStorage.getItem('token')

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

axiosInstance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response && error.response.status === 401) {
      // Handle 401 error: Redirect to login page and remove token
      localStorage.removeItem('token')
      window.location.replace('/login') // Redirect to your login page
    }
    return Promise.reject(error)
  }
)

// Function to make a request with dynamic content type
export const makeRequest = (method, url, data) => {
  return axiosInstance({
    method: method,
    url: url,
    headers: {
      'Content-Type': !url.includes('/add-property')
        ? 'application/json'
        : 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
    body: data,
  })
}

export default axiosInstance

// Then, you can use this axiosInstance throughout your application to make authorized requests:

export const authorizedAxiosPost = async (url, data) => {
  try {
    const response = await axiosInstance.post(url, data)
    return response
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const registerApi = async data => {
  console.log('data', data)
  return axios.post(REGISTER, data)
}

export const loginApi = async data => {
  return axios.post(LOGIN, data)
}

export const VerifyOTPApi = async data => {
  return axios.post(VERIFY_OTP, data)
}

export const ResendOTPApi = async data => {
  return axios.post(RESEND_OTP, data)
}

export const verifyEmail = async data => {
  return axios.post(VERIFY_EMAIL, data)
}

export const ResetPasswordApi = async data => {
  return axios.post(RESET_PASSWORD, data)
}

// ! Company

export const registerCompanyApi = async data => {
  return authorizedAxiosPost(REGISTER_COMPANY, data)
}

export const updateCompanyApi = async (data, id) => {
  const url = `${BASE_URL}/update-company/${id}`
  return authorizedAxiosPost(url, data)
}

export const getCompanyApi = async id => {
  const url = `${BASE_URL}/get-company/${id}`
  return authorizedAxiosPost(url, {})
}

//! =========== report
export const getPropertyReportApi = async data => {
  return authorizedAxiosPost(GET_PROPERTY_REPORT, data)
}

export const getActivityReportApi = async data => {
  return authorizedAxiosPost(GET_ACTIVITY_REPORT, data)
}

//! =========== User
export const addUserApi = async data => {
  return authorizedAxiosPost(ADD_USER, data)
}

export const getAllUsersApi = async data => {
  return authorizedAxiosPost(GET_ALL_USERS, data)
}

export const getSingleUserApi = async userId => {
  const url = `${BASE_URL}/get-user/${userId}`
  return authorizedAxiosPost(url, {})
}

export const updateUserApi = async (id, data) => {
  console.log('data', data)
  const url = `${BASE_URL}/update-user/${id}`
  return authorizedAxiosPost(url, data)
}

export const userStatusTogglerApi = async data => {
  return authorizedAxiosPost(USER_STATUS_TOGGLER, data)
}

export const inviteUserApi = async data => {
  return authorizedAxiosPost(INVITE_USER, data)
}

export const fillUserPasswordApi = async (id, data) => {
  const url = `${BASE_URL}/fill-user-password/${id}`
  return authorizedAxiosPost(url, data)
}

export const findUserApi = async data => {
  return authorizedAxiosPost(FIND_USER, data)
}

export const updateUserMfaApi = async () => {
  const url = `${BASE_URL}/set-user-mfa`
  return authorizedAxiosPost(url, {})
}

//! ============== Customer
export const addCustomerApi = async data => {
  return authorizedAxiosPost(ADD_CUSTOMER, data)
}

export const getCustomerApi = async () => {
  return authorizedAxiosPost(GET_CUSTOMERS, {})
}

export const editCustomerApi = async data => {
  console.log('ddddddd', data?.customerData?.customerId)
  const url = `${BASE_URL}/customer/${data?.customerData?.customerId}`
  return authorizedAxiosPost(url, data)
}

export const getCustomerNamesApi = async () => {
  return authorizedAxiosPost(GET_CUSTOMER_NAMES, {})
}

export const getCustomerNamesWithActiveStatusApi = async () => {
  return authorizedAxiosPost(GET_CUSTOMER_NAMES_WITH_ACTIVE_STATUS, {})
}

export const customerStatusTogglerApi = async data => {
  return authorizedAxiosPost(CUSTOMER_STATUS_TOGGLER, data)
}

//! ================== Branch
export const addBranchApi = async data => {
  return authorizedAxiosPost(ADD_BRANCH, data)
}

export const getBranchApi = async () => {
  return authorizedAxiosPost(GET_BRANCHES, {})
}
export const editBranchApi = async data => {
  console.log('ddddddd', data?.branchData?._id)
  const url = `${BASE_URL}/branch/${data?.branchData?._id}`
  return authorizedAxiosPost(url, data)
}

export const getBranchesNamesApi = async () => {
  return authorizedAxiosPost(GET_BRANCHES_NAMES, {})
}

export const getBranchesNamesWithActiveStatusApi = async () => {
  return authorizedAxiosPost(GET_BRANCHES_NAMES_WITH_ACTIVE_STATUS, {})
}

export const branchStatusTogglerApi = async data => {
  return authorizedAxiosPost(BRANCH_STATUS_TOGGLER, data)
}

//! ================ Property
export const addPropertyApi = async data => {
  return authorizedAxiosPost(ADD_PROPERTY, data)
}

export const getPropertyApi = async () => {
  return authorizedAxiosPost(GET_PROPERTIES, {})
}

export const getSinglePropertyApi = async propertyId => {
  const url = `${BASE_URL}/get-property/${propertyId}`
  return authorizedAxiosPost(url, {})
}
export const editPropertyApi = async (data, id) => {
  const url = `${BASE_URL}/property/${id}`
  return authorizedAxiosPost(url, data)
}

export const getPropertiesNamesApi = async () => {
  return authorizedAxiosPost(GET_PROPERTIES_NAMES, {})
}

export const getPropertiesNamesWithActiveStatusApi = async () => {
  return authorizedAxiosPost(GET_PROPERTIES_NAMES_WITH_ACTIVE_STATUS, {})
}

export const propertyStatusTogglerApi = async data => {
  return authorizedAxiosPost(PROPERTY_STATUS_TOGGLER, data)
}

//! ================ Staff
export const addStaffApi = async data => {
  return authorizedAxiosPost(ADD_STAFF, data)
}

export const getStaffApi = async () => {
  return authorizedAxiosPost(GET_ALL_STAFF, {})
}

export const getSingleStaffApi = async staffId => {
  const url = `${BASE_URL}/get-staff/${staffId}`
  return authorizedAxiosPost(url, {})
}
export const editStaffApi = async data => {
  const url = `${BASE_URL}/staff/${data?.staffData?._id}`
  return authorizedAxiosPost(url, data)
}

export const getStaffNamesApi = async () => {
  return authorizedAxiosPost(GET_STAFF_NAMES, {})
}

export const staffStatusTogglerApi = async data => {
  return authorizedAxiosPost(STAFF_STATUS_TOGGLER, data)
}

//! ================ Activity
export const addActivityApi = async data => {
  return authorizedAxiosPost(ADD_ACTIVITY, data)
}

export const getActivityApi = async () => {
  return authorizedAxiosPost(GET_ALL_ACTIVITIES, {})
}

export const getSingleActivityApi = async data => {
  const url = `${BASE_URL}/get-activity/${data}`
  return authorizedAxiosPost(url, {})
}
export const editActivityApi = async (data, id) => {
  console.log('data', data)
  const url = `${BASE_URL}/activity/${data?.id}`
  return authorizedAxiosPost(url, data)
}

export const getActivityByTypeApi = async () => {
  return authorizedAxiosPost(GET_ACTIVITIES_BY_TYPE, {})
}

export const getTodayActivitiesApi = async () => {
  return authorizedAxiosPost(GET_TODAY_ACTIVITIES, {})
}

export const updateActivityStatusApi = async activityData => {
  return authorizedAxiosPost(UPDATE_ACTIVITY_STATUS, activityData)
}

export const getFilteredActivitiesApi = async data => {
  return authorizedAxiosPost(GET_FILTERED_ACTIVITIES, data)
}

export const assignActivityToUsersApi = async data => {
  return authorizedAxiosPost(ASSIGN_ACTIVITY, data)
}

export const getUserAssignedActivitiesApi = async data => {
  return authorizedAxiosPost(GET_USER_ASSIGNED__ACTIVITIES, data)
}

export const updateCancelActivityApi = async activityData => {
  return authorizedAxiosPost(CANCEL_ACTIVITY, activityData)
}

// ===== public URI in Activity
export const downloadActivityInviteApi = async data => {
  return axios.post(DOWNLOAD_ACTIVITY_INVITE, data)
}

//! ========== Activity Comment
export const addActivityCommentApi = async data => {
  return authorizedAxiosPost(ADD_ACTIVITY_COMMENT, data)
}

//! ========== Officer Response

export const addOfficerResponseApi = async (data, id) => {
  const url = `${BASE_URL}/add-officer-response/${id}`
  return authorizedAxiosPost(url, data)
}

export const officerResponseALreadyFilledApi = async (data, id) => {
  const url = `${BASE_URL}/officer-response-already-filled/${id}`
  return authorizedAxiosPost(url, data)
}

export const updateOfficerResponseALreadyFilledApi = async (data, id) => {
  const url = `${BASE_URL}/update-officer-response-already-filled/${id}`
  return authorizedAxiosPost(url, data)
}

export const resetOfficerResponseALreadyFilledApi = async (data, id) => {
  const url = `${BASE_URL}/reset-officer-response-already-filled/${id}`
  return authorizedAxiosPost(url, data)
}

export const updateOfficerResponseApi = async (data, id) => {
  const url = `${BASE_URL}/officer-response/${(data, id)}`
  return authorizedAxiosPost(url, data)
}

export const getAllOfficersResponseApi = async data => {
  return authorizedAxiosPost(GET_ALL_OFFICERS_RESPONSE, data)
}

export const getSingleOfficerResponseApi = async data => {
  return authorizedAxiosPost(GET_SINGLE_OFFICER_RESPONSE, data)
}

// ===== public URI in Activity
export const getSingleOfficerResponsePublicApi = async data => {
  return axios.post(GET_SINGLE_OFFICER_RESPONSE_PUBLIC, data)
}

//! ========== Property Select (ADD)
export const addPropertyTypeApi = async data => {
  return authorizedAxiosPost(ADD_TYPE, data)
}

export const addPropertyCategoryApi = async data => {
  return authorizedAxiosPost(ADD_CATEGORY, data)
}

export const addPropertyAIApi = async data => {
  return authorizedAxiosPost(ADD_AI, data)
}

export const addPropertyKeysApi = async data => {
  return authorizedAxiosPost(ADD_KEYS, data)
}

export const addPropertyPointOfContactApi = async data => {
  return authorizedAxiosPost(ADD_POINT_OF_CONTACT, data)
}

//! ========= Property Select (GET)
export const getPropertyTypeApi = async () => {
  return authorizedAxiosPost(GET_TYPE, {})
}

export const getPropertyChargeAbleApi = async () => {
  return authorizedAxiosPost(GET_CHARGE_ABLE, {})
}

export const getPropertyStatusApi = async () => {
  return authorizedAxiosPost(GET_STATUS, {})
}

export const getPropertyCategoryApi = async () => {
  return authorizedAxiosPost(GET_CATEGORY, {})
}

export const getPropertyAIApi = async () => {
  return authorizedAxiosPost(GET_AI, {})
}

export const getPropertyKeysApi = async () => {
  return authorizedAxiosPost(GET_KEYS, {})
}

export const getPropertySubscriptionFeeApi = async () => {
  return authorizedAxiosPost(GET_SUBSCRIPTION_FEE, {})
}

export const getPropertyFlatFeeServiceApi = async () => {
  return authorizedAxiosPost(GET_FLAT_FEE_SERVICE, {})
}

export const getPropertyTimeBasedServiceApi = async () => {
  return authorizedAxiosPost(GET_TIME_BASED_SERVICE, {})
}

export const getPropertyPointOfContactApi = async data => {
  return authorizedAxiosPost(GET_POINT_OF_CONTACT, data)
}
