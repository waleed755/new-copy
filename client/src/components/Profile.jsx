import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'

export const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0()

  useEffect(() => {
    console.log(user)
  })

  if (isLoading) {
    return <div>Loading ...</div>
  }

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <h2>{user.nickname}</h2>
        <p>{user.email}</p>
        <p>
          Email Verified : {user.email_verified ? 'Verified' : 'Not-Verified'}
        </p>
      </div>
    )
  )
}

export default Profile
