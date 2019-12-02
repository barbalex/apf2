import React, { useState, useCallback } from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import {
  MdExpandMore as ExpandIcon,
  MdExpandLess as CloseIcon,
} from 'react-icons/md'
import { FaExternalLinkAlt } from 'react-icons/fa'
import get from 'lodash/get'
import styled from 'styled-components'

import appBaseUrl from '../../../../../modules/appBaseUrl'

const OuterList = styled(List)`
  border-bottom: ${props =>
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
const SyledListItem = styled(ListItem)`
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

const EkfMenu = ({ tpop, ekf, border }) => {
  const [open, setOpen] = useState(true)
  const toggleOpen = useCallback(() => setOpen(!open), [open])
  const zaehls = get(ekf, 'tpopkontrzaehlsByTpopkontrId.nodes', [])
  const bearbeiter = get(ekf, 'adresseByBearbeiter.name') || '(kein Bearbeiter)'
  const title = `${ekf.datum || '(kein Datum)'}, ${bearbeiter}`
  const projId = get(tpop, 'popByPopId.apByApId.projId')
  const apId = get(tpop, 'popByPopId.apByApId.id')
  const popId = get(tpop, 'popByPopId.id')
  const tpopId = tpop.id
  const url = `${appBaseUrl()}Daten/Projekte/${projId}/Aktionspläne/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Freiwilligen-Kontrollen/${
    ekf.id
  }`

  return (
    <OuterList component="nav" border={border.toString()}>
      <SyledListItem button onClick={toggleOpen}>
        <StyledListItemText primary={title} />
        <OutsideLink
          onClick={() => typeof window !== 'undefined' && window.open(url)}
          title="in neuem Tab öffnen"
        >
          <FaExternalLinkAlt />
        </OutsideLink>
        {open ? <CloseIcon /> : <ExpandIcon />}
      </SyledListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <InnerList>
          {zaehls.map(z => {
            const einheit =
              get(z, 'tpopkontrzaehlEinheitWerteByEinheit.text') ||
              '(keine Einheit)'
            const methode =
              get(z, 'tpopkontrzaehlMethodeWerteByMethode.text') ||
              '(keine Methode)'
            const anzahl =
              z.anzahl !== null ? z.anzahl : '(Anzahl nicht erfasst)'

            return (
              <SyledListItem key={z.id} component="div">
                {`${anzahl} ${einheit}, ${methode}`}
              </SyledListItem>
            )
          })}
        </InnerList>
      </Collapse>
    </OuterList>
  )
}

export default EkfMenu
