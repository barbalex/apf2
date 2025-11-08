import { useContext, useState, useRef, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import Collapse from '@mui/material/Collapse'
import { useAtom } from 'jotai'

import { TestdataMessage } from './TestdataMessage.jsx'
import { MobxContext } from '../../../mobxContext.js'
import { FilterInput } from './FilterInput.jsx'
import { navListFilterAtoms } from '../../../JotaiStore/index.js'

import { container, titleRow, titleClass } from './index.module.css'

export const FormTitle = ({
  title,
  listFilter,
  MenuBarComponent = null,
  menuBarProps = {},
  noTestDataMessage = false,
}) => {
  // get list filter from the correct atom
  const [filterInputIsVisible, toggleFilterInputIsVisible] = useAtom(
    navListFilterAtoms[listFilter] ?? 'undefined',
  )
  const filterInputRef = useRef(null)
  const toggleFilterInput = () => {
    toggleFilterInputIsVisible()
    setTimeout(() => filterInputRef?.current?.focus?.(), 0)
  }

  // effect sets filterInputIsVisible to true if filterValue changes from empty to not empty
  // use case: user set filter in other ui
  // deactivated because using autofocus on input is more important and that would steal focus from other places...
  // useEffect(() => {
  //   if (!filterValue) return
  //   if (filterInputIsVisible) return
  //   setFilterInputIsVisible(true)
  // }, [!!filterValue])

  return (
    <div className={container}>
      <div className={titleRow}>
        <div
          className={titleClass}
          data-id="form-title"
        >
          {title}
        </div>
        {!!MenuBarComponent && (
          <MenuBarComponent
            toggleFilterInput={toggleFilterInput}
            {...menuBarProps}
          />
        )}
      </div>
      {!!listFilter && (
        <Collapse in={filterInputIsVisible}>
          <FilterInput
            toggleFilterInputIsVisible={toggleFilterInputIsVisible}
            ref={filterInputRef}
          />
        </Collapse>
      )}
      {!noTestDataMessage && <TestdataMessage />}
    </div>
  )
}
