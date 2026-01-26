import { Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client/react'
import { useNavigate, useLocation } from 'react-router'

import { Select } from '../../../../../shared/Select.tsx'
import { queryAdresses } from './queryAdresses.ts'

import type { UserId } from '../../../../../../models/apflora/public/User.ts'

import styles from './index.module.css'

interface UserNode {
  value: UserId
  label: string | null
}

interface UsersQueryResult {
  allUsers: {
    nodes: UserNode[]
  }
}

const ekfRefDate = new Date() //.setMonth(new Date().getMonth() - 2)
const ekfRefYear = new Date(ekfRefDate).getFullYear()

export const EkfUser = ({ closeMenu }) => {
  const navigate = useNavigate()
  const { search } = useLocation()
  const apolloClient = useApolloClient()

  const { data } = useQuery({
    queryKey: ['ekfUsers'],
    queryFn: async () => {
      const result = await apolloClient.query<UsersQueryResult>({
        query: queryAdresses,
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const choose = (event) => {
    const value = event.target.value
    closeMenu()
    // prevent this happening before setAnchor happened
    setTimeout(() =>
      navigate(`/Daten/Benutzer/${value}/EKF/${ekfRefYear}${search}`),
    )
  }

  return (
    <div className={styles.container}>
      <Suspense fallback={'lade...'}>
        <Select
          value={''}
          label="EKF sehen als"
          options={data.allUsers.nodes}
          loading={false}
          saveToDb={choose}
          maxHeight={120}
        />
      </Suspense>
    </div>
  )
}
