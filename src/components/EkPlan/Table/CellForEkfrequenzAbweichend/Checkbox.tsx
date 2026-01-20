import { useContext, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'

import { tpop } from '../../../shared/fragments.ts'
import { MobxContext } from '../../../../mobxContext.ts'

import styles from './Checkbox.module.css'

import {
  store as jotaiStore,
  enqueNotificationAtom,
} from '../../../../JotaiStore/index.ts'
export const Checkbox = observer(({ row, value, field }) => {
  const store = useContext(MobxContext)
  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [checked, setChecked] = useState(value === null ? false : value)
  useEffect(() => {
    setChecked(row[field] === true)
  }, [field, row, value])

  const onClick = async () => {
    setChecked(!checked)
    try {
      await apolloClient.mutate({
        mutation: gql`
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
          changedBy: store.user.name,
        },
      })
    } catch (error) {
      setChecked(!checked)
      jotaiStore.set(enqueNotificationAtom, {
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    tsQueryClient.invalidateQueries({
      queryKey: ['EkplanTpopQuery'],
    })
  }

  return (
    <div
      className={styles.container}
      onClick={onClick}
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
})
