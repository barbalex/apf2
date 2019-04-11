import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import storeContext from '../../../../../storeContext'
import Layer from './Layer'

const CardContent = styled.div`
  color: rgb(48, 48, 48);
  padding-left: 5px;
  padding-right: 4px;
`

const ApfloraLayers = ({
  treeName,
  popBounds,
  setPopBounds,
  tpopBounds,
  setTpopBounds,
}) => {
  const store = useContext(storeContext)
  const { apfloraLayers } = store

  return (
    <CardContent>
      {apfloraLayers.map((apfloraLayer, index) => (
        <Layer key={index} apfloraLayer={apfloraLayer} treeName={treeName} />
      ))}
    </CardContent>
  )
}

export default observer(ApfloraLayers)
