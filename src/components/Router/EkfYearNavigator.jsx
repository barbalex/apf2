import { Navigate, useLocation } from 'react-router-dom'

const ekfRefYear = new Date().getFullYear()

const EkfYearNavigator = () => {
  const { search } = useLocation()

  return <Navigate to={`${ekfRefYear.toString()}${search}`} />
}

export default EkfYearNavigator
