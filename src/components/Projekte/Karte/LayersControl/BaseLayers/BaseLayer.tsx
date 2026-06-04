import { useAtomValue, useSetAtom } from 'jotai'

import { Radio } from '../shared/Radio.tsx'
import {
  mapActiveBaseLayerAtom,
  setMapActiveBaseLayerAtom,
} from '../../../../../store/index.ts'

import styles from './BaseLayer.module.css'

export const BaseLayer = ({ layer }) => {
  const activeBaseLayer = useAtomValue(mapActiveBaseLayerAtom)
  const setActiveBaseLayer = useSetAtom(setMapActiveBaseLayerAtom)
  const onChange = () => setActiveBaseLayer(layer.value)
  const onClick = (event) => {
    if (layer.value === activeBaseLayer) {
      setActiveBaseLayer(null)
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
