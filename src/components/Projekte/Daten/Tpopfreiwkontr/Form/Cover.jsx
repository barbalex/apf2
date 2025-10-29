import { TextField2 } from '../../../../shared/TextField2.jsx'
import anteilImg from './anteil.png'

import {
  container,
  deckApArtLabel,
  deckApArtVal,
  deckApArtMass,
  deckNaBoLabel,
  deckNaBoVal,
  deckNaBoMass,
  deckImage,
  img,
} from './Cover.module.css'

export const Cover = ({ saveToDb, row, errors }) => (
  <div className={container}>
    <div className={deckApArtLabel}>Deckung überprüfte Art</div>
    <div className={deckApArtVal}>
      <TextField2
        key={`${row.id}deckungApArt`}
        name="deckungApArt"
        row={row}
        type="number"
        saveToDb={saveToDb}
        errors={errors}
      />
    </div>
    <div className={deckApArtMass}>%</div>
    <div className={deckNaBoLabel}>Flächenanteil nackter Boden</div>
    <div className={deckNaBoVal}>
      <TextField2
        key={`${row.id}deckungNackterBoden`}
        name="deckungNackterBoden"
        row={row}
        type="number"
        saveToDb={saveToDb}
        errors={errors}
      />
    </div>
    <div className={deckNaBoMass}>%</div>
    <div className={deckImage}>
      <img
        className={img}
        src={anteilImg}
        alt="Flächen-Anteile"
      />
    </div>
  </div>
)
