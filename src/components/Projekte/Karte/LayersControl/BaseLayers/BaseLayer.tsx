import { useAtomValue, useSetAtom } from 'jotai'
import type { MouseEvent } from 'react'

import { Radio } from '../shared/Radio.tsx'
import {
  mapActiveBaseLayerAtom,
  setMapActiveBaseLayerAtom,
} from '../../../../../store/index.ts'

import type { BaseLayerItem } from './index.tsx'

import styles from './BaseLayer.module.css'

interface BaseLayerProps {
  layer: BaseLayerItem
}

export const BaseLayer = ({ layer }: BaseLayerProps) => {
  const activeBaseLayer = useAtomValue(mapActiveBaseLayerAtom)
  const setActiveBaseLayer = useSetAtom(setMapActiveBaseLayerAtom)
  const onChange = () => setActiveBaseLayer(layer.value)
  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    if (layer.value === activeBaseLayer) {
      // null is passed to deselect the base layer
      // even though the store atom is typed as string
      setActiveBaseLayer(null as never)
      // prevent click bubbling to Radio
      // then triggering change...
      event.preventDefault()
    }
  }

  return (
    <div
      className={styles.layer}
      onClick={onClick}
    >
      <Radio
        name="baseLayers"
        value={layer.value}
        label={layer.label}
        checked={activeBaseLayer === layer.value}
        onChange={onChange}
      />
    </div>
  )
}
