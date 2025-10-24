import { useState, useContext } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { FaSortDown as Caret, FaFilter } from 'react-icons/fa'
import styled from '@emotion/styled'

import { MobxContext } from '../../../../mobxContext.js'
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
  width: ${(props) => props.width}px;
  min-width: ${(props) => props.width}px;
  height: 60px;
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

export const CellHeaderFixedTpopStatus = ({
  column,
  refetch,
  type = 'tpop',
}) => {
  const store = useContext(MobxContext)
  const filterStatus =
    type === 'tpop' ? store.ekPlan.filterStatus : store.ekPlan.filterPopStatus

  const [anchorEl, setAnchorEl] = useState(null)

  const closeMenu = () => {
    setAnchorEl(null)
    // needed to update after changing tpop status
    refetch()
  }

  const onClickCell = (e) => setAnchorEl(e.currentTarget)

  const { label } = column

  return (
    <>
      <StyledCell
        aria-controls={`${type}StatusHeaderMenu`}
        aria-haspopup="true"
        onClick={onClickCell}
        width={column.width}
      >
        <Title>{label}</Title>
        <Dropdown>
          {filterStatus?.length ?
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
        <TextFilterContainer>
          <Options type={type} />
        </TextFilterContainer>
      </StyledMenu>
    </>
  )
}
