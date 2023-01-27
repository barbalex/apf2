import React, { useContext, useCallback, useRef } from 'react'
import AsyncSelect from 'react-select/async'
import styled from '@emotion/styled'
import { useApolloClient } from '@apollo/client'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router-dom'

import queryApsToChoose from './queryApsToChoose'
import storeContext from '../../../../storeContext'
import ErrorBoundary from '../../../shared/ErrorBoundary'

const StyledSelect = styled(AsyncSelect)`
  .react-select__control {
    background-color: rgba(0, 0, 0, 0) !important;
    border-bottom-color: rgba(0, 0, 0, 0.1);
    border-top: none;
    border-left: none;
    border-right: none;
    border-radius: 0;
  }
  .react-select__control:hover {
    border-bottom-width: 2px;
  }
  .react-select__control:focus-within {
    border-bottom-color: rgba(28, 80, 31, 1) !important;
    box-shadow: none;
  }
  .react-select__value-container {
    padding-left: 0;
  }
  .react-select__indicators {
    @media print {
      display: none;
    }
  }
  .react-select__clear-indicator {
    /* ability to hide caret when not enough space */
    padding-right: ${(props) => (props.nocaret ? '0' : '8px')};
  }
  .react-select__dropdown-indicator {
    /* ability to hide caret when not enough space */
    display: ${(props) => (props.nocaret ? 'none' : 'flex')};
  }
  .react-select__indicator-separator {
    /* ability to hide caret when not enough space */
    width: ${(props) => (props.nocaret ? '0' : '1px')};
  }
  input {
    @media print {
      padding-top: 3px;
      padding-bottom: 0;
    }
  }
  .react-select__menu,
  .react-select__menu-list {
    height: 130px;
    height: ${(props) => (props.maxheight ? `${props.maxheight}px` : 'unset')};
    z-index: 4;
  }
`
const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
`
const Label = styled.div`
  font-size: 12px;
  color: rgb(0, 0, 0, 0.54);
`
const Error = styled.div`
  font-size: 12px;
  color: red;
`

const EkPlan = ({ setShowChoose }) => {
  const { projId } = useParams()
  
  const store = useContext(storeContext)
  const { aps, addAp } = store.ekPlan
  const client = useApolloClient()

  const apValues = aps.map((a) => a.value)

  const data = useRef({})
  const error = useRef({})
  const loadOptions = useCallback(
    async (inputValue, cb) => {
      const filter = inputValue
        ? {
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
        result = await client.query({
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
    },
    [apValues, client, projId],
  )

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
      <SelectContainer>
        <Label>{label}</Label>
        <StyledSelect
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
        />
        {error.current && <Error>{error.current.message}</Error>}
      </SelectContainer>
    </ErrorBoundary>
  )
}

export default observer(EkPlan)
