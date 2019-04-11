import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import Switch from '@material-ui/core/Switch'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from 'react-apollo-hooks'

import apById from './apById'
import Label from '../../../shared/Label'
import ErrorBoundary from '../../../shared/ErrorBoundarySingleChild'
import storeContext from '../../../../storeContext'

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

const ApFilter = ({ treeName }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { refetch } = store
  const {
    apFilter,
    setApFilter,
    activeNodeArray,
    setActiveNodeArray,
    openNodes,
    setOpenNodes,
  } = store[treeName]
  const activeNodes = store[`${treeName}ActiveNodes`]

  const onChange = useCallback(async () => {
    const previousApFilter = apFilter
    setApFilter(!apFilter)
    if (!previousApFilter) {
      // need to fetch previously not had aps
      refetch.aps()
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
        setActiveNodeArray(newActiveNodeArray)
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
        setOpenNodes(newOpenNodes)
      }
    }
  }, [treeName, activeNodeArray, openNodes, apFilter])

  return (
    <ErrorBoundary>
      <NurApDiv>
        <Label label="nur AP" />
        <StyledSwitch checked={apFilter} onChange={onChange} color="primary" />
      </NurApDiv>
    </ErrorBoundary>
  )
}

export default observer(ApFilter)
