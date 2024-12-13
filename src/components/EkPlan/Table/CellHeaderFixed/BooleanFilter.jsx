/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useContext, forwardRef } from 'react'
import MenuItem from '@mui/material/MenuItem'
import upperFirst from 'lodash/upperFirst'

import { StoreContext } from '../../../../storeContext.js'

// need to forward ref from Menu to MenuItem
// see: https://github.com/mui-org/material-ui/issues/15903#issuecomment-496313450
// and: https://reactjs.org/docs/forwarding-refs.html
export const BooleanFilter = forwardRef(({ column, closeMenu }, ref) => {
  const store = useContext(StoreContext)
  const { name } = column

  const storeValue = store.ekPlan?.[`filter${upperFirst(name)}`]
  const storeSetFunction = store.ekPlan?.[`setFilter${upperFirst(name)}`]

  let valueText = 'wahre Werte'
  if (name === 'ekfrequenzAbweichend') {
    valueText = 'abweichende'
  }

  const onClick = useCallback(() => {
    storeSetFunction(!storeValue)
    closeMenu()
  }, [])

  return (
    <MenuItem
      ref={ref}
      onClick={onClick}
      dense
    >
      {!storeValue ? `${valueText} filtern` : `${valueText} nicht filtern`}
    </MenuItem>
  )
})
