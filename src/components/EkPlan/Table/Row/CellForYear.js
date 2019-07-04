import React, { useCallback, useState } from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { GoArrowRight } from 'react-icons/go'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
// this will be for Massnahmen
import { GiSpade } from 'react-icons/gi'
import { GoZap } from 'react-icons/go'

import { TableCellForYear } from './index'
import EkfIcon from '../../../../icons/Ekf'
import EkIcon from '../../../../icons/Ek'

const AzContainer = styled.div`
  display: flex;
  height: 25px;
`
const AzIcon = styled(GoArrowRight)`
  font-size: 1.5rem;
`
const NrOfEvents = styled.span`
  bottom: 12px;
  left: -2px;
  position: relative;
`
const YearCellMenuTitle = styled.h5`
  padding-top: 8px;
  padding-left: 16px;
  padding-right: 16px;
  margin-bottom: 8px;
  font-size: 0.75rem;
  color: grey;
`

const CellForYear = ({
  field,
  row,
  columnHovered,
  setColumnHovered,
  resetYearHovered,
  scrollPositions,
}) => {
  const [yearMenuAnchor, setYearMenuAnchor] = useState(null)
  const [lastClickedYearCell, setLastClickedYearCell] = useState({
    year: null,
    tpopId: null,
    tpop: null,
    ekPlan: false,
    ekfPlan: false,
  })
  const closeYearCellMenu = useCallback(event => {
    setYearMenuAnchor(null)
    setLastClickedYearCell({
      year: null,
      tpopId: null,
      tpop: null,
      ekPlan: false,
      ekfPlan: false,
    })
  }, [])
  const onMouseEnter = useCallback(() => setColumnHovered(field.label), [field])

  return (
    <>
      <TableCellForYear
        key={field.label}
        width={field.width}
        onMouseEnter={onMouseEnter}
        onMouseLeave={resetYearHovered}
        data-columnishovered={columnHovered === field.label}
        onClick={event => {
          setLastClickedYearCell({
            year: field.label,
            tpopId: row.id,
            tpop: `${row.ap.value} Pop: ${row.popNr.value}, TPop: ${row.tpopNr.value}`,
            ekPlan: !!field.value.ek.length,
            ekfPlan: !!field.value.ekf.length,
          })
          const currentTarget = event.currentTarget
          setTimeout(() => setYearMenuAnchor(currentTarget))
        }}
      >
        <>
          {!!field.value.az.length && (
            <AzContainer>
              <AzIcon title="Ausgangszustand" aria-label="Ausgangszustand" />
              {field.value.az.length > 1 && (
                <NrOfEvents>{field.value.az.length}</NrOfEvents>
              )}
            </AzContainer>
          )}
          {!!field.value.ek.length && (
            <div title="EK" aria-label="EK">
              <EkIcon width="25px" height="20px" />
              {field.value.ek.length > 1 && (
                <NrOfEvents>{field.value.ek.length}</NrOfEvents>
              )}
            </div>
          )}
          {!!field.value.ekf.length && (
            <div title="EKF" aria-label="EKF">
              <EkfIcon width="25px" height="20px" />
              {field.value.ekf.length > 1 && (
                <NrOfEvents>{field.value.ekf.length}</NrOfEvents>
              )}
            </div>
          )}
        </>
      </TableCellForYear>
      <Menu
        id="yearCellMenu"
        anchorEl={yearMenuAnchor}
        keepMounted
        open={Boolean(yearMenuAnchor)}
        onClose={closeYearCellMenu}
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
    </>
  )
}

export default observer(CellForYear)
