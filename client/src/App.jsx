import React, { useState, useEffect } from 'react'
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'
import Login from './views/Login.jsx'
import Register from './views/Register.jsx'
import BoardingUser from './views/BoardingUser.jsx'
import BoardingCompany from './views/BoardingCompany.jsx'
import AdminDashboard from './views/AdminDashboard.jsx'
import AddUser from './views/AddUser.jsx'
import InviteUser from './views/InviteUser.jsx'
import UserLayout from './layouts/UserLayout.jsx'
import CustomerAccount from './views/CustomerAccount.jsx'
import BranchDetails from './views/BranchDetails.jsx'
import PropertyDetails from './views/PropertyDetails.jsx'
import Reports from './views/Reports.jsx'
import GetOtp from './views/VerifyOtp.jsx'
import ForgotPassword from './views/forget-password.jsx'
import Activities from './views/activities.jsx'
import PropertyPage from './views/ProperyPage.jsx'
import { Spin } from 'antd'
import OfficerAccount from './views/StaffDetails.jsx'
import ChangePassword from './views/change-password.jsx'
import ActivityDetails from './views/activityDetails.jsx'
import ActivityPage from './views/ActivityDetailPage.jsx'
import ResponseOfficerReport from './views/ResponseOfficerReport.jsx'
import UsersDetails from './views/Users.jsx'
import ActivityReport from './views/ActivityReport.jsx'
import ProfilePage from './views/UserProfile.jsx'
import CompanyProfile from './views/CompanyProfile.jsx'
import UserProfile from './views/UserProfile.jsx'
import AddUsers from './views/AddUsers.jsx'
import InvitedUser from './views/InvitedUser.jsx'
import Dashboard from './views/Dashboard.jsx'
import ResponseOfficerReportPublic from './views/ResposneOfficerReportPublic.jsx'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const token = localStorage.getItem('token')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (
      role !== 'Mobile Driver' &&
      token &&
      (location.pathname === '/login' ||
        location.pathname === '/' ||
        location.pathname === '/register' ||
        location.pathname === '/verify-otp' ||
        location.pathname === '/register-user')
    ) {
      setIsAuthenticated(true)
      const redirectPath = '/user-dashboard/dashboard'
      window.location.replace(redirectPath)
    } else if (
      role === 'Mobile Driver' &&
      token &&
      (location.pathname === '/login' ||
        location.pathname === '/' ||
        location.pathname === '/register' ||
        location.pathname === '/verify-otp' ||
        location.pathname === '/register-user')
    ) {
      const redirectPath = '/user-dashboard/all-activities'
      window.location.replace(redirectPath)
    }
    setIsLoading(false)
  }, [window.location.pathname])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div>
        <Spin spinning={true} />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' index element={<Login />} />
        <Route path='/verify-otp' element={<GetOtp onVerify={handleLogin} />} />
        <Route
          path='/report/:reference'
          element={<ResponseOfficerReportPublic />}
        />
        <Route path='/register' element={<Register />} />
        <Route path='/reset-password' element={<ForgotPassword />} />
        <Route path='/register-user' element={<BoardingUser />} />
        <Route path='/register-user/:id' element={<InvitedUser />} />
        <Route path='/register-company' element={<BoardingCompany />} />
        <Route path='/add-users' element={<AddUsers />} />

        {isAuthenticated && (
          <>
            <Route path='/admin-dashboard' element={<AdminDashboard />} />
            <Route path='/add-user' element={<AddUser />} />
            <Route path='/invite-user' element={<InviteUser />} />

            <Route path='/user-dashboard' element={<UserLayout />}>
              <Route path='change-password' element={<ChangePassword />} />
              <Route path='dashboard' element={<Dashboard />} />

              <Route path='user-profile' element={<UserProfile />} />
              <Route path='company-profile' element={<CompanyProfile />} />

              <Route path='customer' element={<CustomerAccount />} />
              <Route path='branch' element={<BranchDetails />} />
              <Route path='property' element={<PropertyDetails />} />
              <Route path='property/:id' element={<PropertyPage />} />
              <Route path='contracter' element={<OfficerAccount />} />
              <Route path='users' element={<UsersDetails />} />

              <Route path='add-activities' element={<Activities />} />

              <Route path='all-activities' element={<ActivityDetails />} />
              <Route path='activity/:reference' element={<ActivityPage />} />
              <Route
                path='activity/response-officer-report/:reference'
                element={<ResponseOfficerReport />}
              />

              <Route path='property-report' element={<Reports />} />
              <Route path='activity-report' element={<ActivityReport />} />
            </Route>
          </>
        )}

        {!isAuthenticated && (
          <Route path='*' element={<Navigate to='/login' replace />} />
        )}
      </Routes>
    </BrowserRouter>
  )
}

export default App
