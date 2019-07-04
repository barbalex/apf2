import React from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

const YearCellMenuTitle = styled.h5`
  padding-top: 8px;
  padding-left: 16px;
  padding-right: 16px;
  margin-bottom: 8px;
  font-size: 0.75rem;
  color: grey;
`
const anchorOrigin = { horizontal: 'right', vertical: 'bottom' }

const CellForYearMenu = ({
  yearMenuAnchor,
  lastClickedYearCell,
  closeYearCellMenu,
}) => {
  return (
    <Menu
      id="yearCellMenu"
      anchorEl={yearMenuAnchor}
      keepMounted
      open={Boolean(yearMenuAnchor)}
      onClose={closeYearCellMenu}
      anchorOrigin={anchorOrigin}
    >
      <YearCellMenuTitle>{`${lastClickedYearCell.tpop}, ${lastClickedYearCell.year}`}</YearCellMenuTitle>
      {lastClickedYearCell.ekPlan ? (
        <MenuItem
          onClick={() => {
            console.log('TODO')
            closeYearCellMenu()
          }}
        >
          EK-Planung entfernen
        </MenuItem>
      ) : (
        <MenuItem
          onClick={() => {
            console.log('TODO')
            closeYearCellMenu()
          }}
        >
          EK planen
        </MenuItem>
      )}
      {lastClickedYearCell.ekfPlan ? (
        <MenuItem
          onClick={() => {
            console.log('TODO')
            closeYearCellMenu()
          }}
        >
          EKF-Planung entfernen
        </MenuItem>
      ) : (
        <MenuItem
          onClick={() => {
            console.log('TODO')
            closeYearCellMenu()
          }}
        >
          EKF planen
        </MenuItem>
      )}
    </Menu>
  )
}

export default observer(CellForYearMenu)
