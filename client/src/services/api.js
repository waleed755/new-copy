import { BASE_URL } from '../config.js'

// ! Auth APIs
export const REGISTER = `${BASE_URL}/register`
export const LOGIN = `${BASE_URL}/login`
export const VERIFY_OTP = `${BASE_URL}/verify-otp`
export const RESEND_OTP = `${BASE_URL}/resend-otp`
export const VERIFY_EMAIL = `${BASE_URL}/verify-email`
export const RESET_PASSWORD = `${BASE_URL}/reset-password`

//! Company APIs
export const REGISTER_COMPANY = `${BASE_URL}/register-company`

//! Report APIs
export const GET_PROPERTY_REPORT = `${BASE_URL}/get-property-report`
export const GET_ACTIVITY_REPORT = `${BASE_URL}/get-activity-report`

//! User APIs
export const ADD_USER = `${BASE_URL}/add-user`
export const GET_ALL_USERS = `${BASE_URL}/get-all-users`
export const USER_STATUS_TOGGLER = `${BASE_URL}/user-status-toggler`
export const INVITE_USER = `${BASE_URL}/invite-user`
export const FIND_USER = `${BASE_URL}/find-user`

//! Customer Record APIs
export const ADD_CUSTOMER = `${BASE_URL}/add-customer`
export const GET_CUSTOMERS = `${BASE_URL}/get-customers`
export const GET_CUSTOMER_NAMES = `${BASE_URL}/get-customer-names`
export const GET_CUSTOMER_NAMES_WITH_ACTIVE_STATUS = `${BASE_URL}/get-customer-names-with-active-status`
export const CUSTOMER_STATUS_TOGGLER = `${BASE_URL}/customer-status-toggler`

//! Branch Record APIs
export const ADD_BRANCH = `${BASE_URL}/add-branch`
export const GET_BRANCHES = `${BASE_URL}/get-branches`
export const GET_BRANCHES_NAMES = `${BASE_URL}/get-branches-names`
export const GET_BRANCHES_NAMES_WITH_ACTIVE_STATUS = `${BASE_URL}/get-branches-names-with-active-status`
export const BRANCH_STATUS_TOGGLER = `${BASE_URL}/branch-status-toggler`

//! Property Record APIs
export const ADD_PROPERTY = `${BASE_URL}/add-property`
export const GET_PROPERTIES = `${BASE_URL}/get-properties`
export const GET_PROPERTIES_NAMES = `${BASE_URL}/get-properties-names`
export const GET_PROPERTIES_NAMES_WITH_ACTIVE_STATUS = `${BASE_URL}/get-properties-names-with-active-status`
export const PROPERTY_STATUS_TOGGLER = `${BASE_URL}/property-status-toggler`

//! Staff Record APIs
export const ADD_STAFF = `${BASE_URL}/add-staff`
export const GET_ALL_STAFF = `${BASE_URL}/get-all-staff`
export const GET_STAFF_NAMES = `${BASE_URL}/get-staff-names`
export const STAFF_STATUS_TOGGLER = `${BASE_URL}/staff-status-toggler`

//! Activity Record APIs
export const ADD_ACTIVITY = `${BASE_URL}/add-activity`
export const GET_ALL_ACTIVITIES = `${BASE_URL}/get-activities`
export const GET_ACTIVITIES_BY_TYPE = `${BASE_URL}/get-activities-by-type`
export const GET_TODAY_ACTIVITIES = `${BASE_URL}/get-today-activities`
export const UPDATE_ACTIVITY_STATUS = `${BASE_URL}/update-activity-status`
export const GET_FILTERED_ACTIVITIES = `${BASE_URL}/get-filtered-activities`
export const ASSIGN_ACTIVITY = `${BASE_URL}/assign-activity`
export const GET_USER_ASSIGNED__ACTIVITIES = `${BASE_URL}/get-user-assigned-activity`
export const DOWNLOAD_ACTIVITY_INVITE = `${BASE_URL}/download-activity-invite`
export const CANCEL_ACTIVITY = `${BASE_URL}/cancel-activity`

// ! comment
export const ADD_ACTIVITY_COMMENT = `${BASE_URL}/activity-comment`

//! Officer Record APIs
export const GET_ALL_OFFICERS_RESPONSE = `${BASE_URL}/get-all-officers-response`
export const GET_SINGLE_OFFICER_RESPONSE = `${BASE_URL}/get-single-officer-response`
export const GET_SINGLE_OFFICER_RESPONSE_PUBLIC = `${BASE_URL}/get-single-officer-response-public`

//! Property Select APIs (ADD)
export const ADD_TYPE = `${BASE_URL}/add-type`
export const ADD_CATEGORY = `${BASE_URL}/add-category`
export const ADD_KEYS = `${BASE_URL}/add-keys`
export const ADD_AI = `${BASE_URL}/add-ai`
export const ADD_POINT_OF_CONTACT = `${BASE_URL}/add-point-of-contact`

//!  Property Select APIs (GET)
export const GET_TYPE = `${BASE_URL}/get-type`
export const GET_CATEGORY = `${BASE_URL}/get-category`
export const GET_STATUS = `${BASE_URL}/get-status`
export const GET_KEYS = `${BASE_URL}/get-keys`
export const GET_AI = `${BASE_URL}/get-ai`
export const GET_POINT_OF_CONTACT = `${BASE_URL}/get-point-of-contact`
export const GET_SUBSCRIPTION_FEE = `${BASE_URL}/get-subscription-fee`
export const GET_FLAT_FEE_SERVICE = `${BASE_URL}/get-flat-fee-service`
export const GET_TIME_BASED_SERVICE = `${BASE_URL}/get-time-based-service`
export const GET_CHARGE_ABLE = `${BASE_URL}/get-charge-able`
