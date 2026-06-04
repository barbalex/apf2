import { useAtomValue } from 'jotai'

import { mapApfloraLayersAtom } from '../../../../../store/index.ts'
import { Layer } from './Layer/index.tsx'
import { ShowForMultipleAps } from './ShowForMultipleAps.tsx'
import { KtZhFilter } from './KtZhFilter/index.tsx'

import styles from './index.module.css'

export const ApfloraLayers = () => {
  const apfloraLayers = useAtomValue(mapApfloraLayersAtom)

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
}
