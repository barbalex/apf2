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

import { appBaseUrl } from '../../../../../modules/appBaseUrl.js'
import {
  outerList,
  innerList,
  listItemText,
  listItem,
  listItemButton,
  outsideLink,
} from '../EkfsMenu/Ekf.module.css'

export const Eks = ({ tpop, ek, border }) => {
  const [open, setOpen] = useState(true)
  const toggleOpen = () => setOpen(!open)
  const zaehls = ek?.tpopkontrzaehlsByTpopkontrId?.nodes ?? []
  const bearbeiter = ek?.adresseByBearbeiter?.name ?? '(kein Bearbeiter)'
  const title = `${ek.datum || '(kein Datum)'}: ${ek.typ}, ${bearbeiter}`
  const projId = tpop?.popByPopId?.apByApId?.projId
  const apId = tpop?.popByPopId?.apByApId?.id
  const popId = tpop?.popByPopId?.id
  const tpopId = tpop.id
  const url = `${appBaseUrl()}Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Feld-Kontrollen/${
    ek.id
  }`

  return (
    <List
      component="nav"
      style={{ borderBottom: border ? '1px solid #d6d6d6' : 'none' }}
      className={outerList}
    >
      <ListItemButton
        onClick={toggleOpen}
        className={listItemButton}
      >
        <ListItemText
          primary={title}
          className={listItemText}
        />
        <div
          onClick={() => {
            if (window.matchMedia('(display-mode: standalone)').matches) {
              return window.open(url, '_blank', 'toolbar=no')
            }
            window.open(url)
          }}
          title="in neuem Fenster öffnen"
          className={outsideLink}
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
        <List className={innerList}>
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
                className={listItem}
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
