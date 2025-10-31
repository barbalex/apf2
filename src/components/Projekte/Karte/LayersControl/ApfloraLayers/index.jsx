import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../../mobxContext.js'
import { Layer } from './Layer/index.jsx'
import { ShowForMultipleAps } from './ShowForMultipleAps.jsx'
import { KtZhFilter } from './KtZhFilter/index.jsx'

import { container } from './index.module.css'

export const ApfloraLayers = observer(() => {
  const store = useContext(MobxContext)
  const { apfloraLayers } = store

  return (
    <div className={container}>
      {apfloraLayers
        // prevent deprecated layer from showing in case some users still have it in layers
        .filter((l) => l.value !== 'mapFilter')
        .map((apfloraLayer, index) => (
          <Layer
            key={index}
            apfloraLayer={apfloraLayer}
          />
        ))}
      <ShowForMultipleAps />
      <KtZhFilter />
    </div>
  )
})
