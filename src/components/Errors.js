// @flow
import React, { PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'

const Container = styled.div`
  position: absolute;
  left: 5px;
  bottom: 5px;
  display: flex;
  flex-direction: column;
  max-width: 300px;
`
const ErrorDiv = styled.div`
  padding: 10px 10px;
  margin: 5px;
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: #424242;
  max-width: 300px;
  font-size: 14px;
`

const enhance = compose(
  inject(`store`),
  observer
)

const Errors = ({ store }) =>
  <Container>
    {
      store.app.errors.map((error, index) =>
        <ErrorDiv
          key={index}
        >
          {error.message}
        </ErrorDiv>
      )
    }
  </Container>

Errors.propTypes = {
  store: PropTypes.object.isRequired,
}

export default enhance(Errors)
