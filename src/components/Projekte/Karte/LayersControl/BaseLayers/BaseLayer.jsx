import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Radio } from '../shared/Radio.jsx'
import { MobxContext } from '../../../../../mobxContext.js'

import styles from './BaseLayer.module.css'

export const BaseLayer = observer(({ layer }) => {
  const store = useContext(MobxContext)
  const { activeBaseLayer, setActiveBaseLayer } = store
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
})
