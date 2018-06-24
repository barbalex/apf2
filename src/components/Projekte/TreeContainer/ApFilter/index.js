// @flow
import React from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import Switch from '@material-ui/core/Switch'
import get from 'lodash/get'
import { Query } from 'react-apollo'

import dataGql from './data.graphql'
import setTreeKey from './setTreeKey.graphql'
import apById from './apById.graphql'
import Label from '../../../shared/Label'
import ErrorBoundary from '../../../shared/ErrorBoundarySingleChild'
import getActiveNodes from '../../../../modules/getActiveNodes';

const NurApDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding-right: 5px;
  min-width: 40px;
  margin-bottom: -14px;
`
const StyledSwitch = styled(Switch)`
  margin-left: -13px;
  margin-top: -18px;
`

const enhance = compose(
  withHandlers({
    onChange: ({ treeName }) => async ({
      client,
      apFilter,
      activeNodeArray,
    }:{
      client: Object,
      apFilter: Boolean,
      activeNodeArray: Array<String>,
    }) => {
      client.mutate({
        mutation: setTreeKey,
        variables: {
          value: !apFilter,
          tree: treeName,
          key: 'apFilter'
        }
      })
      const activeNodes = getActiveNodes(activeNodeArray)
      const { ap: apId } = activeNodes
      let data
      if (apId) {
        // check if this is real ap
        data = await client.query({
          query: apById,
          variables: { id: apId }
        })
      }
      const isAp = [1, 2, 3].includes(get(data, 'apByApId.bearbeitung'))
      if (!isAp) {
        // shorten to Aktionspläne
        const newActiveNodeArray = [
          activeNodeArray[0],
          activeNodeArray[1],
          activeNodeArray[2],
        ]
        client.mutate({
          mutation: setTreeKey,
          variables: {
            value: newActiveNodeArray,
            tree: treeName,
            key: 'activeNodeArray'
          }
        })
      }
    },
  })
)

const ApFilter = ({
  treeName,
  onChange,
}: {
  treeName: String,
  onChange: () => void,
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

      const apFilter = get(data, `${treeName}.apFilter`)
      const activeNodeArray = get(data, `${treeName}.activeNodeArray`)

      return (
        <ErrorBoundary>
          <NurApDiv>
            <Label label="nur AP" />
            <StyledSwitch
              checked={apFilter}
              onChange={() => onChange({ client, apFilter, activeNodeArray })}
              color="primary"
            />
          </NurApDiv>
        </ErrorBoundary>
      )
    }}
  </Query>

export default enhance(ApFilter)
