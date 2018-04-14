import React from 'react'
import { inject } from 'mobx-react'
import styled from 'styled-components'

const Div = styled.div`
  color: #c8e6c9;
  padding: 10px 10px 0 10px;
`

const TestdataMessage = ({ store, tree }: { store: Object, tree: Object }) => {
  const { activeNodes } = tree
  const isTestSpecies = activeNodes.ap && activeNodes.ap < 200
  if (isTestSpecies) {
    return (
      <Div>Das ist eine Test-Aktionsplan. Sie können alles ausprobieren!</Div>
    )
  }
  return null
}

export default inject('store')(TestdataMessage)
