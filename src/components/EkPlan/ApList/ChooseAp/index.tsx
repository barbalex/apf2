import { useRef } from 'react'
import AsyncSelect from 'react-select/async'
import { useApolloClient } from '@apollo/client/react'
import { useParams } from 'react-router'
import { useAtomValue, useSetAtom } from 'jotai'

import { queryApsToChoose } from './queryApsToChoose.ts'
import { ekPlanApsAtom, ekPlanAddApAtom } from '../../../../store/index.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'

import styles from './index.module.css'

export const ChooseAp = ({ setShowChoose }) => {
  const { projId } = useParams()

  const aps = useAtomValue(ekPlanApsAtom)
  const addAp = useSetAtom(ekPlanAddApAtom)
  const apolloClient = useApolloClient()

  const apValues = aps.map((a) => a.value)

  const data = useRef({})
  const error = useRef({})
  const loadOptions = async (inputValue, cb) => {
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
    let result
    try {
      result = await apolloClient.query({
        query: queryApsToChoose,
        variables: {
          filter,
        },
      })
    } catch (err) {
      error.current = err
    }
    data.current = result.data
    const options = data.current?.allAps?.nodes ?? []
    cb(options)
  }

  const onChange = (option) => {
    if (option && option.value) {
      addAp(option)
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
          nocaret
          // don't show a no options message if a value exists
          noOptionsMessage={() =>
            value.value ? null : '(Bitte Tippen für Vorschläge)'
          }
          // enable deleting typed values
          backspaceRemovesValue
          classNamePrefix="react-select"
          loadOptions={loadOptions}
          openMenuOnFocus
          autoFocus
          className={`ekplan-aplist-chooseap select-height-limited select-nocaret ${styles.select}`}
          menuPortalTarget={document.body}
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 4 }) }}
        />
        {error.current && (
          <div className={styles.errorClass}>{error.current.message}</div>
        )}
      </div>
    </ErrorBoundary>
  )
}
