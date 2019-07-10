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
  border-bottom: ${props => (props.border ? '1px solid #d6d6d6' : 'none')};
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

const EkfMenu = ({ ekf, border }) => {
  const [open, setOpen] = useState(true)
  const toggleOpen = useCallback(() => setOpen(!open), [open])
  const zaehls = get(ekf, 'tpopkontrzaehlsByTpopkontrId.nodes', [])
  const bearbeiter = get(ekf, 'adresseByBearbeiter.name') || '(kein Bearbeiter)'
  const title = `${ekf.datum || '(kein Datum)'}, ${bearbeiter}`

  return (
    <OuterList component="nav" border={border}>
      <SyledListItem button onClick={toggleOpen}>
        <StyledListItemText primary={title} />
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
              <SyledListItem key={z.id} component="div" disablePadding>
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
