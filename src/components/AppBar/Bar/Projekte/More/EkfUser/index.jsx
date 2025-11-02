import { Suspense } from 'react'
import { useQuery } from '@apollo/client/react'
import { useNavigate, useLocation } from 'react-router'

import { Select } from '../../../../../shared/Select.jsx'
import { Error } from '../../../../../shared/Error.jsx'
import { queryAdresses } from './queryAdresses.js'

import { container } from './index.module.css'

const ekfRefDate = new Date() //.setMonth(new Date().getMonth() - 2)
const ekfRefYear = new Date(ekfRefDate).getFullYear()

export const EkfUser = ({ closeMenu }) => {
  const navigate = useNavigate()
  const { search } = useLocation()

  const { data, error } = useQuery(queryAdresses)

  const choose = (event) => {
    const value = event.target.value
    closeMenu()
    // prevent this happening before setAnchor happened
    setTimeout(() =>
      navigate(`/Daten/Benutzer/${value}/EKF/${ekfRefYear}${search}`),
    )
  }

  if (error) return <Error error={error} />

  return (
    <div className={container}>
      <Suspense fallback={'lade...'}>
        <Select
          value={''}
          label="EKF sehen als"
          options={data?.allUsers?.nodes ?? []}
          loading={false}
          saveToDb={choose}
          maxHeight={120}
        />
      </Suspense>
    </div>
  )
}
