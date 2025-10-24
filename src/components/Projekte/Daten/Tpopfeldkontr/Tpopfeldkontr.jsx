import { useQuery } from '@apollo/client/react'
import { useParams } from 'react-router'

import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { Menu } from './Menu.jsx'
import { query } from './query.js'
import { TpopfeldkontrForm } from './Form.jsx'

export const Component = () => {
  const { tpopkontrId } = useParams()

  const { data, loading, error } = useQuery(query, {
    variables: { id: tpopkontrId },
  })

  const row = data?.tpopkontrById ?? {}

  if (error) return <Error error={error} />

  if (loading) return <Spinner />

  return (
    <ErrorBoundary>
      <FormTitle
        title="Feld-Kontrolle"
        MenuBarComponent={Menu}
        menuBarProps={{ row }}
      />
      <TpopfeldkontrForm
        row={row}
        data={data}
      />
    </ErrorBoundary>
  )
}
