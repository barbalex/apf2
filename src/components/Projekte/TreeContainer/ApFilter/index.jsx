import React, { useCallback, useContext } from 'react'
import styled from '@emotion/styled'
import Switch from '@mui/material/Switch'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/client'
import { useParams, useNavigate, useLocation } from 'react-router-dom'

import apById from './apById'
import Label from '../../../shared/Label'
import storeContext from '../../../../storeContext'
import ErrorBoundary from '../../../shared/ErrorBoundary'

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

const ApFilter = () => {
  const { apId } = useParams()
  const navigate = useNavigate()
  const { search } = useLocation()

  const client = useApolloClient()
  const store = useContext(storeContext)
  const { apFilter, setApFilter, activeNodeArray, openNodes, setOpenNodes } =
    store.tree

  const onChange = useCallback(async () => {
    const previousApFilter = apFilter
    // console.log('ApFilter, onChange', { apFilter, previousApFilter })
    if (!previousApFilter) {
      // need to fetch previously not had aps
      store.tree.incrementRefetcher()
      // apFilter was set to true
      let result
      if (apId) {
        // check if this is real ap
        result = await client.query({
          query: apById,
          variables: { id: apId },
        })
      }
      const isAp = [1, 2, 3].includes(result?.data?.apById?.bearbeitung) //@485
      if (!isAp && activeNodeArray[2] === 'Arten') {
        // not a real ap
        // shorten active node array to Arten
        const newActiveNodeArray = [
          activeNodeArray[0],
          activeNodeArray[1],
          activeNodeArray[2],
        ]
        navigate(`/Daten/${newActiveNodeArray.join('/')}${search}`)
        // remove from openNodes
        const newOpenNodes = openNodes.filter((n) => {
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
    setApFilter(!apFilter)
  }, [
    activeNodeArray,
    apFilter,
    apId,
    client,
    navigate,
    openNodes,
    search,
    setApFilter,
    setOpenNodes,
    store.tree,
  ])

  return (
    <ErrorBoundary>
      <NurApDiv>
        <Label label="nur AP" />
        <StyledSwitch
          data-id="ap-filter"
          checked={apFilter}
          onChange={onChange}
          color="primary"
        />
      </NurApDiv>
    </ErrorBoundary>
  )
}

export default observer(ApFilter)
