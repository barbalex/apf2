// @flow
import React, { useCallback, useContext, useState, useEffect } from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import InputAdornment from '@material-ui/core/InputAdornment'
import DeleteFilterIcon from '@material-ui/icons/DeleteSweep'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'

import tables from '../../../modules/tables'
import mobxStoreContext from '../../../mobxStoreContext'

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
const StyledDeleteFilterIcon = styled(DeleteFilterIcon)`
  cursor: pointer;
  pointer-events: auto;
  padding-top: 5px;
  color: rgba(0, 0, 0, 0.7);
`

const LabelFilter = ({ treeName }: { treeName: String }) => {
  const mobxStore = useContext(mobxStoreContext)
  const { setTreeKey } = mobxStore
  const { nodeLabelFilter, activeNode, activeNodeArray } = mobxStore[treeName]
  const {
    setKey: setNodeLabelFilterKey,
    isFiltered: runIsFiltered,
    empty,
  } = nodeLabelFilter
  const isFiltered = runIsFiltered()
  const tableName = activeNode ? activeNode.filterTable : null

  let labelText = '(filtern nicht möglich)'
  let filterValue = ''
  if (tableName) {
    filterValue = get(nodeLabelFilter, tableName, '')
    // make sure 0 is kept
    if (!filterValue && filterValue !== 0) filterValue = ''
    const table = tables.find(t => t.table === tableName)
    const tableLabel = table ? table.label : null
    // danger: Projekte can not be filtered because no parent folder
    if (
      tableLabel &&
      !(activeNodeArray.length <= 2 && activeNodeArray[0] === 'Projekte')
    ) {
      labelText = `${tableLabel} filtern`
    }
  }
  const openNodes = get(mobxStore, `${treeName}.openNodes`, [])

  const [value, setValue] = useState('')

  useEffect(() => {
    setValue(filterValue)
  }, [tableName, treeName])

  const onChange = useCallback(e => setValue(e.target.value))
  const save = useCallback(
    e => {
      if (labelText === '(filtern nicht möglich)') return
      const { filterTable, url, label } = activeNode
      const { value } = e.target
      // pop if is not folder and label does not comply to filter
      if (
        activeNode.nodeType === 'table' &&
        !label.includes(
          value && value.toLowerCase ? value.toLowerCase() : value,
        )
      ) {
        const newActiveNodeArray = [...url]
        const newActiveUrl = [...url]
        newActiveNodeArray.pop()
        let newOpenNodes = openNodes.filter(n => n !== newActiveUrl)
        setTreeKey({
          tree: treeName,
          value: newActiveNodeArray,
          key: 'activeNodeArray',
        })
        setTreeKey({
          tree: treeName,
          value: newOpenNodes,
          key: 'openNodes',
        })
      }
      setNodeLabelFilterKey({
        value,
        tree: treeName,
        key: filterTable,
      })
    },
    [activeNode, treeName, openNodes],
  )
  const onKeyPress = useCallback(event => {
    if (event.key === 'Enter') {
      save(event)
    }
  })
  const onClickEmptyFilter = useCallback(() => {
    empty()
    setValue('')
  })

  return (
    <StyledFormControl fullWidth>
      <InputLabel htmlFor={labelText}>{labelText}</InputLabel>
      <StyledInput
        id={labelText}
        value={value}
        onChange={onChange}
        onBlur={save}
        onKeyPress={onKeyPress}
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
