import { useNavigate } from 'react-router-dom'
import LogoutButton from '../components/Logout.jsx'
import { useAuth0 } from '@auth0/auth0-react'
import { useLayoutEffect } from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'

export const AdminDashboard = () => {
  const { isAuthenticated } = useAuth0()

  const navigate = useNavigate()


  const handleInviteUser = () => {
    navigate('/invite-user')
  }

  const handleAddUser = () => {
    navigate('/add-user')
  }

  return (
    <div style={{ paddingTop: '140px' }}>
      <Typography variant='h5' align='center'>
        Welcome to the Admin Dashboard!
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{
          textAlign: 'center',
        }}
      >
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Button
                variant='contained'
                sx={{ marginTop: '30px' }}
                onClick={handleInviteUser}
              >
                Invite User
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant='contained'
                sx={{ marginBottom: '10px' }}
                onClick={handleAddUser}
              >
                Add User
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            {/* <LogoutButton /> */}
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default AdminDashboard
