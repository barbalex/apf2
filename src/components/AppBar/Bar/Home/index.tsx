import Button from '@mui/material/Button'
import { useLocation } from 'react-router'

import { PrefetchLink } from '../../../shared/PrefetchLink.tsx'
import { Dokumentation } from './Dokumentation.tsx'
import styles from './index.module.css'

export const HomeMenus = () => {
  const { search } = useLocation()

  return (
    <>
      <Button
        variant="text"
        component={PrefetchLink}
        to={`/Daten/Projekte/017d3474-6b07-7c56-86ef-84b0af1de903${search}`}
        className={styles.button}
      >
        Daten
      </Button>
      <Dokumentation />
    </>
  )
}
