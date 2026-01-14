import { RadioButtonGroup } from './RadioButtonGroup.tsx'
import { InfoWithPopover } from './InfoWithPopover.tsx'

import styles from './RadioButtonGroupWithInfo.module.css'

export const RadioButtonGroupWithInfo = ({
  label,
  name,
  value = '',
  error,
  dataSource,
  saveToDb,
  popover,
}) => (
  <div className={styles.container}>
    <RadioButtonGroup
      value={value}
      name={name}
      dataSource={dataSource}
      saveToDb={saveToDb}
      label={label}
      error={error}
    />
    <InfoWithPopover name={name}>{popover}</InfoWithPopover>
  </div>
)
