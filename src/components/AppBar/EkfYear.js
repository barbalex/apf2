// @flow
import React from 'react'
import Input from '@material-ui/core/Input'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import withLifecycle from '@hocs/with-lifecycle'
import styled from 'styled-components'

const StyledInput = styled(Input)`
  width: 60px;
  color: white !important;
  padding-left: 20px;
  &:before {
    border-color: white !important;
  }
`

const enhance = compose(
  withState(
    'stateValue',
    'setStateValue',
    ({ value }) => (value || value === 0 ? value : '')
  ),
  withHandlers({
    onChange: ({ setStateValue }) => event => setStateValue(event.target.value),
    onBlur: ({ setEkfYear }) => event => setEkfYear(event.target.value || null),
  }),
  withLifecycle({
    onDidUpdate(prevProps, props) {
      if (props.value !== prevProps.value) {
        const value = props.value || props.value === 0 ? props.value : ''
        props.setStateValue(value)
      }
    },
  })
)

const EkfYear = ({
  stateValue,
  setEkfYear,
  onChange,
  onBlur,
}: {
  stateValue: Number | String,
  setEkfYear: () => void,
  onChange: () => void,
  onBlur: () => void,
}) => (
  <StyledInput
    value={stateValue}
    type="number"
    onChange={onChange}
    onBlur={onBlur}
    placeholder="Jahr"
  />
)

export default enhance(EkfYear)
