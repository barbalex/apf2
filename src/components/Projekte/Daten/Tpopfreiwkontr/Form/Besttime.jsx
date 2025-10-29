import { container, label, val } from './Besttime.module.css'

export const Besttime = ({ row }) => (
  <div className={container}>
    <div className={label}>Bester Beobachtungs-Zeitpunkt</div>
    <div className={val}>
      {row?.tpopByTpopId?.popByPopId?.apByApId?.ekfBeobachtungszeitpunkt ?? ''}
    </div>
  </div>
)
