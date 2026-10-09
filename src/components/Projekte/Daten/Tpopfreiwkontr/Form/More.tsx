import { TextField2 } from '../../../../shared/TextField2.tsx'
import { RadioButton } from '../../../../shared/RadioButton.tsx'
import type { TpopkontrRow, TpopkontrSaveToDb } from './index.tsx'
import veghoeheImg from './veghoehe.png'

import styles from './More.module.css'

interface MoreProps {
  saveToDb: TpopkontrSaveToDb
  row: Partial<TpopkontrRow>
  errors: Record<string, string>
}

export const More = ({ saveToDb, row, errors }: MoreProps) => {
  const jungpflanzenVorhandenOnSaveFalse = () => {
    const fakeEvent = {
      target: {
        name: 'jungpflanzenVorhanden',
        value: row?.jungpflanzenVorhanden === false ? null : false,
      },
    }
    void saveToDb(fakeEvent)
  }

  const jungpflanzenVorhandenOnSaveTrue = () => {
    const fakeEvent = {
      target: {
        name: 'jungpflanzenVorhanden',
        value: row?.jungpflanzenVorhanden === true ? null : true,
      },
    }
    void saveToDb(fakeEvent)
  }

  return (
    <div className={styles.container}>
      <div className={styles.flLabel}>Überprüfte Fläche</div>
      <div className={styles.flVal}>
        <TextField2
          key={`${row?.id}flaecheUeberprueft`}
          name="flaecheUeberprueft"
          label={undefined}
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
          label={undefined}
          value={row?.jungpflanzenVorhanden}
          saveToDb={jungpflanzenVorhandenOnSaveTrue}
          error={undefined}
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
          label={undefined}
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
          label={undefined}
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
          label={undefined}
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
