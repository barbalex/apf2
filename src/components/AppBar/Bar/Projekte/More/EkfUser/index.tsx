import { Suspense } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client/react'
import { useNavigate, useLocation } from 'react-router'

import { Select } from '../../../../../shared/Select.tsx'
import { queryAdresses } from './queryAdresses.ts'

import styles from './index.module.css'

const ekfRefDate = new Date() //.setMonth(new Date().getMonth() - 2)
const ekfRefYear = new Date(ekfRefDate).getFullYear()

export const EkfUser = ({ closeMenu }: { closeMenu: () => void }) => {
  const navigate = useNavigate()
  const { search } = useLocation()
  const apolloClient = useApolloClient()

  const { data } = useSuspenseQuery({
    queryKey: ['ekfUsers'],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: queryAdresses,
      })
      if (result.error) throw result.error
      return result.data ?? { allUsers: { nodes: [] } }
    },
  })

  const choose = (event: { target: { value: string | number | null } }) => {
    const value = event.target.value
    closeMenu()
    // prevent this happening before setAnchor happened
    setTimeout(
      () =>
        void navigate(`/Daten/Benutzer/${value}/EKF/${ekfRefYear}${search}`),
    )
  }

  return (
    <div className={styles.container}>
      <Suspense fallback={'lade...'}>
        <Select
          value={''}
          label="EKF sehen als"
          options={(data.allUsers?.nodes ?? []).filter((n) => !!n)}
          loading={false}
          saveToDb={choose}
          maxHeight={120}
        />
      </Suspense>
    </div>
  )
}
