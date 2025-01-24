import { memo, useContext, useCallback } from 'react'
import MenuItem from '@mui/material/MenuItem'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { getSnapshot } from 'mobx-state-tree'

import { MobxContext } from '../../../../mobxContext.js'
import { filter } from 'lodash'

export const Option = memo(({ option }) => {
  const store = useContext(MobxContext)
  const { filterStatus: filterStatusIn, setFilterStatus } = store.ekPlan
  const filterStatus = filterStatusIn ? getSnapshot(filterStatusIn) : []

  console.log('Option', { option, filterStatus })

  const onChange = useCallback(() => {
    if (filterStatus.includes[option.code]) {
      setFilterStatus(filter(filterStatus, (el) => el !== option.code))
    } else {
      setFilterStatus([...filterStatus, option.code])
    }
  }, [filterStatus, setFilterStatus, option.code])

  return (
    <MenuItem
      onClick={() => {}}
      dense
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={filterStatus.includes[option.code]}
            onChange={onChange}
          />
        }
        label={option.text}
      />
    </MenuItem>
  )
})
