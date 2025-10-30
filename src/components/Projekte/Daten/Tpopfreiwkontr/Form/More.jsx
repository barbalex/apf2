import { TextField2 } from '../../../../shared/TextField2.jsx'
import { RadioButton } from '../../../../shared/RadioButton.jsx'
import veghoeheImg from './veghoehe.png'

import {
  container,
  flLabel,
  flVal,
  flMeasure,
  jungPflLabel0,
  jungPflLabel1,
  jungPflVal1,
  jungPflLabel2,
  jungPflVal2,
  veghoeheLabel0,
  veghoeheMaxLabel,
  veghoeheMaxVal,
  veghoeheMittLabel,
  veghoeheMittVal,
  veghoeheMinLabel,
  veghoeheImg as veghoeheImgClass,
  img,
} from './More.module.css'

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
    <div className={container}>
      <div className={flLabel}>Überprüfte Fläche</div>
      <div className={flVal}>
        <TextField2
          key={`${row?.id}flaecheUeberprueft`}
          name="flaecheUeberprueft"
          row={row}
          type="number"
          saveToDb={saveToDb}
          errors={errors}
        />
      </div>
      <div className={flMeasure}>
        m<sup>2</sup>
      </div>
      <div className={jungPflLabel0}>
        Werden junge neben alten Pflanzen beobachtet?
      </div>
      <div className={jungPflLabel1}>ja</div>
      <div
        className={jungPflVal1}
        data-id="jungpflanzenVorhanden_true"
      >
        <RadioButton
          key={`${row?.id}${row?.jungpflanzenVorhanden}jungpflanzenVorhanden1`}
          name="jungpflanzenVorhanden"
          value={row?.jungpflanzenVorhanden}
          saveToDb={jungpflanzenVorhandenOnSaveTrue}
        />
      </div>
      <div className={jungPflLabel2}>nein</div>
      <div
        className={jungPflVal2}
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
      <div className={veghoeheLabel0}>Vegetationshöhe</div>
      <div className={veghoeheImgClass}>
        <img
          className={img}
          src={veghoeheImg}
          alt="Flächen-Anteile"
        />
      </div>
      <div className={veghoeheMaxLabel}>Maximum (cm)</div>
      <div className={veghoeheMaxVal}>
        <TextField2
          key={`${row?.id}vegetationshoeheMaximum`}
          name="vegetationshoeheMaximum"
          row={row}
          type="number"
          saveToDb={saveToDb}
          errors={errors}
        />
      </div>
      <div className={veghoeheMittLabel}>Mittel (cm)</div>
      <div className={veghoeheMittVal}>
        <TextField2
          key={`${row?.id}vegetationshoeheMittel`}
          name="vegetationshoeheMittel"
          row={row}
          type="number"
          saveToDb={saveToDb}
          errors={errors}
        />
      </div>
      <div className={veghoeheMinLabel}>(Minimum)</div>
    </div>
  )
}
