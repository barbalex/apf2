import { useAtomValue, useSetAtom } from 'jotai'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

import {
  ekPlanFilterStatusAtom,
  ekPlanSetFilterStatusAtom,
  ekPlanFilterPopStatusAtom,
  ekPlanSetFilterPopStatusAtom,
} from '../../../../store/index.ts'

export const Option = ({
  option,
  type = 'tpop',
}: {
  option: { code: number | null; text: string | null }
  type?: string
}) => {
  const filterStatusAtom =
    type === 'tpop' ? ekPlanFilterStatusAtom : ekPlanFilterPopStatusAtom
  const setFilterStatusAtom =
    type === 'tpop' ? ekPlanSetFilterStatusAtom : ekPlanSetFilterPopStatusAtom

  const filterStatus = useAtomValue(filterStatusAtom)
  const setFilterStatus = useSetAtom(setFilterStatusAtom)
  const checked = option.code !== null && filterStatus.includes(option.code)

  const onChange = () => {
    const newStatus =
      option.code !== null && filterStatus.includes(option.code) ?
        filterStatus.filter((el: number) => el !== option.code)
      : option.code !== null ? [...new Set([...filterStatus, option.code])] : filterStatus

    setFilterStatus(newStatus)
  }

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
        />
      }
      label={option.text}
    />
  )
}
