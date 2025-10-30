import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { RadioButton } from '../../../../shared/RadioButton.jsx'
import { MobxContext } from '../../../../../mobxContext.js'

import { container, label0, label1, label2, val1, val2 } from './Map.module.css'

export const Map = observer(({ saveToDb, row, errors }) => {
  const store = useContext(MobxContext)
  const { isPrint } = store

  const onSaveFalse = () => {
    const fakeEvent = {
      target: { name: 'planVorhanden', value: false },
    }
    saveToDb(fakeEvent)
  }

  // in print nein shall not be set as it is preset in db
  const falseValue = isPrint ? false : row?.planVorhanden === false

  return (
    <div className={container}>
      <div className={label0}>Plan ergänzt</div>
      <div className={label1}>ja</div>
      <div
        className={val1}
        data-id="planVorhanden_true"
      >
        <RadioButton
          key={`${row?.id}planVorhanden`}
          name="planVorhanden"
          value={row?.planVorhanden}
          saveToDb={saveToDb}
        />
      </div>
      <div className={label2}>nein</div>
      <div
        className={val2}
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
})
