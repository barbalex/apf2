import { Navigate, useLocation } from 'react-router'

const ekfRefYear = new Date().getFullYear()

export const Component = () => {
  const { search } = useLocation()

  return <Navigate to={`${ekfRefYear.toString()}${search}`} />
}
