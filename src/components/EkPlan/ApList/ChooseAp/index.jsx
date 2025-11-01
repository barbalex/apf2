import { useContext, useRef } from 'react'
import AsyncSelect from 'react-select/async'
import { useApolloClient } from '@apollo/client/react'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router'

import { queryApsToChoose } from './queryApsToChoose.js'
import { MobxContext } from '../../../../mobxContext.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'

import { select, container, labelClass, errorClass } from './index.module.css'

export const ChooseAp = observer(({ setShowChoose }) => {
  const { projId } = useParams()

  const store = useContext(MobxContext)
  const { aps, addAp } = store.ekPlan
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
      <div className={container}>
        <div className={labelClass}>{label}</div>
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
          className={`ekplan-aplist-chooseap select-height-limited select-nocaret ${select}`}
        />
        {error.current && (
          <div className={errorClass}>{error.current.message}</div>
        )}
      </div>
    </ErrorBoundary>
  )
})
