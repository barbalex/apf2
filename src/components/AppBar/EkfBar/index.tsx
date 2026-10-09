import { useSuspenseQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client/react'
import { Link } from 'react-router'
import { useParams, useLocation } from 'react-router'
import Button from '@mui/material/Button'

import { query } from './query.ts'
import { Menus } from './Menus.tsx'

import styles from './index.module.css'

export const EkfBar = () => {
  const { userId } = useParams()
  const { search } = useLocation()
  const apolloClient = useApolloClient()

  // if no ekfAdresseId
  // need to fetch adresse.id for this user
  // and use that instead
  const { data: userData } = useSuspenseQuery({
    queryKey: ['ekfUser', userId],
    queryFn: async () => {
      const result = await apolloClient.query({
        query,
        variables: { userId: userId ?? '99999999-9999-9999-9999-999999999999' },
      })
      if (result.error) throw result.error
      return result.data ?? { userById: null }
    },
  })

  const userName = userData?.userById?.name ?? null

  return (
    <div className={styles.container}>
      <Button
        variant="outlined"
        component={Link}
        to={`/${search}`}
        title="Home"
        className={styles.title}
      >
        {userName ?
          `AP Flora: EKF von ${userName}`
        : 'AP Flora: Erfolgs-Kontrolle Freiwillige'}
      </Button>
      <div className={styles.menu}>
        <Menus />
      </div>
    </div>
  )
}
