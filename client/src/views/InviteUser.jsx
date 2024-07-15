import { useNavigate } from 'react-router-dom'
import LogoutButton from '../components/Logout.jsx'
import { useAuth0 } from '@auth0/auth0-react'
import { useLayoutEffect, useState } from 'react'
import { inviteUserApi } from '../services/apiConstants.js'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { message } from 'antd'

export const InviteUser = () => {
  const { isAuthenticated } = useAuth0()
  const [formData, setFormData] = useState({
    email: '',
  })
  const navigate = useNavigate()


  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const data = {
      email: formData.email,
    }

    try {
      const response = await inviteUserApi(data)
      console.log('res',response)
      if (response.data.message) {
        message.success(
          ` Invitation Link has been sent on the provided Email`
        )
      }
    } catch (error) {
      message.error(` ${error}`)
    }
  }

  const handleClick = () => {
    navigate('/admin-dashboard')
  }

  return (
    <div style={{ padding: '140px' }}>
      <Typography variant='h5' align='center'>
        Invite User
      </Typography>
      <ToastContainer />
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
                  id='email'
                  type='text'
                  autoComplete='off'
                  label='Email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
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
              Invite User
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

export default InviteUser
