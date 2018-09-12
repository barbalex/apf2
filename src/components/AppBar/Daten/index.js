// @flow
import React, { Fragment } from 'react'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Divider from '@material-ui/core/Divider'
import FilterIcon from '@material-ui/icons/FilterList'
import DeleteFilterIcon from '@material-ui/icons/DeleteSweep'
import remove from 'lodash/remove'
import get from 'lodash/get'
import clone from 'lodash/clone'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import app from 'ampersand-app'
import gql from 'graphql-tag'

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
const StyledDeleteFilterIcon = styled(DeleteFilterIcon)`
  margin-top: -4px;
  padding-right: 5px;
`
const StyledButton = styled(Button)`
  color: white !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  border-right-color: ${props =>
    props.followed === 'true'
      ? ' rgba(255, 255, 255, 0.25)'
      : ' rgba(255, 255, 255, 0.5)'} !important;
  border-left-color: ${props =>
    props.preceded === 'true'
      ? ' rgba(255, 255, 255, 0.25)'
      : ' rgba(255, 255, 255, 0.5)'} !important;
  border-top-left-radius: ${props =>
    props.preceded === 'true' ? '0' : '4px'} !important;
  border-bottom-left-radius: ${props =>
    props.preceded === 'true' ? '0' : '4px'} !important;
  border-top-right-radius: ${props =>
    props.followed === 'true' ? '0' : '4px'} !important;
  border-bottom-right-radius: ${props =>
    props.followed === 'true' ? '0' : '4px'} !important;
  margin-right: ${props =>
    props.followed === 'true' ? '-1px' : 'unset'} !important;
`
const StyledMenuItem = styled(MenuItem)`
  padding-left: ${props =>
    props.level ? 12 + (props.level - 1) * 23 : 16}px !important;
  padding-top: 3px !important;
  padding-bottom: 3px !important;
`
const RemoveMenuItem = styled(StyledMenuItem)`
  padding-top: 6px !important;
`

const enhance = compose(
  withNodeFilter,
  withState('datenFilterAnchorEl', 'setDatenFilterAnchorEl', null),
  withHandlers({
    onClickButton: ({ data, treeNr = '', nodeFilterState }) => event => {
      // catch case when inner filter button was clicked
      if (event.target.localName !== 'span') return
      const projekteTabs = clone(get(data, 'urlQuery.projekteTabs', []))
      if (isMobilePhone()) {
        // show one tab only
        setUrlQueryValue({ key: 'projekteTabs', value: [`daten${treeNr}`] })
      } else {
        if (projekteTabs.includes(`daten${treeNr}`)) {
          remove(projekteTabs, el => el === `daten${treeNr}`)
        } else {
          projekteTabs.push(`daten${treeNr}`)
          if (treeNr === '2') {
            app.client.mutate({
              mutation: gql`
                mutation cloneTree2From1 {
                  cloneTree2From1 @client
                }
              `,
            })
            nodeFilterState.clone1To2()
          }
        }
        setUrlQueryValue({ key: 'projekteTabs', value: projekteTabs })
      }
    },
    onClickFilterButton: ({ setDatenFilterAnchorEl }) => event => {
      setDatenFilterAnchorEl(event.currentTarget)
      event.stopPropagation()
      event.preventDefault()
    },
    onCloseFilter: ({ setDatenFilterAnchorEl }) => () =>
      setDatenFilterAnchorEl(null),
    onClickFilterTable: ({
      setDatenFilterAnchorEl,
      nodeFilterState,
      treeNr = '',
    }) => event => {
      setDatenFilterAnchorEl(null)
      nodeFilterState.setActiveTable({
        treeName: `tree${treeNr}`,
        activeTable: event.target.dataset.table,
      })
    },
    onClickEmptyFilter: ({
      setDatenFilterAnchorEl,
      nodeFilterState,
      treeNr = '',
    }) => event => {
      setDatenFilterAnchorEl(null)
      nodeFilterState.emptyTree(`tree${treeNr}`)
    },
  }),
)

const MyAppBar = ({
  onClickButton,
  datenFilterAnchorEl,
  onClickFilterButton,
  onCloseFilter,
  onClickFilterTable,
  onClickEmptyFilter,
  data,
  nodeFilterState,
  treeNr = '',
}: {
  onClickButton: () => void,
  datenFilterAnchorEl: Object,
  onClickFilterButton: () => void,
  onCloseFilter: () => void,
  onClickFilterTable: () => void,
  onClickEmptyFilter: () => void,
  data: Object,
  nodeFilterState: Object,
  treeNr: string,
}) => {
  const projekteTabs = get(data, 'urlQuery.projekteTabs', [])
  const isDaten = projekteTabs.includes(`daten${treeNr}`)
  const isTree = projekteTabs.includes(`tree${treeNr}`)
  const isKarte = projekteTabs.includes('karte')

  return (
    <StyledButton
      variant={isDaten ? 'outlined' : 'text'}
      preceded={isTree.toString()}
      followed={treeNr === '2' ? 'false' : isKarte.toString()}
      onClick={onClickButton}
    >
      {`Daten${treeNr === '2' ? ' 2' : ''}`}
      {isDaten && (
        <Fragment>
          <StyledIconButton
            aria-label="Daten filtern"
            title="Daten filtern"
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
            <StyledMenuItem data-table="ap" onClick={onClickFilterTable}>
              Aktionspläne
            </StyledMenuItem>
            <StyledMenuItem
              data-table="pop"
              onClick={onClickFilterTable}
              level={1}
            >
              └─ Populationen
            </StyledMenuItem>
            <StyledMenuItem
              data-table="tpop"
              onClick={onClickFilterTable}
              level={2}
            >
              └─ Teil-Populationen
            </StyledMenuItem>
            <StyledMenuItem
              data-table="tpopmassn"
              onClick={onClickFilterTable}
              level={3}
            >
              ─ Massnahmen
            </StyledMenuItem>
            <StyledMenuItem
              data-table="tpopfeldkontr"
              onClick={onClickFilterTable}
              level={3}
            >
              ─ Feld-Kontrollen
            </StyledMenuItem>
            <StyledMenuItem
              data-table="tpopfreiwkontr"
              onClick={onClickFilterTable}
              level={3}
            >
              ─ Freiwilligen-Kontrollen
            </StyledMenuItem>
            <Divider />
            <RemoveMenuItem
              onClick={onClickEmptyFilter}
              disabled={!nodeFilterState.treeIsFiltered(`tree${treeNr}`)}
            >
              <StyledDeleteFilterIcon />
              Alle Filter entfernen
            </RemoveMenuItem>
          </Menu>
        </Fragment>
      )}
    </StyledButton>
  )
}

export default enhance(MyAppBar)
