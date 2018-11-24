// @flow

import React, { useCallback, useContext } from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import styled from 'styled-components'
import compose from 'recompose/compose'
import get from 'lodash/get'
import { withApollo } from 'react-apollo'

import tables from '../../../../modules/tables'
import setTreeNodeLabelFilterKey from './setTreeNodeLabelFilterKey'
import mobxStoreContext from '../../../../mobxStoreContext'

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

const enhance = compose(withApollo)

const LabelFilter = ({
  treeName,
  activeNode,
  nodes,
  client,
}: {
  treeName: String,
  activeNode: Object,
  nodes: Array<Object>,
  client: Object,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const { setTreeKey } = mobxStore
  const tableName = activeNode ? activeNode.filterTable : null

  let labelText = '(filtern nicht möglich)'
  let filterValue = ''
  if (tableName) {
    filterValue = get(mobxStore, `${treeName}.nodeLabelFilter.${tableName}`, '')
    // make sure 0 is kept
    if (!filterValue && filterValue !== 0) filterValue = ''
    const table = tables.find(t => t.table === tableName)
    const tableLabel = table ? table.label : null
    if (tableLabel) {
      labelText = `${tableLabel} filtern`
    }
  }
  const openNodes = get(mobxStore, `${treeName}.openNodes`, [])

  const onChange = useCallback(
    async event => {
      const { filterTable, url, label } = activeNode
      const { value } = event.target
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
      client.mutate({
        mutation: setTreeNodeLabelFilterKey,
        variables: {
          value,
          tree: treeName,
          key: filterTable,
        },
      })
    },
    [treeName, openNodes, activeNode],
  )

  return (
    <StyledFormControl fullWidth>
      <InputLabel htmlFor={labelText}>{labelText}</InputLabel>
      <StyledInput id={labelText} value={filterValue} onChange={onChange} />
    </StyledFormControl>
  )
}

export default enhance(LabelFilter)
