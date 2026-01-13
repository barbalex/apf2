import styles from './Control.module.css'

// Classes used by Leaflet to position controls
const POSITION_CLASSES = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
}

export const Control = ({ children, position, visible = true }) => {
  const positionClass =
    (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright

  return (
    <div
      className="leaflet-control-container first"
      style={{ visibility: visible ? 'visible' : 'hidden' }}
    >
      <div className={positionClass}>
        <div className={`leaflet-control leaflet-bar ${styles.innerDiv}`}>
          {children}
        </div>
      </div>
    </div>
  )
}
