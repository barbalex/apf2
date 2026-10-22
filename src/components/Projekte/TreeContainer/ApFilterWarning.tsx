import { useState } from 'react'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'
import { useQuery } from '@apollo/client/react'
import { MdClose as CloseIcon } from 'react-icons/md'
import IconButton from '@mui/material/IconButton'
import { graphql } from '../../../gql/index.ts'

import { treeApFilterAtom } from '../../../store/index.ts'

import type { ApId } from '../../../models/apflora/index.ts'

import styles from './ApFilterWarning.module.css'

interface ApFilterWarningQueryResult {
  apById: {
    id: ApId
    bearbeitung: number | null
  }
}

export const ApFilterWarning = () => {
  const { apId } = useParams()
  const apFilter = useAtomValue(treeApFilterAtom)

  // same document as the former ApFilterController
  // (kept identical so codegen knows it)
  const { data, loading } = useQuery<ApFilterWarningQueryResult>(graphql(`
    query apFilterControllerQuery($id: UUID!) {
      apById(id: $id) {
        id
        bearbeitung
      }
    }
  `), {
    variables: { id: apId },
    skip: !apFilter || !apId,
  })

  // only warn once the ap is loaded and known to be no ap.
  // Otherwise the warning would flicker while the query loads.
  // bearbeitung null means "no ap" (same as the former ApFilterController)
  const apById = data?.apById ?? null
  const bearbeitung = apById?.bearbeitung ?? 0
  const isNoAp = !loading && !!apById && !(bearbeitung > 0 && bearbeitung < 4)

  // dismissal only counts for the ap it was dismissed for:
  // opening another ap is a new situation
  const [dismissedForApId, setDismissedForApId] = useState<
    string | undefined
  >(undefined)
  const dismissed = dismissedForApId === apId

  if (!apFilter || !apId || !isNoAp || dismissed) return null

  return (
    <div className={styles.container}>
      <div className={styles.text}>
        AP-Filter aktiv: Die geöffnete Art ist keine AP-Art und wird nur
        angezeigt, weil sie direkt geöffnet wurde.
      </div>
      <IconButton
        aria-label="Hinweis schliessen"
        title="Hinweis schliessen"
        onClick={() => setDismissedForApId(apId)}
        size="small"
      >
        <CloseIcon />
      </IconButton>
    </div>
  )
}
