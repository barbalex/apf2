// @flow

import React from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import get from 'lodash/get'
import app from 'ampersand-app'

import tables from '../../../../modules/tables'
import labelFilterData from './data'
import setTreeNodeLabelFilterKey from './setTreeNodeLabelFilterKey.graphql'
import setTreeKeyGql from './setTreeKey.graphql'

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

const enhance = compose(
  labelFilterData,
  withHandlers({
    onChange: ({
      treeName,
      activeNode,
      data,
    }: {
      treeName: String,
      activeNode: Object,
      data: Object,
    }) => async event => {
      const { filterTable, url, label } = activeNode
      const { value } = event.target
      const openNodes = get(data, `${treeName}.openNodes`, [])
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
        await app.client.mutate({
          mutation: setTreeKeyGql,
          variables: {
            tree: treeName,
            value1: newActiveNodeArray,
            key1: 'activeNodeArray',
            value2: newOpenNodes,
            key2: 'openNodes',
          },
        })
      }
      app.client.mutate({
        mutation: setTreeNodeLabelFilterKey,
        variables: {
          value,
          tree: treeName,
          key: filterTable,
        },
      })
    },
  }),
)

const LabelFilter = ({
  treeName,
  activeNode,
  onChange,
  nodes,
  data,
}: {
  treeName: String,
  activeNode: Object,
  onChange: () => void,
  nodes: Array<Object>,
  data: Object,
}) => {
  const tableName = activeNode ? activeNode.filterTable : null

  let labelText = '(filtern nicht möglich)'
  let filterValue = ''
  if (tableName) {
    filterValue = get(data, `${treeName}.nodeLabelFilter.${tableName}`, '')
    // make sure 0 is kept
    if (!filterValue && filterValue !== 0) filterValue = ''
    const table = tables.find(t => t.table === tableName)
    const tableLabel = table ? table.label : null
    if (tableLabel) {
      labelText = `${tableLabel} filtern`
    }
  }

  return (
    <StyledFormControl fullWidth>
      <InputLabel htmlFor={labelText}>{labelText}</InputLabel>
      <StyledInput id={labelText} value={filterValue} onChange={onChange} />
    </StyledFormControl>
  )
}

export default enhance(LabelFilter)
