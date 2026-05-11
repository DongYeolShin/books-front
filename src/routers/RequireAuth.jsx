import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore, { selectIsAuthenticated } from '../stores/authStore'

function RequireAuth({ children }) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: {
            pathname: location.pathname,
            search: location.search,
            state: location.state,
          },
        }}
      />
    )
  }
  return children
}

export default RequireAuth
