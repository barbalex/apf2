import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import styled from '@emotion/styled'

import storeContext from '../../../../../storeContext.js'
import Layer from './Layer/index.jsx'
import ShowForMultipleAps from './ShowForMultipleAps.jsx'
import KtZhFilter from './KtZhFilter/index.jsx'

const CardContent = styled.div`
  color: rgb(48, 48, 48);
  padding-left: 5px;
  padding-right: 4px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
`

const ApfloraLayers = () => {
  const store = useContext(storeContext)
  const { apfloraLayers } = store

  return (
    <CardContent>
      {apfloraLayers
        // prevent deprecated layer from showing in case some users still have it in layers
        .filter((l) => l.value !== 'mapFilter')
        .map((apfloraLayer, index) => (
          <Layer key={index} apfloraLayer={apfloraLayer} />
        ))}
      <ShowForMultipleAps />
      <KtZhFilter />
    </CardContent>
  )
}

export default observer(ApfloraLayers)
