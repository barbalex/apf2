import { useContext } from 'react'
import Switch from '@mui/material/Switch'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/client/react'
import { useParams, useNavigate, useLocation } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { getSnapshot } from 'mobx-state-tree'

import { apById } from './apById.ts'
import { Label } from '../../../shared/Label.jsx'
import { MobxContext } from '../../../../mobxContext.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'

import styles from './index.module.css'

export const ApFilter = observer(({ color }) => {
  const { apId } = useParams()
  const navigate = useNavigate()
  const { search } = useLocation()

  const store = useContext(MobxContext)
  const {
    apFilter,
    setApFilter,
    activeNodeArray,
    openNodes: openNodesRaw,
    setOpenNodes,
  } = store.tree
  const aNA = getSnapshot(activeNodeArray)
  const openNodes = getSnapshot(openNodesRaw)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const onChange = async () => {
    const previousApFilter = apFilter
    // console.log('ApFilter, onChange', { apFilter, previousApFilter })
    if (!previousApFilter) {
      // need to fetch previously not had aps
      tsQueryClient.invalidateQueries({
        queryKey: [`treeAp`],
      })
      tsQueryClient.invalidateQueries({
        queryKey: [`treeProject`],
      })
      // apFilter was set to true
      let result
      if (apId) {
        // check if this is real ap
        result = await apolloClient.query({
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
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <Label
          label="nur AP"
          color={color}
          htmlFor="ap-filter"
        />
        <Switch
          data-id="ap-filter"
          id="ap-filter"
          checked={apFilter}
          onChange={onChange}
          color="primary"
          className={styles.switchClass}
        />
      </div>
    </ErrorBoundary>
  )
})
