import {
  memo,
  useCallback,
  useContext,
  useState,
  useRef,
  useEffect,
  use,
} from 'react'
import { observer } from 'mobx-react-lite'
import Collapse from '@mui/material/Collapse'
import { useAtom } from 'jotai'
import styled from '@emotion/styled'

import { TestdataMessage } from './TestdataMessage.jsx'
import { MobxContext } from '../../../mobxContext.js'
import { FilterInput } from './FilterInput.jsx'
import { navListFilterAtoms } from '../../../JotaiStore/index.js'

const Container = styled.div`
  background-color: #388e3c;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media print {
    display: none !important;
  }
`
const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-height: 42px;
  flew-wrap: nowrap;
  overflow: hidden;
`
const Title = styled.div`
  display: block;
  flex-grow: 0;
  flex-shrink: 1;
  margin-top: auto;
  margin-bottom: auto;
  padding: 10px;
  color: white;
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const FormTitle = memo(
  ({
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
    const toggleFilterInput = useCallback(() => {
      toggleFilterInputIsVisible()
      setTimeout(() => filterInputRef?.current?.focus?.(), 0)
    }, [filterInputIsVisible, toggleFilterInputIsVisible])

    console.log('FormTitle', {
      filterInputIsVisible,
      listFilter,
      title,
      toggleFilterInput,
      toggleFilterInputIsVisible,
    })

    // effect sets filterInputIsVisible to true if filterValue changes from empty to not empty
    // use case: user set filter in other ui
    // deactivated because using autofocus on input is more important and that would steal focus from other places...
    // useEffect(() => {
    //   if (!filterValue) return
    //   if (filterInputIsVisible) return
    //   setFilterInputIsVisible(true)
    // }, [!!filterValue])

    return (
      <Container>
        <TitleRow>
          <Title data-id="form-title">{title}</Title>
          {!!MenuBarComponent && (
            <MenuBarComponent
              toggleFilterInput={toggleFilterInput}
              {...menuBarProps}
            />
          )}
        </TitleRow>
        {!!listFilter && (
          <Collapse in={filterInputIsVisible}>
            <FilterInput
              filterInputIsVisible={filterInputIsVisible}
              ref={filterInputRef}
            />
          </Collapse>
        )}
        {!noTestDataMessage && <TestdataMessage />}
      </Container>
    )
  },
)
