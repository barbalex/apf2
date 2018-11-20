// @flow
import React from 'react'
import Input from '@material-ui/core/Input'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import withLifecycle from '@hocs/with-lifecycle'
import styled from 'styled-components'
import { withApollo } from 'react-apollo'

import initiateDataFromUrl from '../../modules/initiateDataFromUrl'

const StyledInput = styled(Input)`
  width: 60px;
  color: white !important;
  padding-left: 5px;
  > input {
    padding-top: 9px;
  }
  &:before {
    border: none !important;
  }
`
const Container = styled.div`
  display: flex;
  padding-left: 20px;
`
const Jahr = styled.p`
  margin-top: auto;
  margin-bottom: auto;
`

const enhance = compose(
  withApollo,
  withState('stateValue', 'setStateValue', ({ value }) =>
    value || value === 0 ? value : '',
  ),
  withHandlers({
    onChange: ({ setStateValue }) => event => setStateValue(event.target.value),
    onBlur: ({ setEkfYear, value, stateValue, client }) => event => {
      setEkfYear(event.target.value || null)
      if (value !== stateValue)
        initiateDataFromUrl({ activeNodeArray: ['Projekte'], client })
    },
  }),
  withLifecycle({
    onDidUpdate(prevProps, props) {
      if (props.value !== prevProps.value) {
        const value = props.value || props.value === 0 ? props.value : ''
        props.setStateValue(value)
      }
    },
  }),
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
  <Container>
    <Jahr>Jahr:</Jahr>
    <StyledInput
      value={stateValue}
      type="number"
      onChange={onChange}
      onBlur={onBlur}
      placeholder="Jahr"
    />
  </Container>
)

export default enhance(EkfYear)
