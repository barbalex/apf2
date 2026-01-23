import Switch from '@mui/material/Switch'
import { useApolloClient } from '@apollo/client/react'
import { useParams, useNavigate, useLocation } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useSetAtom, useAtomValue } from 'jotai'

import { apById } from './apById.ts'
import { Label } from '../../../shared/Label.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import {
  treeOpenNodesAtom,
  treeSetOpenNodesAtom,
  treeActiveNodeArrayAtom,
  treeApFilterAtom,
  treeSetApFilterAtom,
} from '../../../../store/index.ts'

import styles from './index.module.css'

export const ApFilter = ({ color }) => {
  const { apId } = useParams()
  const navigate = useNavigate()
  const { search } = useLocation()

  const apFilter = useAtomValue(treeApFilterAtom)
  const setApFilter = useSetAtom(treeSetApFilterAtom)
  const activeNodeArray = useAtomValue(treeActiveNodeArrayAtom)
  const openNodes = useAtomValue(treeOpenNodesAtom)
  const setOpenNodes = useSetAtom(treeSetOpenNodesAtom)

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
}
