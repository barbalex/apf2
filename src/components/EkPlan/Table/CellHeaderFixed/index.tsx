 
import { useState } from 'react'
import { useAtomValue } from 'jotai'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { FaSortDown as Caret, FaFilter } from 'react-icons/fa'

import type { EkPlanField } from '../fields.ts'
import { TextFilter } from './TextFilter.tsx'
import { BooleanFilter } from './BooleanFilter.tsx'
import {
  ekPlanFilterApAtom,
  ekPlanFilterPopNrAtom,
  ekPlanFilterPopNameAtom,
  ekPlanFilterPopStatusAtom,
  ekPlanFilterNrAtom,
  ekPlanFilterGemeindeAtom,
  ekPlanFilterFlurnameAtom,
  ekPlanFilterStatusAtom,
  ekPlanFilterBekanntSeitAtom,
  ekPlanFilterLv95XAtom,
  ekPlanFilterLv95YAtom,
  ekPlanFilterEkfKontrolleurAtom,
  ekPlanFilterEkfrequenzAbweichendAtom,
} from '../../../../store/index.ts'

import styles from './index.module.css'

const anchorOrigin = {
  horizontal: 'left',
  vertical: 'bottom',
} as const

// Mapping from field name to filter atom
const filterAtomMap = {
  ap: ekPlanFilterApAtom,
  popNr: ekPlanFilterPopNrAtom,
  popName: ekPlanFilterPopNameAtom,
  popStatus: ekPlanFilterPopStatusAtom,
  nr: ekPlanFilterNrAtom,
  gemeinde: ekPlanFilterGemeindeAtom,
  flurname: ekPlanFilterFlurnameAtom,
  status: ekPlanFilterStatusAtom,
  bekanntSeit: ekPlanFilterBekanntSeitAtom,
  lv95X: ekPlanFilterLv95XAtom,
  lv95Y: ekPlanFilterLv95YAtom,
  ekfKontrolleur: ekPlanFilterEkfKontrolleurAtom,
  ekfrequenzAbweichend: ekPlanFilterEkfrequenzAbweichendAtom,
}

export const CellHeaderFixed = ({
  column,
}: {
  column: EkPlanField
}) => {
  const { name, label, nofilter } = column

  const filterAtom = filterAtomMap[name as keyof typeof filterAtomMap]
  const filterValue = useAtomValue(filterAtom ?? ekPlanFilterApAtom)

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const closeMenu = () => setAnchorEl(null)
  const onClickCell = (e: React.MouseEvent) =>
    !anchorEl && setAnchorEl(e.currentTarget as HTMLElement)

  const typeIsBoolean = ['ekfrequenzAbweichend'].includes(name)

  return (
    <>
      <div
        className={styles.cell}
        aria-controls={`${name}ColumnHeaderMenu`}
        aria-haspopup="true"
        onClick={onClickCell}
        style={{
          minWidth: column.width,
          maxWidth: column.width,
        }}
      >
        <div
          className={styles.title}
          data-label={label}
          style={{ ...(label === 'Art' ? { paddingLeft: 5 } : {}) }}
        >
          {label}
        </div>
        {!nofilter && (
          <div className={styles.dropdown}>
            {filterValue ?
              <FaFilter className={styles.faFilter} />
            : <Caret />}
          </div>
        )}
      </div>
      <Menu
        id={`${name}ColumnHeaderMenu`}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        anchorOrigin={anchorOrigin}
      >
        {typeIsBoolean ?
          <BooleanFilter
            column={column as { name: string }}
            closeMenu={closeMenu}
          />
        : <MenuItem dense>
            <TextFilter
              column={column}
              closeMenu={closeMenu}
            />
          </MenuItem>
        }
      </Menu>
    </>
  )
}
