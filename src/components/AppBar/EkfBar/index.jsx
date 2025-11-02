import { useQuery } from '@apollo/client/react'
import { Link } from 'react-router'
import { useParams, useLocation } from 'react-router'
import Button from '@mui/material/Button'

import { EkfYear } from './EkfYear.jsx'
import { User } from './User/index.jsx'
import { query } from './query.js'
import { Menus } from './Menus.jsx'

import { container, title, menu } from './index.module.css'

export const EkfBar = () => {
  const { userId } = useParams()
  const { search } = useLocation()

  // if no ekfAdresseId
  // need to fetch adresse.id for this user
  // and use that instead
  const { data: userData } = useQuery(query, {
    variables: { userId: userId ?? '99999999-9999-9999-9999-999999999999' },
  })

  const userName = userData?.userById?.name ?? null

  return (
    <div className={container}>
      <Button
        variant="outlined"
        component={Link}
        to={`/${search}`}
        title="Home"
        className={title}
      >
        {userName ?
          `AP Flora: EKF von ${userName}`
        : 'AP Flora: Erfolgs-Kontrolle Freiwillige'}
      </Button>
      <div className={menu}>
        <Menus />
      </div>
    </div>
  )
}
