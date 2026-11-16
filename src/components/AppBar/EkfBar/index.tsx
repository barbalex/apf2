import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { useParams, useLocation } from 'react-router'
import { useAtomValue } from 'jotai'
import Button from '@mui/material/Button'
import { apiFetch } from '../../../modules/api.ts'

import { Menus } from './Menus.tsx'
import { userTokenAtom } from '../../../store/index.ts'

import styles from './index.module.css'

export const EkfBar = () => {
  const { userId } = useParams()
  const { search } = useLocation()
  const token = useAtomValue(userTokenAtom)
  // if no ekfAdresseId
  // need to fetch adresse.id for this user
  // and use that instead.
  // Not before login: the bar renders on /Benutzer/:userId/EKF routes
  // regardless of authentication, and anon may not read q_user — the
  // Anmeldung dialog opens instead of an error page
  const { data: userData } = useQuery({
    queryKey: ['ekfUser', userId],
    enabled: !!token,
    queryFn: async () => {
      const rows =
        (await apiFetch<{ id: string; name: string | null }[]>(
          `/q_user?id=eq.${userId ?? '99999999-9999-9999-9999-999999999999'}&select=id,name`,
        )) ?? []
      return { userById: rows[0] ?? null }
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
