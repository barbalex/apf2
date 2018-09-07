// @flow
import React, { Fragment } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import FilterIcon from '@material-ui/icons/FilterList'
import remove from 'lodash/remove'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import clone from 'lodash/clone'
import gql from 'graphql-tag'
import app from 'ampersand-app'
import jwtDecode from 'jwt-decode'

import isMobilePhone from '../../modules/isMobilePhone'
import ErrorBoundary from '../shared/ErrorBoundary'
import dataGql from './data.graphql'
import setUrlQueryValue from '../../modules/setUrlQueryValue'
import setEkfYear from './setEkfYear.graphql'
import getActiveNodes from '../../modules/getActiveNodes'
import More from './More'
import setView from './setView.graphql'
import EkfYear from './EkfYear'
import User from './User'

const StyledAppBar = styled(AppBar)`
  @media print {
    display: none !important;
  }
`
const StyledToolbar = styled(Toolbar)`
  justify-content: space-between;
`
const StyledIconButton = styled.div`
  height: 30px !important;
  width: 30px !important;
  margin-right: -5px !important;
  margin-left: 8px !important;
  margin-bottom: 3px !important;
  border-radius: 4px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`
const StyledFilterIcon = styled(FilterIcon)`
  cursor: pointer;
  pointer-events: auto;
  padding-top: 5px;
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
const NormalViewButton = styled(Button)`
  color: white !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
`
const MenuDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const enhance = compose(
  withState('anchorEl', 'setAnchorEl', null),
  withState('ekfYearState', 'setEkfYearState', null),
  withState('userOpen', 'setUserOpen', false),
  withHandlers({
    onClickButton: () => (name, client, projekteTabs) => {
      if (isMobilePhone()) {
        // show one tab only
        setUrlQueryValue({ key: 'projekteTabs', value: [name] })
      } else {
        if (projekteTabs.includes(name)) {
          remove(projekteTabs, el => el === name)
        } else {
          projekteTabs.push(name)
          if (name === 'tree2') {
            client.mutate({
              mutation: gql`
                mutation cloneTree2From1 {
                  cloneTree2From1 @client
                }
              `,
            })
          }
        }
        setUrlQueryValue({ key: 'projekteTabs', value: projekteTabs })
      }
    },
    setViewNormal: () => () => {
      app.client.mutate({
        mutation: setView,
        variables: { value: 'normal' },
      })
    },
    setViewEkf: () => () => {
      app.client.mutate({
        mutation: setView,
        variables: { value: 'ekf' },
      })
    },
    setEkfYear: () => value => {
      const ekfRefDate = new Date().setMonth(new Date().getMonth() - 2)
      const ekfRefYear = new Date(ekfRefDate).getFullYear()
      app.client.mutate({
        mutation: setEkfYear,
        variables: { value: value ? +value : ekfRefYear },
      })
    },
    toggleUserOpen: ({ userOpen, setUserOpen }) => () => setUserOpen(!userOpen),
  }),
)

const MyAppBar = ({
  onClickButton,
  anchorEl,
  setAnchorEl,
  setShowDeletions,
  setViewNormal,
  setViewEkf,
  setEkfYear,
  userOpen,
  toggleUserOpen,
}: {
  onClickButton: () => void,
  anchorEl: Object,
  setAnchorEl: () => void,
  setShowDeletions: () => void,
  setViewNormal: () => void,
  setViewEkf: () => void,
  setEkfYear: () => void,
  userOpen: boolean,
  toggleUserOpen: () => void,
}) => (
  <Query query={dataGql}>
    {({ loading, error, data, client }) => {
      if (error) return `Fehler: ${error.message}`
      /**
       * need to clone projekteTabs
       * because otherwise removing elements errors out (because elements are sealed)
       */
      const projekteTabs = clone(get(data, 'urlQuery.projekteTabs', []))

      return (
        <ErrorBoundary>
          <StyledButton
            variant={projekteTabs.includes('daten') ? 'outlined' : 'text'}
            preceded={projekteTabs.includes('tree')}
            followed={projekteTabs.includes('karte')}
            onClick={() => onClickButton('daten', client, projekteTabs)}
          >
            Daten
            {projekteTabs.includes('daten') && (
              <StyledIconButton
                aria-label="Daten filtern"
                title="Daten filtern (BAUSTELLE)"
              >
                <StyledFilterIcon
                  onClick={e => {
                    console.log('TODO')
                    e.stopPropagation()
                  }}
                />
              </StyledIconButton>
            )}
          </StyledButton>
        </ErrorBoundary>
      )
    }}
  </Query>
)

export default enhance(MyAppBar)
