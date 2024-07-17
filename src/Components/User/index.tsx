import React, { useEffect, useState } from 'react'

interface User {
  id: string
  firstName: string
  lastName: string;
  address: {
    street: string
    city: string
    state: string
    zip: string
  }
}

const User: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true)
      const response = await fetch('/api/user')
      const data = await response.json()
      setUser(data)
      setIsLoading(false)
    }

    fetchUser()
  }, [])


  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>No user found</div>
  }

  return (
    <div>
      <h1>User Info</h1>
      <p>ID: {user.id}</p>
      <p>Name: {user.firstName}</p>
      <p>Name: {user.lastName}</p>
      {user.address.street && <p>Address: {user.address.street}</p>}
    </div>
  )
}

export default User
