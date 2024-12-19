import {
  memo,
  useCallback,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react'
import { observer } from 'mobx-react-lite'
import Collapse from '@mui/material/Collapse'
import styled from '@emotion/styled'

import { TestdataMessage } from './TestdataMessage.jsx'
import { MobxContext } from '../../../mobxContext.js'
import { FilterInput } from './FilterInput.jsx'
import { filter, set } from 'lodash'

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
      isFilterable,
      // todo: remove menuBar prop when all components use MenuBarComponent
      menuBar = null,
      MenuBarComponent = null,
      noTestDataMessage = false,
    }) => {
      const store = useContext(MobxContext)
      const { nodeLabelFilter, activeFilterTable } = store.tree
      const filterValue = nodeLabelFilter?.[activeFilterTable] ?? ''

      const [filterInputIsVisible, setFilterInputIsVisible] =
        useState(!!filterValue)
      const filterInputRef = useRef(null)
      const toggleFilterInput = useCallback(() => {
        setFilterInputIsVisible((prev) => !prev)
        setTimeout(() => filterInputRef?.current?.focus?.(), 0)
      }, [filterInputIsVisible, setFilterInputIsVisible])
      // effect sets filterInputIsVisible to true if filterValue changes from empty to not empty
      // use case: user set filter in other ui
      useEffect(() => {
        if (!filterValue) return
        if (filterInputIsVisible) return
        setFilterInputIsVisible(true)
      }, [!!filterValue])

      return (
        <Container>
          <TitleRow>
            <Title data-id="form-title">{title}</Title>
            {MenuBarComponent && isFilterable ?
              <MenuBarComponent toggleFilterInput={toggleFilterInput} />
            : menuBar}
          </TitleRow>
          <Collapse in={filterInputIsVisible && isFilterable}>
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
