import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, TextField, Box, Typography, Alert } from '@mui/material'
import { fillUserPasswordApi } from '../services/apiConstants'
import Logo from '../assets/color.png';


export const InvitedUser = () => {
  const { id } = useParams()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  console.log('userId', id)

  const handlePasswordChange = event => {
    setPassword(event.target.value)
  }

  const handleSubmit = async () => {
    try {
      await fillUserPasswordApi(id, { password: password })
      navigate('/login')
    } catch (err) {
      setError('Failed to set password. Please try again.')
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        }}
      >
          <div className='flex items-center justify-center'>        <img src={Logo} height={'30%'} width={'30%'} alt="" className="my-5 " />
          </div>
        <Typography variant='h5' component='h1' gutterBottom>
          Set Your Password
        </Typography>
        <TextField
          label='Enter Password'
          type='password'
          value={password}
          onChange={handlePasswordChange}
          fullWidth
          variant='outlined'
          margin='normal'
        />
        {error && (
          <Alert severity='error' sx={{ marginBottom: '10px' }}>
            {error}
          </Alert>
        )}
        <Button
          variant='contained'
          color='primary'
          onClick={handleSubmit}
          fullWidth
          sx={{ marginTop: '20px' }}
        >
          Submit Password
        </Button>
      </Box>
    </Box>
  )
}

export default InvitedUser
