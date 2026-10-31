import { useParams } from 'react-router'
import { useSuspenseQuery } from '@tanstack/react-query'

import { TextFieldNonUpdatable } from '../../../../shared/TextFieldNonUpdatable.tsx'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.tsx'
import { FormTitle } from '../../../../shared/FormTitle/index.tsx'
import { Menu } from '../Menu.tsx'
import { ApUsers } from '../ApUsers/index.tsx'
import { Ap, apQueryOptions } from './Ap.tsx'

import styles from './index.module.css'

export const Component = () => {
  const { apId } = useParams<{ apId: string }>()

  const { data } = useSuspenseQuery(apQueryOptions(apId))

  const row = data.apById

  return (
    <ErrorBoundary>
      <FormTitle
        title="Art"
        MenuBarComponent={Menu}
        menuBarProps={{ label: row?.label ?? null }}
      />
      <div className={styles.formContainer}>
        <Ap>
          <ApUsers />
        </Ap>
        <TextFieldNonUpdatable
          key={`${row?.id}artwert`}
          label="Artwert"
          value={
            (row?.aeTaxonomyByArtId?.artwert ??
              'Diese Art hat keinen Artwert') as string
          }
        />
      </div>
    </ErrorBoundary>
  )
}
