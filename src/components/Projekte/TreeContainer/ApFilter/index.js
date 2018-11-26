// @flow
import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import Switch from '@material-ui/core/Switch'
import get from 'lodash/get'
import { withApollo } from 'react-apollo'

import apById from './apById'
import Label from '../../../shared/Label'
import ErrorBoundary from '../../../shared/ErrorBoundarySingleChild'
import getActiveNodes from '../../../../modules/getActiveNodes'
import mobxStoreContext from '../../../../mobxStoreContext'

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

const enhance = compose(withApollo)

const ApFilter = ({
  treeName,
  client,
}: {
  treeName: String,
  client: Object,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const { setTreeKey } = mobxStore
  const { apFilter, activeNodeArray, openNodes } = mobxStore[treeName]
  const activeNodes = mobxStore[`${treeName}ActiveNodes`]

  const onChange = useCallback(
    async () => {
      const previousApFilter = apFilter
      setTreeKey({
        value: !apFilter,
        tree: treeName,
        key: 'apFilter',
      })
      if (!previousApFilter) {
        // apFilter was set to true
        const { ap: apId } = activeNodes
        let result
        if (apId) {
          // check if this is real ap
          result = await client.query({
            query: apById,
            variables: { id: apId },
          })
        }
        const isAp = [1, 2, 3].includes(get(result, 'data.apById.bearbeitung'))
        if (!isAp && activeNodeArray[2] === 'Aktionspläne') {
          // not a real ap
          // shorten active node array to Aktionspläne
          const newActiveNodeArray = [
            activeNodeArray[0],
            activeNodeArray[1],
            activeNodeArray[2],
          ]
          setTreeKey({
            value: newActiveNodeArray,
            tree: treeName,
            key: 'activeNodeArray',
          })
          // remove from openNodes
          const newOpenNodes = openNodes.filter(n => {
            if (
              n.length > newActiveNodeArray.length &&
              n[0] === newActiveNodeArray[0] &&
              n[1] === newActiveNodeArray[1] &&
              n[2] === newActiveNodeArray[2]
            )
              return false
            return true
          })
          setTreeKey({
            value: newOpenNodes,
            tree: treeName,
            key: 'openNodes',
          })
        }
      }
    },
    [treeName, activeNodeArray, openNodes, apFilter],
  )

  return (
    <ErrorBoundary>
      <NurApDiv>
        <Label label="nur AP" />
        <StyledSwitch checked={apFilter} onChange={onChange} color="primary" />
      </NurApDiv>
    </ErrorBoundary>
  )
}

export default enhance(ApFilter)
