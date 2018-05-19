// @flow

import React from 'react'
import { observer, inject } from 'mobx-react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'

import tables from '../../../../modules/tables'
import dataGql from './data.graphql'

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
  inject('store'),
  withHandlers({
    onChange: ({
      store,
      tree
    }: {
      store: Object,
      tree: Object
    }) => ({
      event,
      client
    }) => {
      const { activeDataset } = tree
      let filteredTable = ''

      if (activeDataset && activeDataset.folder) {
        filteredTable = activeDataset.folder
      } else if (activeDataset && activeDataset.table) {
        filteredTable = activeDataset.table
      }
      tree.updateLabelFilter(filteredTable, event.target.value)
      /*
      client.mutate({
        mutation: gql`
          mutation setTreeKey($value: Array!, $tree: String!, $key: String!) {
            setTreeKey(tree: $tree, key: $key, value: $value) @client {
              tree @client {
                openNodes
                __typename: Tree
              }
            }
          }
        `,
        variables: { value: openNodes, tree: 'tree', key: 'openNodes' }
      })*/
    },
  }),
  observer
)

const LabelFilter = ({
  store,
  tree,
  treeName,
  onChange,
  nodes,
}: {
  store: Object,
  tree: Object,
  treeName: String,
  onChange: () => void,
  nodes: Array<Object>
}) =>
  <Query query={dataGql} >
    {({ error, data, client }) => {
      if (error) return `Fehler: ${error.message}`

      const nodeLabelFilter = get(data, `${treeName}.nodeLabelFilter`)
      const activeNodeArray = get(data, `${treeName}.activeNodeArray`)
      const activeNode = nodes.find(n => isEqual(n.url, activeNodeArray))
      console.log('LabelFilter: ', { nodeLabelFilter, activeNodeArray, activeNode, nodes })

      const { activeDataset } = tree
      let filteredTable = ''

      if (activeDataset && activeDataset.folder) {
        filteredTable = activeDataset.folder
      } else if (activeDataset && activeDataset.table) {
        filteredTable = activeDataset.table
      }
      let labelText = 'filtern'
      let filterValue = ''
      if (filteredTable) {
        filterValue = tree.nodeLabelFilter.get(filteredTable) || ''
        const table = tables.find(
          (t: { label: string }) => t.table === filteredTable
        )
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
            onChange={(event) => onChange({ event, client })}
          />
        </StyledFormControl>
      )
    }}
  </Query>

export default enhance(LabelFilter)
