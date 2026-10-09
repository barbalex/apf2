import { RadioButton } from '../../../../shared/RadioButton.tsx'
import { TextField2 } from '../../../../shared/TextField2.tsx'
import type { TpopkontrRow, TpopkontrSaveToDb } from './index.tsx'

import styles from './Verification.module.css'

interface VerificationProps {
  saveToDb: TpopkontrSaveToDb
  row: Partial<TpopkontrRow>
  errors: Record<string, string>
}

export const Verification = ({ saveToDb, row, errors }: VerificationProps) => {
  const onSaveTrue = () => {
    const fakeEvent = {
      target: {
        name: 'apberNichtRelevant',
        value: row?.apberNichtRelevant === true ? null : true,
      },
    }
    void saveToDb(fakeEvent)
  }

  return (
    <div className={styles.container}>
      <div className={styles.relevant}>
        <RadioButton
          key={`${row?.id}apberNichtRelevant`}
          name="apberNichtRelevant"
          label="Im Jahresbericht nicht berücksichtigen"
          value={row?.apberNichtRelevant}
          saveToDb={onSaveTrue}
          error={errors?.apberNichtRelevant}
        />
      </div>
      <div className={styles.grund}>
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
