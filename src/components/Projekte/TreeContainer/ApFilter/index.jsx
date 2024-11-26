import { memo, useCallback, useContext } from 'react'
import styled from '@emotion/styled'
import Switch from '@mui/material/Switch'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/client'
import { useParams, useNavigate, useLocation } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { getSnapshot } from 'mobx-state-tree'

import { apById } from './apById.js'
import { Label } from '../../../shared/Label.jsx'
import { StoreContext } from '../../../../storeContext.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-right: 5px;
  min-width: 40px;
  margin-bottom: -14px;
`
const StyledSwitch = styled(Switch)`
  margin-left: -13px;
  margin-top: -15px;
`

export const ApFilter = memo(
  observer(({ color }) => {
    const { apId } = useParams()
    const navigate = useNavigate()
    const { search } = useLocation()

    const client = useApolloClient()
    const queryClient = useQueryClient()

    const store = useContext(StoreContext)
    const {
      apFilter,
      setApFilter,
      activeNodeArray,
      openNodes: openNodesRaw,
      setOpenNodes,
    } = store.tree
    const aNA = getSnapshot(activeNodeArray)
    const openNodes = getSnapshot(openNodesRaw)

    const onChange = useCallback(async () => {
      const previousApFilter = apFilter
      // console.log('ApFilter, onChange', { apFilter, previousApFilter })
      if (!previousApFilter) {
        // need to fetch previously not had aps
        queryClient.invalidateQueries({
          queryKey: [`treeAp`],
        })
        queryClient.invalidateQueries({
          queryKey: [`treeProject`],
        })
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
        if (!isAp && aNA[2] === 'Arten') {
          // not a real ap
          // shorten active node array to Arten
          const newActiveNodeArray = [aNA[0], aNA[1], aNA[2]]
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
      aNA,
      apFilter,
      apId,
      client,
      navigate,
      openNodes,
      queryClient,
      search,
      setApFilter,
      setOpenNodes,
    ])

    return (
      <ErrorBoundary>
        <Container>
          <Label
            label="nur AP"
            color={color}
          />
          <StyledSwitch
            data-id="ap-filter"
            checked={apFilter}
            onChange={onChange}
            color="primary"
          />
        </Container>
      </ErrorBoundary>
    )
  }),
)
