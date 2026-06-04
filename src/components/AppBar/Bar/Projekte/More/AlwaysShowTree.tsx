import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { Tooltip } from '@mui/material'
import { useAtom } from 'jotai'

import { alwaysShowTreeAtom } from '../../../../../store/index.ts'
import { constants } from '../../../../../modules/constants.ts'

import styles from './AlwaysShowTree.module.css'

export const AlwaysShowTree = () => {
  const [alwaysShowTree, setAlwaysShowTree] = useAtom(alwaysShowTreeAtom)
  const toggleAlwaysShowTree = () => setAlwaysShowTree(!alwaysShowTree)

  return (
    <Tooltip
      title={
        <>
          <div
            style={{ paddingBottom: '4px' }}
          >{`Ist normalerweise nur auf grossen Bildschirmen verfügbar (ab ${constants.mobileViewMaxWidth + 1} Pixeln Breite).`}</div>
          <div>{`Auf Touch-Geräten sind die Kontext-Menüs nicht verfügbar.`}</div>
        </>
      }
      // if window width > 731 left
      placement={window.innerWidth > 730 ? 'left' : 'bottom'}
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={alwaysShowTree}
            onChange={toggleAlwaysShowTree}
          />
        }
        label="Navigationsbaum immer anbieten"
        className={styles.formControlLabel}
      />
    </Tooltip>
  )
}
