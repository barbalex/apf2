import {
  title,
  content,
  columnLeft,
  columnRight,
} from './TpopfeldkontrentwicklungPopover.module.css'

export const TpopfeldkontrentwicklungPopover = (
  <>
    <div className={title}>Legende</div>
    <div className={content}>
      Im 1. Jahr der Beobachtung die Entwicklung an der Massnahme beurteilen,
      nachher an vorhergehenden EK.
    </div>
    <div className={content}>
      <div className={columnLeft}>{'zunehmend:'}</div>
      <div className={columnRight}>{'> 10% Zunahme'}</div>
    </div>
    <div className={content}>
      <div className={columnLeft}>stabil:</div>
      <div className={columnRight}>{'± 10%'}</div>
    </div>
    <div className={content}>
      <div className={columnLeft}>abnehmend:</div>
      <div className={columnRight}>{'> 10% Abnahme'}</div>
    </div>
    <div className={content}>
      <div className={columnLeft}>erloschen / nicht etabliert:</div>
      <div className={columnRight}>
        {
          'nach 2 aufeinander folgenden Kontrollen ohne Funde oder nach Einschätzung Art-VerantwortlicheR'
        }
      </div>
    </div>
    <div className={content}>
      <div className={columnLeft}>unsicher:</div>
      <div className={columnRight}>
        {
          'keine Funde aber noch nicht erloschen (nach zwei Kontrollen ohne Funde kann Status erloschen/nicht etabliert gewählt werden)'
        }
      </div>
    </div>
  </>
)
