import { useState, useCallback, useContext, memo } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { FaSortDown as Caret, FaFilter } from 'react-icons/fa'
import styled from '@emotion/styled'

import { MobxContext } from '../../../../mobxContext.js'
import { TextFilter } from '../CellHeaderFixed/TextFilter.jsx'
import { Options } from './Options.jsx'

export const StyledCell = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 500;
  font-size: 0.75rem;
  color: black;
  line-height: 60px;
  border-left: solid hsla(120, 25%, 70%, 1) 1px;
  border-right: solid hsla(120, 25%, 70%, 1) 1px;
  border-bottom: solid #e6e6e6 1px;
  background: hsla(120, 25%, 88%, 1);
  padding: 0 4px;
  cursor: pointer;
  box-sizing: border-box;
  &.column-hovered {
    background: hsla(120, 25%, 82%, 1) !important;
    font-weight: 700 !important;
  }
`
const Title = styled.div`
  text-align: left;
  display: inline-block;
  vertical-align: middle;
  line-height: normal;
  padding: 2px 0;
  margin-top: auto;
  margin-bottom: auto;
  user-select: none;
`
const Dropdown = styled.div`
  font-size: 1.3em;
  padding-left: 2px;
`
const StyledFaFilter = styled(FaFilter)`
  font-size: 0.9em;
  padding-right: 3px;
`
const TextFilterContainer = styled.div`
  padding: 0 16px;
`
const StyledMenu = styled(Menu)`
  & .MuiPaper-root {
    overflow: hidden !important;
  }
`
const anchorOrigin = { horizontal: 'left', vertical: 'bottom' }

export const CellHeaderFixedTpopStatus = memo(({ style, column, refetch }) => {
  const store = useContext(MobxContext)
  const {
    filterStatusEmpty,
    setFilterEmptyStatus,
    filterStatus,
    setFilterStatus,
  } = store.ekPlan

  const options = []

  const [anchorEl, setAnchorEl] = useState(null)

  const closeMenu = useCallback(() => setAnchorEl(null), [])
  const onClickCell = useCallback((e) => setAnchorEl(e.currentTarget), [])
  const onClickFilterEmptyValues = useCallback(() => {
    if (!filterStatusEmpty && filterStatus) {
      setFilterStatus(null)
    }
    setFilterEmptyStatus(!filterStatusEmpty)
    setAnchorEl(null)
  }, [filterStatusEmpty, setFilterStatus, setFilterEmptyStatus, filterStatus])

  const { label } = column

  return (
    <>
      <StyledCell
        style={style}
        aria-controls="tpopStatusHeaderMenu"
        aria-haspopup="true"
        onClick={onClickCell}
      >
        <Title>{label}</Title>
        <Dropdown>
          {filterStatusEmpty || filterStatus ?
            <StyledFaFilter />
          : <Caret />}
        </Dropdown>
      </StyledCell>
      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        anchorOrigin={anchorOrigin}
      >
        <MenuItem
          onClick={onClickFilterEmptyValues}
          dense
        >
          {filterStatusEmpty ? 'nicht Leerwerte filtern' : 'Leerwerte filtern'}
        </MenuItem>
        <TextFilterContainer>
          <Options
            filterStatus={filterStatus}
            refetch={refetch}
          />
        </TextFilterContainer>
      </StyledMenu>
    </>
  )
})
