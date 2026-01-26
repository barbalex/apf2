import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'

import { Option } from './Option.tsx'
import { query } from './query.ts'

import styles from './Options.module.css'

interface PopStatusWerteNode {
  id: number
  code: number | null
  text: string | null
}

interface PopStatusWerteQueryResult {
  allPopStatusWertes: {
    nodes: PopStatusWerteNode[]
  } | null
}

export const Options = ({ type }) => {
  const apolloClient = useApolloClient()

  const { data } = useQuery({
    queryKey: ['PopStatusWertes'],
    queryFn: async () => {
      const result = await apolloClient.query<PopStatusWerteQueryResult>({
        query,
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })
  const options = data.allPopStatusWertes.nodes ?? []

  return (
    <FormGroup className={styles.formGroup}>
      <FormLabel>Gewünschte Stati wählen:</FormLabel>
      {options.map((option) => (
        <Option
          key={option.id}
          option={option}
          type={type}
        />
      ))}
    </FormGroup>
  )
}
