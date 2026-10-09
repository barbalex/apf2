import { useState } from 'react'
import { useAtomValue } from 'jotai'
import Menu, { type MenuProps } from '@mui/material/Menu'
import { FaSortDown as Caret, FaFilter } from 'react-icons/fa'
import { styled } from '@mui/material/styles'

import { Options } from './Options.tsx'
import type { EkPlanField } from '../fields.ts'
import {
  ekPlanFilterStatusAtom,
  ekPlanFilterPopStatusAtom,
} from '../../../../store/index.ts'

import ekfrequenzStyles from '../CellHeaderFixedEkfrequenz.module.css'
import styles from './index.module.css'

const StyledMenu = styled((props: MenuProps) => <Menu {...props} />)(() => ({
  '& .MuiPaper-root': {
    overflow: 'hidden !important',
  },
}))

const anchorOrigin = {
  horizontal: 'left',
  vertical: 'bottom',
} as const

export const CellHeaderFixedTpopStatus = ({
  column,
  refetch,
  type = 'tpop',
}: {
  column: EkPlanField
  refetch: () => void
  type?: string
}) => {
  const filterStatusAtom =
    type === 'tpop' ? ekPlanFilterStatusAtom : ekPlanFilterPopStatusAtom
  const filterStatus = useAtomValue(filterStatusAtom)

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const closeMenu = () => {
    setAnchorEl(null)
    // needed to update after changing tpop status
    refetch()
  }

  const onClickCell = (e: React.MouseEvent) =>
    setAnchorEl(e.currentTarget as HTMLElement)

  const { label } = column

  return (
    <>
      <div
        className={ekfrequenzStyles.cell}
        aria-controls={`${type}StatusHeaderMenu`}
        aria-haspopup="true"
        onClick={onClickCell}
        style={{
          width: column.width,
          minWidth: column.width,
        }}
      >
        <div className={ekfrequenzStyles.title}>{label}</div>
        <div className={ekfrequenzStyles.dropdown}>
          {filterStatus?.length ?
            <FaFilter className={styles.faFilter} />
          : <Caret />}
        </div>
      </div>
      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        anchorOrigin={anchorOrigin}
      >
        <div className={ekfrequenzStyles.textFilterContainer}>
          <Options type={type} />
        </div>
      </StyledMenu>
    </>
  )
}
