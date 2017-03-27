// @flow
import React, { PropTypes } from 'react'
import styled from 'styled-components'

import TestdataMessage from './TestdataMessage'

const Container = styled.div`
  background-color: #424242;
  padding-bottom: 10px;
`
const Title = styled.div`
  padding: 10px 10px 0 10px;
  color: #b3b3b3;
  font-weight: bold;
`

const FormTitle = (
  { title, noTestdataMessage }:
  {title:string,noTestdataMessage?:boolean}
) =>
  <Container>
    <Title>
      {title}
    </Title>
    {
      !noTestdataMessage &&
      <TestdataMessage />
    }
  </Container>

FormTitle.propTypes = {
  title: PropTypes.string.isRequired,
  noTestdataMessage: PropTypes.bool,
}

FormTitle.defaultProps = {
  noTestdataMessage: false,
}

export default FormTitle
