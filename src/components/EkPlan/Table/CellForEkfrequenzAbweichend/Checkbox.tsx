import { useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import { gql as dynamicGql } from '../../../../apolloGql.ts'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'

import { tpop } from '../../../shared/fragments.ts'

import styles from './Checkbox.module.css'

import {
  addNotificationAtom,
  userNameAtom,
} from '../../../../store/index.ts'
import type { RowTpopNode } from '../tableTypes.ts'

export const Checkbox = ({
  row,
  value,
  field,
}: {
  row: RowTpopNode
  value: boolean | null
  field: string
}) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const userName = useAtomValue(userNameAtom)
  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [checked, setChecked] = useState(value === null ? false : value)
  const rowValue = row[field as keyof RowTpopNode] === true
  const [prevRowValue, setPrevRowValue] = useState(rowValue)
  if (prevRowValue !== rowValue) {
    setPrevRowValue(rowValue)
    setChecked(rowValue)
  }

  const onClick = async () => {
    setChecked(!checked)
    try {
      await apolloClient.mutate({
        mutation: dynamicGql`
            mutation updateTpopCheckbox(
              $id: UUID!
              $${field}: Boolean
              $changedBy: String
            ) {
              updateTpopById(
                input: {
                  id: $id
                  tpopPatch: {
                    id: $id
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                tpop {
                  ...TpopFields
                }
              }
            }
            ${tpop}
          `,
        variables: {
          id: row.id,
          [field]: !checked,
          changedBy: userName,
        },
      })
    } catch (error) {
      setChecked(!checked)
      addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    void tsQueryClient.invalidateQueries({
      queryKey: ['EkplanTpopQuery'],
    })
  }

  return (
    <div
      className={styles.container}
      onClick={() => void onClick()}
    >
      <div
        className={styles.div}
        style={{ background: checked ? '#2e7d32' : 'rgba(46,125,50,0.1)' }}
      >
        <svg
          viewBox="0 0 24 24"
          style={{ visibility: checked ? 'visible' : 'hidden' }}
          className={styles.icon}
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    </div>
  )
}
