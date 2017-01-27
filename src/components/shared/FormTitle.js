import React, { PropTypes } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  background-color: #424242;
`
const Title = styled.div`
  padding: 10px;
  color: #b3b3b3;
  font-weight: bold;
`

const FormTitle = ({ title }) =>
  <Container>
    <Title>
      {title}
    </Title>
  </Container>

FormTitle.propTypes = {
  title: PropTypes.string.isRequired,
}

export default FormTitle
