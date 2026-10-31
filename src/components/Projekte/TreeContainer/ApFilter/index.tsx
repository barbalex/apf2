import Switch from '@mui/material/Switch'
import { useParams, useNavigate, useLocation } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useSetAtom, useAtomValue, useAtom } from 'jotai'

import { apiFetch } from '../../../../modules/api.ts'
import { Label } from '../../../shared/Label.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import {
  treeOpenNodesAtom,
  treeSetOpenNodesAtom,
  treeActiveNodeArrayAtom,
  treeApFilterAtom,
} from '../../../../store/index.ts'

import styles from './index.module.css'

export const ApFilter = ({ color }: { color?: string | undefined }) => {
  const { apId } = useParams()
  const navigate = useNavigate()
  const { search } = useLocation()

  const [apFilter, setApFilter] = useAtom(treeApFilterAtom)
  const activeNodeArray = useAtomValue(treeActiveNodeArrayAtom)
  const openNodes = useAtomValue(treeOpenNodesAtom)
  const setOpenNodes = useSetAtom(treeSetOpenNodesAtom)

  const tsQueryClient = useQueryClient()

  const onChange = async () => {
    const previousApFilter = apFilter
    // console.log('ApFilter, onChange', { apFilter, previousApFilter })
    if (!previousApFilter) {
      // need to fetch previously not had aps
      void tsQueryClient.invalidateQueries({
        queryKey: [`treeAp`],
      })
      void tsQueryClient.invalidateQueries({
        queryKey: [`treeProject`],
      })
      // apFilter was set to true
      let bearbeitung: number | null = null
      if (apId) {
        // check if this is real ap
        const rows = await apiFetch<{ bearbeitung: number | null }[]>(
          `/v_ap?id=eq.${apId}&select=bearbeitung`,
        )
        bearbeitung = rows?.[0]?.bearbeitung ?? null
      }
      const isAp = [1, 2, 3].includes(bearbeitung ?? 0) //@485
      if (!isAp && activeNodeArray[2] === 'Arten') {
        // not a real ap
        // shorten active node array to Arten
        const newActiveNodeArray = [
          activeNodeArray[0],
          activeNodeArray[1],
          activeNodeArray[2],
        ]
        void navigate(`/Daten/${newActiveNodeArray.join('/')}${search}`)
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
          color={color ?? undefined}
          htmlFor="ap-filter"
        />
        <Switch
          data-id="ap-filter"
          id="ap-filter"
          checked={apFilter}
          onChange={() => void onChange()}
          color="primary"
          className={styles.switchClass}
        />
      </div>
    </ErrorBoundary>
  )
}
