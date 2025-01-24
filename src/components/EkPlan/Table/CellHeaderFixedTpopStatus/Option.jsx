import { memo, useContext, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import MenuItem from '@mui/material/MenuItem'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { getSnapshot } from 'mobx-state-tree'

import { MobxContext } from '../../../../mobxContext.js'

export const Option = memo(
  observer(({ option, refetch }) => {
    const store = useContext(MobxContext)
    const { filterStatus: filterStatusIn, setFilterStatus } = store.ekPlan
    const filterStatus = filterStatusIn ? getSnapshot(filterStatusIn) : []
    const checked = filterStatus.includes(option.code)

    const onChange = useCallback(() => {
      const newStatus =
        filterStatus.includes(option.code) ?
          filterStatus.filter((el) => el !== option.code)
        : [...new Set([...filterStatus, option.code])]

      setFilterStatus(newStatus)
      refetch()
    }, [filterStatus, setFilterStatus, option.code])

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
  }),
)
