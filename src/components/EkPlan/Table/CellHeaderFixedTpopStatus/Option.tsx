import { useAtomValue, useSetAtom } from 'jotai'
import MenuItem from '@mui/material/MenuItem'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

import {
  ekPlanFilterStatusAtom,
  ekPlanSetFilterStatusAtom,
  ekPlanFilterPopStatusAtom,
  ekPlanSetFilterPopStatusAtom,
} from '../../../../store/index.ts'

export const Option = ({ option, type = 'tpop' }) => {
  const filterStatusAtom =
    type === 'tpop' ? ekPlanFilterStatusAtom : ekPlanFilterPopStatusAtom
  const setFilterStatusAtom =
    type === 'tpop' ? ekPlanSetFilterStatusAtom : ekPlanSetFilterPopStatusAtom

  const filterStatus = useAtomValue(filterStatusAtom)
  const setFilterStatus = useSetAtom(setFilterStatusAtom)
  const checked = filterStatus.includes(option.code)

  const onChange = () => {
    const newStatus =
      filterStatus.includes(option.code) ?
        filterStatus.filter((el) => el !== option.code)
      : [...new Set([...filterStatus, option.code])]

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
