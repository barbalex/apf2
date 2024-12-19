import { memo, useCallback, useContext, useState, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import Collapse from '@mui/material/Collapse'
import styled from '@emotion/styled'

import { TestdataMessage } from './TestdataMessage.jsx'
import { MobxContext } from '../../../mobxContext.js'
import { FilterInput } from './FilterInput.jsx'

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
  observer(
    ({
      title,
      menuBar,
      MenuBarComponent,
      isFilterable = false,
      noTestDataMessage = false,
    }) => {
      const store = useContext(MobxContext)
      const { nodeLabelFilter, activeFilterTable } = store.tree
      const filterValue = nodeLabelFilter?.[activeFilterTable] ?? ''

      const [filterInputIsVisible, setFilterInputIsVisible] =
        useState(!!filterValue)
      const filterInputRef = useRef(null)
      const toggleFilterInput = useCallback(() => {
        if (filterInputIsVisible) {
          setFilterInputIsVisible(false)
        } else {
          setFilterInputIsVisible(true)
          setTimeout(() => filterInputRef?.current?.focus?.(), 0)
        }
      }, [filterInputIsVisible, setFilterInputIsVisible])

      return (
        <Container>
          <TitleRow>
            <Title data-id="form-title">{title}</Title>
            {MenuBarComponent ?
              <MenuBarComponent
                key={filterInputIsVisible}
                toggleFilterInput={toggleFilterInput}
              />
            : menuBar}
          </TitleRow>
          <Collapse in={filterInputIsVisible}>
            <FilterInput
              filterInputIsVisible={filterInputIsVisible}
              ref={filterInputRef}
            />
          </Collapse>
          {!noTestDataMessage && <TestdataMessage />}
        </Container>
      )
    },
  ),
)
