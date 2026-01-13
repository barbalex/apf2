import { TextField2 } from '../../../../shared/TextField2.jsx'
import { RadioButton } from '../../../../shared/RadioButton.jsx'
import veghoeheImg from './veghoehe.png'

import styles from './More.module.css'

export const More = ({ saveToDb, row, errors }) => {
  const jungpflanzenVorhandenOnSaveFalse = () => {
    const fakeEvent = {
      target: {
        name: 'jungpflanzenVorhanden',
        value: row?.jungpflanzenVorhanden === false ? null : false,
      },
    }
    saveToDb(fakeEvent)
  }

  const jungpflanzenVorhandenOnSaveTrue = () => {
    const fakeEvent = {
      target: {
        name: 'jungpflanzenVorhanden',
        value: row?.jungpflanzenVorhanden === true ? null : true,
      },
    }
    saveToDb(fakeEvent)
  }

  return (
    <div className={styles.container}>
      <div className={styles.flLabel}>Überprüfte Fläche</div>
      <div className={styles.flVal}>
        <TextField2
          key={`${row?.id}flaecheUeberprueft`}
          name="flaecheUeberprueft"
          row={row}
          type="number"
          saveToDb={saveToDb}
          errors={errors}
        />
      </div>
      <div className={styles.flMeasure}>
        m<sup>2</sup>
      </div>
      <div className={styles.jungPflLabel0}>
        Werden junge neben alten Pflanzen beobachtet?
      </div>
      <div className={styles.jungPflLabel1}>ja</div>
      <div
        className={styles.jungPflVal1}
        data-id="jungpflanzenVorhanden_true"
      >
        <RadioButton
          key={`${row?.id}${row?.jungpflanzenVorhanden}jungpflanzenVorhanden1`}
          name="jungpflanzenVorhanden"
          value={row?.jungpflanzenVorhanden}
          saveToDb={jungpflanzenVorhandenOnSaveTrue}
        />
      </div>
      <div className={styles.jungPflLabel2}>nein</div>
      <div
        className={styles.jungPflVal2}
        data-id="jungpflanzenVorhanden_false"
      >
        <RadioButton
          key={`${row?.id}jungpflanzenVorhanden2`}
          name="jungpflanzenVorhandenNein"
          value={row?.jungpflanzenVorhanden === false}
          saveToDb={jungpflanzenVorhandenOnSaveFalse}
          error={errors?.jungpflanzenVorhanden}
        />
      </div>
      <div className={styles.veghoeheLabel0}>Vegetationshöhe</div>
      <div className={styles.veghoeheImg}>
        <img
          className={styles.img}
          src={veghoeheImg}
          alt="Flächen-Anteile"
        />
      </div>
      <div className={styles.veghoeheMaxLabel}>Maximum (cm)</div>
      <div className={styles.veghoeheMaxVal}>
        <TextField2
          key={`${row?.id}vegetationshoeheMaximum`}
          name="vegetationshoeheMaximum"
          row={row}
          type="number"
          saveToDb={saveToDb}
          errors={errors}
        />
      </div>
      <div className={styles.veghoeheMittLabel}>Mittel (cm)</div>
      <div className={styles.veghoeheMittVal}>
        <TextField2
          key={`${row?.id}vegetationshoeheMittel`}
          name="vegetationshoeheMittel"
          row={row}
          type="number"
          saveToDb={saveToDb}
          errors={errors}
        />
      </div>
      <div className={styles.veghoeheMinLabel}>(Minimum)</div>
    </div>
  )
}
