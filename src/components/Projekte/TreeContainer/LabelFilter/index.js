// @flow

import React from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import { Query } from 'react-apollo'
import get from 'lodash/get'

import tables from '../../../../modules/tables'
import dataGql from './data.graphql'
import setTreeNodeLabelFilterKey from './setTreeNodeLabelFilterKey.graphql'

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
  withHandlers({
    onChange: ({ treeName }: { treeName: String }) => ({
      event,
      client,
      tableName
    }) => {
      client.mutate({
        mutation: setTreeNodeLabelFilterKey,
        variables: {
          value: event.target.value,
          tree: treeName,
          key: tableName
        }
      })
    },
  })
)

const LabelFilter = ({
  treeName,
  activeNode,
  onChange,
  nodes,
}: {
  treeName: String,
  activeNode: Object,
  onChange: () => void,
  nodes: Array<Object>
}) =>
  <Query query={dataGql} >
    {({ error, data, client }) => {
      if (error) {
        if (
          error.message.includes('permission denied') ||
          error.message.includes('keine Berechtigung')
        ) {
          // ProjektContainer returns helpful screen
          return null
        }
        return `Fehler: ${error.message}`
      }

      // name it projekt
      // because: /projekte has no nodes!
      let tableName = 'projekt'
      if (activeNode) {
        tableName = activeNode.nodeType === 'table' ? activeNode.menuType : activeNode.menuType.replace('Folder', '')
      }

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
          <StyledInput
            id={labelText}
            value={filterValue}
            onChange={(event) => onChange({ event, client, tableName })}
          />
        </StyledFormControl>
      )
    }}
  </Query>

export default enhance(LabelFilter)
