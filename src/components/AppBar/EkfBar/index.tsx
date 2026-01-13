import { useQuery } from '@apollo/client/react'
import { Link } from 'react-router'
import { useParams, useLocation } from 'react-router'
import Button from '@mui/material/Button'

import { EkfYear } from './EkfYear.tsx'
import { User } from './User/index.tsx'
import { query } from './query.js'
import { Menus } from './Menus.tsx'

import type { UserId } from '../../../models/apflora/public/User.ts'

import styles from './index.module.css'

interface UserQueryResult {
  userById: {
    id: UserId
    name: string | null
  } | null
}

export const EkfBar = () => {
  const { userId } = useParams()
  const { search } = useLocation()

  // if no ekfAdresseId
  // need to fetch adresse.id for this user
  // and use that instead
  const { data: userData } = useQuery<UserQueryResult>(query, {
    variables: { userId: userId ?? '99999999-9999-9999-9999-999999999999' },
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
