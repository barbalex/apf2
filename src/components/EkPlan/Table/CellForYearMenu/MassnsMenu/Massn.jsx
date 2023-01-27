import React, { useState, useCallback } from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import {
  MdExpandMore as ExpandIcon,
  MdExpandLess as CloseIcon,
} from 'react-icons/md'
import { FaExternalLinkAlt } from 'react-icons/fa'
import styled from '@emotion/styled'

import appBaseUrl from '../../../../../modules/appBaseUrl'

const OuterList = styled(List)`
  border-bottom: ${(props) =>
    props.border === 'true' ? '1px solid #d6d6d6' : 'none'};
  padding-top: 4px !important;
  padding-bottom: 4px !important;
`
const InnerList = styled(List)`
  padding-top: 2px !important;
  padding-bottom: 2px !important;
`
const StyledListItemText = styled(ListItemText)`
  padding-right: 8px;
  span {
    font-size: 0.85rem !important;
  }
`
const StyledListItem = styled(ListItem)`
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  font-size: 0.85rem !important;
`
const OutsideLink = styled.div`
  margin-left: 2px;
  margin-right: 6px;
  margin-bottom: -2px;
  cursor: pointer;
  svg {
    font-size: 0.9em;
    color: rgba(0, 0, 0, 0.77);
  }
`

const MassnMenu = ({ tpop, massn, border }) => {
  const [open, setOpen] = useState(true)
  const toggleOpen = useCallback(() => setOpen(!open), [open])
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
    <OuterList component="nav" border={border.toString()}>
      <StyledListItem button onClick={toggleOpen}>
        <StyledListItemText primary={title} />
        <OutsideLink
          onClick={() => {
            if (window.matchMedia('(display-mode: standalone)').matches) {
              return window.open(url, '_blank', 'toolbar=no')
            }
            window.open(url)
          }}
          title="in neuem Fenster öffnen"
        >
          <FaExternalLinkAlt />
        </OutsideLink>
        {open ? <CloseIcon /> : <ExpandIcon />}
      </StyledListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <InnerList>
          <StyledListItem component="div">
            {`Triebe: ${anzTriebe}`}
          </StyledListItem>
          <StyledListItem component="div">
            {`Pflanzen: ${anzPflanzen}`}
          </StyledListItem>
          {anzZielrelevEinheit !== null && (
            <StyledListItem component="div">
              {`${zielrelevEinheit}: ${anzZielrelevEinheit} (ziel-relevant)`}
            </StyledListItem>
          )}
          {!!massn.bemerkungen && (
            <StyledListItem component="div">
              {`Bemerkungen: ${massn.bemerkungen}`}
            </StyledListItem>
          )}
        </InnerList>
      </Collapse>
    </OuterList>
  )
}

export default MassnMenu
