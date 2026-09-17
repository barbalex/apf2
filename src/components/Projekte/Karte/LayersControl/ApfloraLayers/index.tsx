import { useAtomValue } from 'jotai'

import { mapApfloraLayersAtom } from '../../../../../store/index.ts'
import { Layer } from './Layer/index.tsx'
import type { ApfloraLayer } from './Layer/index.tsx'
import { ShowForMultipleAps } from './ShowForMultipleAps.tsx'
import { KtZhFilter } from './KtZhFilter/index.tsx'

import styles from './index.module.css'

interface ApfloraLayersProps {
  /**
   * overlaysString enforces rererender
   * even when only the sorting changes
   */
  apfloraLayersString: string
}

export const ApfloraLayers = (_props: ApfloraLayersProps) => {
  const apfloraLayers = useAtomValue(mapApfloraLayersAtom)

  return (
    <div className={styles.container}>
      {apfloraLayers
        // prevent deprecated layer from showing in case some users still have it in layers
        .filter((l) => l.value !== 'mapFilter')
        .map((apfloraLayer, index) => (
          <Layer
            key={index}
            apfloraLayer={apfloraLayer as ApfloraLayer}
          />
        ))}
      <ShowForMultipleAps />
      <KtZhFilter />
    </div>
  )
}
