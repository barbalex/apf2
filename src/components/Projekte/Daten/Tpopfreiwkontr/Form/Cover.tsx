import { TextField2 } from '../../../../shared/TextField2.tsx'
import anteilImg from './anteil.png'

import styles from './Cover.module.css'

export const Cover = ({ saveToDb, row, errors }) => (
  <div className={styles.container}>
    <div className={styles.deckApArtLabel}>Deckung überprüfte Art</div>
    <div className={styles.deckApArtVal}>
      <TextField2
        key={`${row.id}deckungApArt`}
        name="deckungApArt"
        row={row}
        type="number"
        saveToDb={saveToDb}
        errors={errors}
      />
    </div>
    <div className={styles.deckApArtMass}>%</div>
    <div className={styles.deckNaBoLabel}>Flächenanteil nackter Boden</div>
    <div className={styles.deckNaBoVal}>
      <TextField2
        key={`${row.id}deckungNackterBoden`}
        name="deckungNackterBoden"
        row={row}
        type="number"
        saveToDb={saveToDb}
        errors={errors}
      />
    </div>
    <div className={styles.deckNaBoMass}>%</div>
    <div className={styles.deckImage}>
      <img
        className={styles.img}
        src={anteilImg}
        alt="Flächen-Anteile"
      />
    </div>
  </div>
)
