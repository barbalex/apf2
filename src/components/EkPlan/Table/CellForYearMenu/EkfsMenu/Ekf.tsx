import { useState } from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import {
  MdExpandMore as ExpandIcon,
  MdExpandLess as CloseIcon,
} from 'react-icons/md'
import { FaExternalLinkAlt } from 'react-icons/fa'

import { appBaseUrl } from '../../../../../modules/appBaseUrl.ts'
import styles from './Ekf.module.css'

export const Ekf = ({ tpop, ekf, border }) => {
  const [open, setOpen] = useState(true)
  const toggleOpen = () => setOpen(!open)
  const zaehls = ekf?.tpopkontrzaehlsByTpopkontrId?.nodes ?? []
  const bearbeiter = ekf?.adresseByBearbeiter?.name ?? '(kein Bearbeiter)'
  const title = `${ekf.datum || '(kein Datum)'}, ${bearbeiter}`
  const projId = tpop?.popByPopId?.apByApId?.projId
  const apId = tpop?.popByPopId?.apByApId?.id
  const popId = tpop?.popByPopId?.id
  const tpopId = tpop.id
  const url = `${appBaseUrl()}Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Freiwilligen-Kontrollen/${
    ekf.id
  }`

  return (
    <List
      component="nav"
      style={{ borderBottom: border ? '1px solid #d6d6d6' : 'none' }}
      className={styles.outerList}
    >
      <ListItemButton onClick={toggleOpen}>
        <ListItemText
          primary={title}
          className={styles.listItemText}
        />
        <div
          onClick={() => {
            if (window.matchMedia('(display-mode: standalone)').matches) {
              return window.open(url, '_blank', 'toolbar=no')
            }
            window.open(url)
          }}
          title="in neuem Fenster öffnen"
          className={styles.outsideLink}
        >
          <FaExternalLinkAlt />
        </div>
        {open ?
          <CloseIcon />
        : <ExpandIcon />}
      </ListItemButton>
      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
      >
        <List className={styles.innerList}>
          {zaehls.map((z) => {
            const einheit =
              z?.tpopkontrzaehlEinheitWerteByEinheit?.text ?? '(keine Einheit)'
            const methode =
              z?.tpopkontrzaehlMethodeWerteByMethode?.text ?? '(keine Methode)'
            const anzahl =
              z.anzahl !== null ? z.anzahl : '(Anzahl nicht erfasst)'

            return (
              <ListItem
                key={z.id}
                component="div"
                className={styles.listItem}
              >
                {`${anzahl} ${einheit}, ${methode}`}
              </ListItem>
            )
          })}
        </List>
      </Collapse>
    </List>
  )
}
