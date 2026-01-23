import { useAtomValue } from 'jotai'

import { RadioButton } from '../../../../shared/RadioButton.tsx'
import { isPrintAtom } from '../../../../../store/index.ts'

import styles from './Map.module.css'

export const Map = ({ saveToDb, row, errors }) => {
  const isPrint = useAtomValue(isPrintAtom)

  const onSaveFalse = () => {
    const fakeEvent = {
      target: {
        name: 'planVorhanden',
        value: row?.planVorhanden === false ? null : false,
      },
    }
    saveToDb(fakeEvent)
  }

  const onSaveTrue = () => {
    const fakeEvent = {
      target: {
        name: 'planVorhanden',
        value: row?.planVorhanden === true ? null : true,
      },
    }
    saveToDb(fakeEvent)
  }

  // in print nein shall not be set as it is preset in db
  const falseValue = isPrint ? false : row?.planVorhanden === false

  return (
    <div className={styles.container}>
      <div className={styles.label0}>Plan ergänzt</div>
      <div className={styles.label1}>ja</div>
      <div
        className={styles.val1}
        data-id="planVorhanden_true"
      >
        <RadioButton
          key={`${row?.id}planVorhanden`}
          name="planVorhanden"
          value={row?.planVorhanden}
          saveToDb={onSaveTrue}
        />
      </div>
      <div className={styles.label2}>nein</div>
      <div
        className={styles.val2}
        data-id="planVorhanden_false"
      >
        <RadioButton
          key={`${row?.id}planVorhanden2`}
          name="planVorhanden"
          value={falseValue}
          saveToDb={onSaveFalse}
          error={errors?.planVorhanden}
        />
      </div>
    </div>
  )
}
