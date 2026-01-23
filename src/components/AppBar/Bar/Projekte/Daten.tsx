import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import { MdEditNote } from 'react-icons/md'
import { remove } from 'es-toolkit'
import { useAtomValue } from 'jotai'

import { useProjekteTabs } from '../../../../modules/useProjekteTabs.ts'
import { isDesktopViewAtom } from '../../../../store/index.ts'

import styles from './index.module.css'

export const Daten = ({ treeNr = '', hide = false }) => {
  const [projekteTabs, setProjekteTabs] = useProjekteTabs()
  const isDaten = projekteTabs.includes(`daten${treeNr}`)
  const isTree = projekteTabs.includes(`tree${treeNr}`)

  const isDesktopView = useAtomValue(isDesktopViewAtom)

  const onClickButton = () => {
    const copyOfProjekteTabs = [...projekteTabs]
    if (isDesktopView) {
      if (copyOfProjekteTabs.includes(`daten${treeNr}`)) {
        remove(copyOfProjekteTabs, (el) => el === `daten${treeNr}`)
      } else {
        copyOfProjekteTabs.push(`daten${treeNr}`)
      }
      setProjekteTabs(copyOfProjekteTabs)
    } else {
      // show one tab only
      setProjekteTabs([`daten${treeNr}`])
    }
  }

  let followed = projekteTabs.includes('filter')
  if (treeNr === '2') {
    followed = projekteTabs.includes('filter2')
  }

  return (
    <Tooltip
      title={
        isDesktopView ? 'Formulare anzeigen' : (
          'Mobil-Navigation und Formulare anzeigen'
        )
      }
    >
      {isDesktopView ?
        <Button
          variant={isDaten ? 'outlined' : 'text'}
          onClick={onClickButton}
          data-id={`nav-daten${treeNr || 1}`}
          className={`${styles.button} ${isTree ? styles.preceded : ''} ${followed ? styles.followed : ''}`}
        >
          {`Daten${treeNr === '2' ? ' 2' : ''}`}
        </Button>
      : <Button
          variant={isDaten ? 'outlined' : 'text'}
          onClick={onClickButton}
          data-id={`nav-daten${treeNr || 1}`}
          className={`${styles.iconButton} ${isTree ? styles.preceded : ''} ${followed ? styles.followed : ''}`}
        >
          <MdEditNote />
        </Button>
      }
    </Tooltip>
  )
}
