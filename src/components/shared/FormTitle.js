// @flow
import React, { PropTypes } from 'react'
import styled from 'styled-components'

import TestdataMessage from './TestdataMessage'

const Container = styled.div`
  background-color: #424242;
  padding-bottom: 10px;
`
const Title = styled.div`
  padding: 10px;
  color: #b3b3b3;
  font-weight: bold;
`

const FormTitle = ({ title }:{title:string}) =>
  <Container>
    <Title>
      {title}
    </Title>
    <TestdataMessage />
  </Container>

FormTitle.propTypes = {
  title: PropTypes.string.isRequired,
}

export default FormTitle
