import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import storeContext from '../../../../../storeContext' 
import Layer from './Layer'

const CardContent = styled.div`
  color: rgb(48, 48, 48);
  padding-left: 5px;
  padding-right: 4px;
  padding-bottom: 3px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
`

const ApfloraLayers = ({ treeName }) => {
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
