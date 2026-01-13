import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import { useQuery } from '@apollo/client/react'

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
  const { data } = useQuery<PopStatusWerteQueryResult>(query)
  const options = data?.allPopStatusWertes?.nodes ?? []

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
