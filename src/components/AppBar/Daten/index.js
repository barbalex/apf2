// @flow
import React from 'react'
import Button from '@material-ui/core/Button'
import FilterIcon from '@material-ui/icons/FilterList'
import remove from 'lodash/remove'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import get from 'lodash/get'
import clone from 'lodash/clone'

import isMobilePhone from '../../../modules/isMobilePhone'
import setUrlQueryValue from '../../../modules/setUrlQueryValue'

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

const enhance = compose(
  withState('anchorEl', 'setAnchorEl', null),
  withState('ekfYearState', 'setEkfYearState', null),
  withHandlers({
    onClickButton: ({ data }) => () => {
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
  }),
)

const MyAppBar = ({
  onClickButton,
  anchorEl,
  setAnchorEl,
  data,
}: {
  onClickButton: () => void,
  anchorEl: Object,
  setAnchorEl: () => void,
  data: Object,
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
  )
}

export default enhance(MyAppBar)
