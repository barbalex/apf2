import React, { useState, useCallback } from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import {
  MdExpandMore as ExpandIcon,
  MdExpandLess as CloseIcon,
} from 'react-icons/md'
import get from 'lodash/get'
import styled from 'styled-components'

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

const MassnMenu = ({ massn, border }) => {
  const [open, setOpen] = useState(true)
  const toggleOpen = useCallback(() => setOpen(!open), [open])
  const bearbeiter =
    get(massn, 'adresseByBearbeiter.name') || '(kein Bearbeiter)'
  const typ = get(massn, 'tpopmassnTypWerteByTyp.text') || '(kein Typ)'
  const title = `${massn.datum || '(kein Datum)'}: ${typ}, ${bearbeiter}`
  const anzTriebe =
    massn.anzTriebe !== null ? massn.anzTriebe : '(nicht erfasst)'
  const anzPflanzen =
    massn.anzPflanzen !== null ? massn.anzPflanzen : '(nicht erfasst)'

  return (
    <OuterList component="nav" border={border.toString()}>
      <SyledListItem button onClick={toggleOpen}>
        <StyledListItemText primary={title} />
        {open ? <CloseIcon /> : <ExpandIcon />}
      </SyledListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <InnerList>
          <SyledListItem component="div" disablePadding>
            {`Triebe: ${anzTriebe}`}
          </SyledListItem>
          <SyledListItem component="div" disablePadding>
            {`Pflanzen: ${anzPflanzen}`}
          </SyledListItem>
          {!!massn.bemerkungen && (
            <SyledListItem component="div" disablePadding>
              {`Bemerkungen: ${massn.bemerkungen}`}
            </SyledListItem>
          )}
        </InnerList>
      </Collapse>
    </OuterList>
  )
}

export default MassnMenu
