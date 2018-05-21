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
import isEqual from 'lodash/isEqual'
import gql from 'graphql-tag'

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
  withHandlers({
    onChange: ({
      tree,
      treeName,
    }: {
      tree: Object,
      treeName: String,
    }) => ({
      event,
      client,
      tableName
    }) => {
      client.mutate({
        mutation: gql`
          mutation setTreeNodeLabelFilterKey($value: String!, $tree: String!, $key: String!) {
            setTreeNodeLabelFilterKey(tree: $tree, key: $key, value: $value) @client {
              tree @client {
                name
                activeNodeArray
                openNodes
                apFilter
                nodeLabelFilter {
                  ap
                  pop
                  tpop
                  tpopkontr
                  tpopfeldkontr
                  tpopfreiwkontr
                  tpopkontrzaehl
                  tpopmassn
                  ziel
                  zielber
                  erfkrit
                  apber
                  apberuebersicht
                  ber
                  idealbiotop
                  assozart
                  popber
                  popmassnber
                  tpopber
                  tpopmassnber
                  apart
                  projekt
                  beob
                  beobprojekt
                  adresse
                  gemeinde
                  __typename: NodeLabelFilter
                }
                __typename: Tree
              }
              tree2 @client {
                name
                activeNodeArray
                openNodes
                apFilter
                nodeLabelFilter {
                  ap
                  pop
                  tpop
                  tpopkontr
                  tpopfeldkontr
                  tpopfreiwkontr
                  tpopkontrzaehl
                  tpopmassn
                  ziel
                  zielber
                  erfkrit
                  apber
                  apberuebersicht
                  ber
                  idealbiotop
                  assozart
                  popber
                  popmassnber
                  tpopber
                  tpopmassnber
                  apart
                  projekt
                  beob
                  beobprojekt
                  adresse
                  gemeinde
                  __typename: NodeLabelFilter
                }
                __typename: Tree2
              }
            }
          }
        `,
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
  tree,
  treeName,
  onChange,
  nodes,
}: {
  tree: Object,
  treeName: String,
  onChange: () => void,
  nodes: Array<Object>
}) =>
  <Query query={dataGql} >
    {({ error, data, client }) => {
      if (error) return `Fehler: ${error.message}`

      const activeNodeArray = get(data, `${treeName}.activeNodeArray`)
      const activeNode = nodes.find(n => isEqual(n.url, activeNodeArray))
      // name it projekt
      // because: /projekte has no nodes!
      let tableName = 'projekt'
      if (activeNode) {
        tableName = activeNode.nodeType === 'table' ? activeNode.menuType : activeNode.menuType.replace('Folder', '')
      }

      let labelText = 'filtern'
      let filterValue = ''
      if (tableName) {
        filterValue = get(data, `${treeName}.nodeLabelFilter.${tableName}`)
        const table = tables.find(
          (t: { label: string }) => t.table === tableName
        )
        const tableLabel = table ? table.label : null
        if (tableLabel) {
          labelText = `${tableLabel} filtern`
        }
      }
      console.log('LabelFilter: ', { activeNodeArray, activeNode, nodes, tableName, filterValue, labelText })

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
