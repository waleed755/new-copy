import { useAuth0 } from '@auth0/auth0-react'
import Button from '@mui/material/Button'

export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0()

  return (
    <Button
      variant='contained'
      color='error'
      onClick={() => loginWithRedirect()}
      sx={{ marginTop: '20px', marginBottom: '' }}
    >
      SignUp/Login as a Company
    </Button>
  )
}

export default LoginButton
