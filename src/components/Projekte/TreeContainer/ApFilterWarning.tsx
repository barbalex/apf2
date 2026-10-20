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
  const { data } = useQuery<ApFilterWarningQueryResult>(graphql(`
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

  const bearbeitung = data?.apById?.bearbeitung ?? null
  const isAp = bearbeitung !== null && bearbeitung > 0 && bearbeitung < 4

  // dismissal only counts for the ap it was dismissed for:
  // opening another ap is a new situation
  const [dismissedForApId, setDismissedForApId] = useState<
    string | undefined
  >(undefined)
  const dismissed = dismissedForApId === apId

  if (!apFilter || !apId || isAp || dismissed) return null

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
