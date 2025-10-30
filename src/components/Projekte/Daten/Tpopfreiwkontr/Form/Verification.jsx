import { RadioButton } from '../../../../shared/RadioButton.jsx'
import { TextField2 } from '../../../../shared/TextField2.jsx'

import { container, relevant, grund } from './Verification.module.css'

export const Verification = ({ saveToDb, row, errors }) => {
  const onSaveTrue = () => {
    const fakeEvent = {
      target: {
        name: 'apberNichtRelevant',
        value: row?.apberNichtRelevant === true ? null : true,
      },
    }
    saveToDb(fakeEvent)
  }

  return (
    <div className={container}>
      <div className={relevant}>
        <RadioButton
          key={`${row?.id}apberNichtRelevant`}
          name="apberNichtRelevant"
          label="Im Jahresbericht nicht berücksichtigen"
          value={row?.apberNichtRelevant}
          saveToDb={onSaveTrue}
          error={errors?.apberNichtRelevant}
        />
      </div>
      <div className={grund}>
        <TextField2
          key={`${row?.id}apberNichtRelevantGrund`}
          name="apberNichtRelevantGrund"
          label="Wieso nicht?"
          row={row}
          type="text"
          multiLine
          saveToDb={saveToDb}
          errors={errors}
        />
      </div>
    </div>
  )
}
