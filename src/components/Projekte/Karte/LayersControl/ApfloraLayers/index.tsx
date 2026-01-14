import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../../mobxContext.ts'
import { Layer } from './Layer/index.tsx'
import { ShowForMultipleAps } from './ShowForMultipleAps.tsx'
import { KtZhFilter } from './KtZhFilter/index.tsx'

import styles from './index.module.css'

export const ApfloraLayers = observer(() => {
  const store = useContext(MobxContext)
  const { apfloraLayers } = store

  return (
    <div className={styles.container}>
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
