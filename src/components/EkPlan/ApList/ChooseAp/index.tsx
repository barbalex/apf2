import { useRef, useState } from 'react'
import AsyncSelect from 'react-select/async'
import { useApolloClient } from '@apollo/client/react'
import { useParams } from 'react-router'
import { useAtomValue, useSetAtom } from 'jotai'

import { queryApsToChoose } from './queryApsToChoose.ts'
import { ekPlanApsAtom, ekPlanAddApAtom } from '../../../../store/index.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'

import styles from './index.module.css'

export const ChooseAp = ({
  setShowChoose,
}: {
  setShowChoose: (show: boolean) => void
}) => {
  const { projId } = useParams()

  const aps = useAtomValue(ekPlanApsAtom)
  const addAp = useSetAtom(ekPlanAddApAtom)
  const apolloClient = useApolloClient()

  const apValues = aps.map((a) => a.value)

  const data = useRef<unknown>(null)
  const [error, setError] = useState<unknown>(null)
  const loadOptions = async (
    inputValue: string,
    cb: (options: unknown) => void,
  ) => {
    const filter =
      inputValue ?
        {
          label: { includesInsensitive: inputValue },
          id: { notIn: apValues },
          projId: { equalTo: projId },
        }
      : {
          label: { isNull: false },
          id: { notIn: apValues },
          projId: { equalTo: projId },
        }
    let result: { data?: unknown } | undefined
    try {
      result = await apolloClient.query({
        query: queryApsToChoose,
        variables: {
          filter,
        },
      })
    } catch (err) {
      setError(err)
    }
    data.current = result?.data
    const options = ((data.current as { allAps?: { nodes?: { value: string; label: string }[] } } | null
      | undefined)?.allAps?.nodes ?? []) as { value: string; label: string }[]
    cb(options)
  }

  const onChange = (option: unknown) => {
    if (option && (option as { value?: string }).value) {
      addAp(option as { value: string; label: string })
      setShowChoose(false)
    }
  }

  const label = apValues.length ? 'Art hinzufügen' : 'Art wählen'
  const value = {
    value: '',
    label: '',
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <div className={styles.labelClass}>{label}</div>
        <AsyncSelect
          defaultOptions
          onChange={onChange}
          onBlur={() => setShowChoose(false)}
          value={value}
          hideSelectedOptions
          placeholder="Bitte Tippen für Vorschläge"
          isSearchable
          // remove as can't select without typing
          // don't show a no options message if a value exists
          noOptionsMessage={() =>
            value.value ? null : '(Bitte Tippen für Vorschläge)'
          }
          // enable deleting typed values
          backspaceRemovesValue
          classNamePrefix="react-select"
          loadOptions={loadOptions as never}
          openMenuOnFocus
          autoFocus
          className={`ekplan-aplist-chooseap select-height-limited select-nocaret ${styles.select}`}
          menuPortalTarget={document.body}
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 4 }) }}
        />
        {error ? (
          <div className={styles.errorClass}>{(error as Error).message}</div>
        ) : null}
      </div>
    </ErrorBoundary>
  )
}
