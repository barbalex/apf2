import { useCallback } from 'react'
import styled from '@emotion/styled'
import { useQuery } from '@apollo/client'
import { useNavigate, useLocation } from 'react-router'

import { Select } from '../../../../../shared/Select.jsx'
import { Error } from '../../../../../shared/Error.jsx'
import { queryAdresses } from './queryAdresses.js'

const Container = styled.div`
  padding: 0 16px;
`

const ekfRefDate = new Date() //.setMonth(new Date().getMonth() - 2)
const ekfRefYear = new Date(ekfRefDate).getFullYear()

export const EkfUser = ({ closeMenu }) => {
  const navigate = useNavigate()
  const { search } = useLocation()

  const { data, error, loading } = useQuery(queryAdresses)

  const choose = useCallback(
    async (event) => {
      const value = event.target.value
      closeMenu()
      // prevent this happening before seAnchor happened
      setTimeout(() =>
        navigate(`/Daten/Benutzer/${value}/EKF/${ekfRefYear}${search}`),
      )
    },
    [closeMenu, navigate, search],
  )

  if (loading) return <Container>{'lade...'}</Container>

  if (error) return <Error error={error} />

  return (
    <Container>
      <Select
        value={''}
        label="EKF sehen als"
        options={data?.allUsers?.nodes ?? []}
        loading={loading}
        saveToDb={choose}
        maxHeight={120}
      />
    </Container>
  )
}
