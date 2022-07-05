import React, {
  useCallback,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import { MdDeleteSweep } from 'react-icons/md'
import styled from 'styled-components'
import isEqual from 'lodash/isEqual'
import { observer } from 'mobx-react-lite'
import { useDebouncedCallback } from 'use-debounce'
import { getSnapshot } from 'mobx-state-tree'

import tables from '../../../modules/tables'
import storeContext from '../../../storeContext'

const StyledFormControl = styled(FormControl)`
  padding-right: 0.8em !important;
`
const StyledInput = styled(Input)`
  div hr {
    width: calc(100% - 20px) !important;
  }
  &:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
`
const StyledDeleteFilterIcon = styled(MdDeleteSweep)`
  cursor: pointer;
  pointer-events: auto;
  padding-top: 5px;
  color: rgba(0, 0, 0, 0.7);
  font-size: 1.5rem;
`

const LabelFilter = ({ treeName, nodes }) => {
  const store = useContext(storeContext)
  const { nodeLabelFilter, activeNodeArray, setActiveNodeArray, setOpenNodes } =
    store[treeName]
  const {
    setKey: setNodeLabelFilterKey,
    isFiltered: runIsFiltered,
    empty,
  } = nodeLabelFilter
  const isFiltered = runIsFiltered()
  const activeNode = nodes.find((n) => isEqual(n.url, activeNodeArray))
  const tableName = activeNode ? activeNode.filterTable : null

  let labelText = '(filtern nicht möglich)'
  let filterValue = ''
  if (tableName) {
    filterValue = nodeLabelFilter?.[tableName] ?? ''
    // make sure 0 is kept
    if (!filterValue && filterValue !== 0) filterValue = ''
    const table = tables.find((t) => t.table === tableName)
    const tableLabel = table ? table.label : null
    // danger: Projekte can not be filtered because no parent folder
    if (
      tableLabel &&
      !(activeNodeArray.length <= 2 && activeNodeArray[0] === 'Projekte')
    ) {
      labelText = `${tableLabel} filtern`
    }
  }
  const openNodes = useMemo(
    () => store?.[treeName]?.openNodes ?? [],
    [store, treeName],
  )

  const [value, setValue] = useState('')

  useEffect(() => {
    setValue(filterValue)
  }, [filterValue, tableName, treeName])

  const setValuesAfterChange = useCallback(
    (val) => {
      console.log('setting values')
      const { filterTable, url, label } = activeNode
      // pop if is not folder and label does not comply to filter
      if (
        activeNode.nodeType === 'table' &&
        !label.includes(val && val.toLowerCase ? val.toLowerCase() : val)
      ) {
        const newActiveNodeArray = [...url]
        const newActiveUrl = [...url]
        newActiveNodeArray.pop()
        let newOpenNodes = openNodes.filter((n) => n !== newActiveUrl)
        setActiveNodeArray(newActiveNodeArray)
        setOpenNodes(newOpenNodes)
      }
      setNodeLabelFilterKey({
        value: val,
        tree: treeName,
        key: filterTable,
      })
    },
    [
      activeNode,
      openNodes,
      setActiveNodeArray,
      setNodeLabelFilterKey,
      setOpenNodes,
      treeName,
    ],
  )
  const changeDebounced = useDebouncedCallback(setValuesAfterChange, 600)

  const onChange = useCallback(
    (e) => {
      const val = e.target.value
      setValue(val)
      if (labelText === '(filtern nicht möglich)') return
      changeDebounced(val)
    },
    [labelText, changeDebounced],
  )

  const onClickEmptyFilter = useCallback(() => {
    empty()
    setValue('')
  }, [empty])

  return (
    <StyledFormControl fullWidth variant="standard">
      <InputLabel htmlFor={labelText}>{labelText}</InputLabel>
      <StyledInput
        id={labelText}
        value={value}
        onChange={onChange}
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        endAdornment={
          isFiltered ? (
            <InputAdornment
              position="end"
              onClick={onClickEmptyFilter}
              title="Alle Filter entfernen"
            >
              <StyledDeleteFilterIcon />
            </InputAdornment>
          ) : null
        }
      />
    </StyledFormControl>
  )
}

export default observer(LabelFilter)
