import { useAtomValue, useSetAtom } from 'jotai'
import MenuItem from '@mui/material/MenuItem'

import {
  ekPlanFilterEkfrequenzAbweichendAtom,
  ekPlanSetFilterEkfrequenzAbweichendAtom,
} from '../../../../store/index.ts'

// need to forward ref from Menu to MenuItem
// see: https://github.com/mui-org/material-ui/issues/15903#issuecomment-496313450
// and: https://reactjs.org/docs/forwarding-refs.html
export const BooleanFilter = ({
  column,
  closeMenu,
}: {
  column: { name: string }
  closeMenu: () => void
}) => {
  const { name } = column

  const storeValue = useAtomValue(ekPlanFilterEkfrequenzAbweichendAtom)
  const storeSetFunction = useSetAtom(ekPlanSetFilterEkfrequenzAbweichendAtom)

  let valueText = 'wahre Werte'
  if (name === 'ekfrequenzAbweichend') {
    valueText = 'abweichende'
  }

  const onClick = () => {
    storeSetFunction(!storeValue)
    closeMenu()
  }

  return (
    <MenuItem
      ref={undefined}
      onClick={onClick}
      dense
    >
      {!storeValue ? `${valueText} filtern` : `${valueText} nicht filtern`}
    </MenuItem>
  )
}
