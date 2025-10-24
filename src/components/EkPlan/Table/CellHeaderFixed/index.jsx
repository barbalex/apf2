/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useContext } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { FaSortDown as Caret, FaFilter } from 'react-icons/fa'
import styled from '@emotion/styled'
import { upperFirst } from 'es-toolkit'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../mobxContext.js'
import { TextFilter } from './TextFilter.jsx'
import { BooleanFilter } from './BooleanFilter.jsx'

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
  ${(props) => props['data-label'] === 'Art' && 'padding-left: 5px;'}
`
const Dropdown = styled.div`
  font-size: 1.3em;
  padding-left: 2px;
`
const StyledFaFilter = styled(FaFilter)`
  font-size: 0.9em;
  padding-right: 3px;
`
const anchorOrigin = { horizontal: 'left', vertical: 'bottom' }

export const CellHeaderFixed = observer(({ column }) => {
  const { name, label, nofilter } = column
  const store = useContext(MobxContext)

  const filterValue = store.ekPlan?.[`filter${upperFirst(name)}`]

  const [anchorEl, setAnchorEl] = useState(null)
  const closeMenu = () => setAnchorEl(null)
  const onClickCell = (e) => !anchorEl && setAnchorEl(e.currentTarget)

  const typeIsBoolean = ['ekfrequenzAbweichend'].includes(name)

  return (
    <>
      <StyledCell
        aria-controls={`${name}ColumnHeaderMenu`}
        aria-haspopup="true"
        onClick={onClickCell}
        width={column.width}
      >
        <Title data-label={label}>{label}</Title>
        {!nofilter && (
          <Dropdown>
            {filterValue ?
              <StyledFaFilter />
            : <Caret />}
          </Dropdown>
        )}
      </StyledCell>
      <Menu
        id={`${name}ColumnHeaderMenu`}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        anchorOrigin={anchorOrigin}
      >
        {typeIsBoolean ?
          <BooleanFilter
            column={column}
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
})
