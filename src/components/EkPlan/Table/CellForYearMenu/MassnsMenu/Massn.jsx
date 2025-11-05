import { useState } from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { ListItemButton } from '@mui/material'
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

export const Massn = ({ tpop, massn, border }) => {
  const [open, setOpen] = useState(true)
  const toggleOpen = () => setOpen(!open)
  const bearbeiter = massn?.adresseByBearbeiter?.name ?? '(kein Bearbeiter)'
  const typ = massn?.tpopmassnTypWerteByTyp?.text ?? '(kein Typ)'
  const title = `${massn.datum || '(kein Datum)'}: ${typ}, ${bearbeiter}`
  const anzTriebe = massn.anzTriebe !== null ? massn.anzTriebe : 'nicht erfasst'
  const anzPflanzen =
    massn.anzPflanzen !== null ? massn.anzPflanzen : 'nicht erfasst'
  const anzZielrelevEinheit = massn.zieleinheitAnzahl
  const zielrelevEinheit =
    massn?.tpopkontrzaehlEinheitWerteByZieleinheitEinheit?.text ??
    '(ziel-relevante Einheit nicht erfasst)'
  const projId = tpop?.popByPopId?.apByApId?.projId
  const apId = tpop?.popByPopId?.apByApId?.id
  const popId = tpop?.popByPopId?.id
  const tpopId = tpop.id
  const url = `${appBaseUrl()}Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Massnahmen/${
    massn.id
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
          <ListItem
            className={listItem}
            component="div"
          >
            {`Triebe: ${anzTriebe}`}
          </ListItem>
          <ListItem
            className={listItem}
            component="div"
          >
            {`Pflanzen: ${anzPflanzen}`}
          </ListItem>
          {anzZielrelevEinheit !== null && (
            <ListItem
              className={listItem}
              component="div"
            >
              {`${zielrelevEinheit}: ${anzZielrelevEinheit} (ziel-relevant)`}
            </ListItem>
          )}
          {!!massn.bemerkungen && (
            <ListItem
              className={listItem}
              component="div"
            >
              {`Bemerkungen: ${massn.bemerkungen}`}
            </ListItem>
          )}
        </List>
      </Collapse>
    </List>
  )
}
