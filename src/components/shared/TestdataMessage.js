import React, { PropTypes } from 'react'
import { inject } from 'mobx-react'
import styled from 'styled-components'

const Div = styled.div`
  color: green;
  padding: 0 10px 0 10px;
`

const TestdataMessage = ({ store }) => {
  const { activeUrlElements } = store
  const isTestSpecies = (
    activeUrlElements.ap &&
    activeUrlElements.ap < 200
  )
  if (isTestSpecies) {
    return (
      <Div>
        Das ist eine Testart - Sie können alles ausprobieren!
      </Div>
    )
  }
  return null
}

TestdataMessage.propTypes = {
  store: PropTypes.object.isRequired,
}

export default inject(`store`)(TestdataMessage)
