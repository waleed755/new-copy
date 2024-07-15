import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'

export const UserDashboard = () => {
  const navigate = useNavigate()

  return (
    <div style={{ paddingTop: '120px' }}>
      <Typography variant='h5' align='center'>
        Welcome to the User Dashboard!
      </Typography>
      <Grid
        container
        spacing={1}
        sx={{
          textAlign: 'center',
          padding: '30px',
        }}
      >
        <Grid item xs={12}>
          <Button
            variant='contained'
            color='error'
            onClick={() => navigate('/login')}
          >
            Back to Login Page
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default UserDashboard
