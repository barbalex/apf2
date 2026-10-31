import { apiFetch, apiInsert } from '../../../../../../modules/api.ts'
import Checkbox from '@mui/material/Checkbox'

import { useQueryClient, useQuery } from '@tanstack/react-query'

import { Error } from '../../../../../shared/Error.tsx'

import type {
  ApId,
  QkName,
  ApqkQkName,
} from '../../../../../../models/apflora/index.ts'

import styles from './index.module.css'

interface QkNode {
  name: QkName
  titel: string | null
  beschreibung: string | null
}

interface ApqkData {
  apId: ApId
  qkName: ApqkQkName
}

interface ApqkQueryResult {
  apqkByApIdAndQkName?: ApqkData | null
}

interface RowProps {
  apId: ApId
  qk: QkNode
  refetchTab?: (() => void) | undefined
}

export const Row = ({ apId, qk }: RowProps) => {
  const tsQueryClient = useQueryClient()

  const { data, error } = useQuery({
    queryKey: ['apqkQueryForRow', apId, qk.name],
    queryFn: async () => {
      const rows = (await apiFetch<
        { ap_id: string; qk_name: string }[]
      >(
        `/apqk?ap_id=eq.${apId}&qk_name=eq.${encodeURIComponent(qk.name)}&select=ap_id,qk_name`,
      )) ?? []
      return {
        apqkByApIdAndQkName: rows[0] ?? null,
      } as unknown as ApqkQueryResult
    },
  })
  const apqk = data?.apqkByApIdAndQkName

  const checked = !!apqk

  const onChange = async () => {
    // 1. if checked, delete apqk
    // 2. else create apqk
    const variables = { apId, qkName: qk.name }
    if (checked) {
      // apqk has a composite primary key (ap_id, qk_name)
      await apiFetch(
        `/apqk?ap_id=eq.${variables.apId}&qk_name=eq.${variables.qkName}`,
        { method: 'DELETE' },
      )
    } else {
      await apiInsert('apqk', {
        ap_id: variables.apId,
        qk_name: variables.qkName,
      })
    }
    // 3. refetch data
    void tsQueryClient.invalidateQueries({
      queryKey: ['treeAp'],
    })
    setTimeout(() => {
      void tsQueryClient.invalidateQueries({
        queryKey: [`apqkQueryForRow`],
      })
    })
  }

  if (error) return <Error error={error} />

  return (
    <div className={styles.container}>
      <div className={styles.check}>
        <Checkbox
          checked={checked}
          onChange={() => void onChange()}
          color="primary"
        />
      </div>
      <div className={styles.titel}>{qk.titel}</div>
      <div className={styles.beschreibung}>{qk.beschreibung}</div>
    </div>
  )
}
