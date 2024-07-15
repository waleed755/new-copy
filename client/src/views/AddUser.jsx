import { useNavigate } from 'react-router-dom'
import LogoutButton from '../components/Logout.jsx'
import { useAuth0 } from '@auth0/auth0-react'
import { useLayoutEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { addUserApi } from '../services/apiConstants.js'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const AddUser = () => {
  const { isAuthenticated } = useAuth0()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: '',
    job: '',
    companyId: '',
    companyAdminId: '',
  })

  const navigate = useNavigate()
  const companyState = useSelector(state => state.company)
  const userState = useSelector(state => state.user)


  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const userData = {
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName.toLowerCase(),
      role: formData.role.toLowerCase(),
      job: formData.job.toLowerCase(),
      companyId: companyState?.company._id,
      companyAdminId: userState?.user._id,
    }
    const user = { userData: userData }
    try {
      const response = await addUserApi(user)
      if (response.data.success) {
        toast.success(' User Added Successfully!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        })
        alert('User Added Successfully!')
      }
    } catch (error) {
      toast.error(` ${error}!`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      })
    }
  }

  const handleClick = () => {
    navigate('/admin-dashboard')
  }

  return (
    <div style={{ paddingTop: '110px' }}>
      <ToastContainer />
      <Typography variant='h5' align='center'>
        Add User
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{
          textAlign: 'center',
        }}
      >
        <Grid item xs={12}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField
                  id='fullName'
                  type='text'
                  autoComplete='off'
                  name='fullName'
                  value={formData.fullName}
                  onChange={handleChange}
                  label='Full Name'
                  variant='outlined'
                  sx={{ width: '40%', margin: '10px' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id='email'
                  type='text'
                  autoComplete='off'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  label='Email'
                  variant='outlined'
                  sx={{ width: '40%', margin: '10px' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id='password'
                  type='password'
                  autoComplete='off'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  label='Password'
                  variant='outlined'
                  sx={{ width: '40%', margin: '10px' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id='job'
                  type='text'
                  autoComplete='off'
                  name='job'
                  value={formData.job}
                  onChange={handleChange}
                  label='Job'
                  variant='outlined'
                  sx={{ width: '40%', margin: '10px' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id='role'
                  type='text'
                  autoComplete='off'
                  name='role'
                  value={formData.role}
                  onChange={handleChange}
                  label='Role'
                  variant='outlined'
                  sx={{ width: '40%', margin: '10px' }}
                />
              </Grid>
            </Grid>
            <Button
              variant='contained'
              color='primary'
              sx={{ margin: '10px' }}
              type='submit'
            >
              Add User
            </Button>
          </form>
          <Button
            variant='contained'
            color='warning'
            onClick={handleClick}
            sx={{ margin: '10px' }}
          >
            Back
          </Button>
          <LogoutButton />
        </Grid>
      </Grid>
    </div>
  )
}

export default AddUser
