// @flow
import React, { Fragment } from 'react'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import FilterIcon from '@material-ui/icons/FilterList'
import remove from 'lodash/remove'
import get from 'lodash/get'
import clone from 'lodash/clone'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import isMobilePhone from '../../../modules/isMobilePhone'
import setUrlQueryValue from '../../../modules/setUrlQueryValue'
import withNodeFilter from '../../../state/withNodeFilter'

const StyledIconButton = styled.div`
  height: 30px !important;
  width: 30px !important;
  margin-right: -5px !important;
  margin-left: 8px !important;
  margin-top: -11px !important;
  margin-bottom: -11px !important;
  border-radius: 4px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`
const StyledFilterIcon = styled(FilterIcon)`
  cursor: pointer;
  pointer-events: auto;
  margin-top: 2px;
  color: white;
`
// need to prevent boolean props from being passed to dom
const StyledButton = ({ preceded, followed, ...rest }) => {
  const StyledButton = styled(Button)`
    color: white !important;
    border-color: rgba(255, 255, 255, 0.5) !important;
    border-right-color: ${followed
      ? ' rgba(255, 255, 255, 0.25)'
      : ' rgba(255, 255, 255, 0.5)'} !important;
    border-left-color: ${preceded
      ? ' rgba(255, 255, 255, 0.25)'
      : ' rgba(255, 255, 255, 0.5)'} !important;
    border-top-left-radius: ${preceded ? '0' : '4px'} !important;
    border-bottom-left-radius: ${preceded ? '0' : '4px'} !important;
    border-top-right-radius: ${followed ? '0' : '4px'} !important;
    border-bottom-right-radius: ${followed ? '0' : '4px'} !important;
    margin-right: ${followed ? '-1px' : 'unset'} !important;
  `
  return <StyledButton {...rest} />
}

const enhance = compose(
  withNodeFilter,
  withState('datenFilterAnchorEl', 'setDatenFilterAnchorEl', null),
  withHandlers({
    onClickButton: ({ data }) => event => {
      // catch case when filter button was clicked
      if (event.target.localName !== 'span') return
      const projekteTabs = clone(get(data, 'urlQuery.projekteTabs', []))
      if (isMobilePhone()) {
        // show one tab only
        setUrlQueryValue({ key: 'projekteTabs', value: ['daten'] })
      } else {
        if (projekteTabs.includes('daten')) {
          remove(projekteTabs, el => el === 'daten')
        } else {
          projekteTabs.push('daten')
        }
        setUrlQueryValue({ key: 'projekteTabs', value: projekteTabs })
      }
    },
    onClickFilterButton: ({ setDatenFilterAnchorEl }) => event => {
      console.log('onClickFilterButton', {
        event,
        currentTarget: event.currentTarget,
        target: event.target,
      })
      setDatenFilterAnchorEl(event.currentTarget)
      event.stopPropagation()
      event.preventDefault()
    },
    onCloseFilter: ({ setDatenFilterAnchorEl }) => () =>
      setDatenFilterAnchorEl(null),
    onClickFilterTable: ({
      setDatenFilterAnchorEl,
      nodeFilterState,
    }) => event => {
      setDatenFilterAnchorEl(null)
      const { table } = event.target.dataset
      nodeFilterState.setActiveTable({ treeName: 'tree', activeTable: table })
    },
  }),
)

const MyAppBar = ({
  onClickButton,
  datenFilterAnchorEl,
  onClickFilterButton,
  onCloseFilter,
  onClickFilterTable,
  data,
  nodeFilterState,
}: {
  onClickButton: () => void,
  datenFilterAnchorEl: Object,
  onClickFilterButton: () => void,
  onCloseFilter: () => void,
  onClickFilterTable: () => void,
  data: Object,
  nodeFilterState: Object,
}) => {
  const projekteTabs = clone(get(data, 'urlQuery.projekteTabs', []))

  return (
    <StyledButton
      variant={projekteTabs.includes('daten') ? 'outlined' : 'text'}
      preceded={projekteTabs.includes('tree')}
      followed={projekteTabs.includes('karte')}
      onClick={onClickButton}
    >
      Daten
      {projekteTabs.includes('daten') && (
        <Fragment>
          <StyledIconButton
            aria-label="Daten filtern"
            title="Daten filtern (BAUSTELLE)"
            aria-owns={datenFilterAnchorEl ? 'filterTable-menu' : null}
            aria-haspopup="true"
            onClick={onClickFilterButton}
          >
            <StyledFilterIcon />
          </StyledIconButton>
          <Menu
            id="filterTable-menu"
            anchorEl={datenFilterAnchorEl}
            open={Boolean(datenFilterAnchorEl)}
            onClose={onCloseFilter}
          >
            <MenuItem data-table="ap" onClick={onClickFilterTable}>
              Aktionspläne
            </MenuItem>
            <MenuItem data-table="pop" onClick={onClickFilterTable}>
              Populationen
            </MenuItem>
            <MenuItem data-table="tpop" onClick={onClickFilterTable}>
              Teil-Populationen
            </MenuItem>
          </Menu>
        </Fragment>
      )}
    </StyledButton>
  )
}

export default enhance(MyAppBar)
