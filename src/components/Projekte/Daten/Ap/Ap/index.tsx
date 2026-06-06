import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client/react'

import { TextFieldNonUpdatable } from '../../../../shared/TextFieldNonUpdatable.tsx'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.tsx'
import { FormTitle } from '../../../../shared/FormTitle/index.tsx'
import { Menu } from '../Menu.tsx'
import { ApUsers } from '../ApUsers/index.tsx'
import { Ap, type ApQueryResult } from './Ap.tsx'
import { query } from '../query.ts'

import styles from './index.module.css'

export const Component = () => {
  const { apId } = useParams<{ apId: string }>()

  const apolloClient = useApolloClient()

  const { data } = useQuery({
    queryKey: ['ap', apId],
    queryFn: async () => {
      const result = await apolloClient.query<ApQueryResult>({
        query,
        variables: { id: apId },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const row = data.apById

  return (
    <ErrorBoundary>
      <FormTitle
        title="Art"
        MenuBarComponent={Menu}
      />
      <div className={styles.formContainer}>
        <Ap>
          <ApUsers />
        </Ap>
        <TextFieldNonUpdatable
          key={`${row.id}artwert`}
          label="Artwert"
          value={
            row?.aeTaxonomyByArtId?.artwert ?? 'Diese Art hat keinen Artwert'
          }
        />
      </div>
    </ErrorBoundary>
  )
}

