import styles from './Control.module.css'

// Classes used by Leaflet to position controls
const POSITION_CLASSES = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
}

interface ControlProps {
  children?: React.ReactNode
  position?: keyof typeof POSITION_CLASSES
  visible?: boolean
}

export const Control = ({
  children,
  position,
  visible = true,
}: ControlProps) => {
  const positionClass =
    (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright

  return (
    <div
      className="leaflet-control-container first"
      style={{ visibility: visible ? 'visible' : 'hidden' }}
    >
      <div className={positionClass}>
        {/*
         * no leaflet-bar: its css styles every [role="button"] descendant
         * like a zoom button (30px wide) — which wrecks the dnd-kit layer
         * rows (they carry role="button" via their drag attributes)
         */}
        <div className={`leaflet-control ${styles.innerDiv}`}>
          {children}
        </div>
      </div>
    </div>
  )
}
