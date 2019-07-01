import React, { useState, useContext, useCallback } from 'react'
import AsyncSelect from 'react-select/Async'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'
import get from 'lodash/get'
import { useApolloClient } from 'react-apollo-hooks'
import { observer } from 'mobx-react-lite'

import queryApsToChoose from './queryApsToChoose'
import storeContext from '../../../storeContext'

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
    padding-right: ${props => (props.nocaret ? '0' : '8px')};
  }
  .react-select__dropdown-indicator {
    /* ability to hide caret when not enough space */
    display: ${props => (props.nocaret ? 'none' : 'flex')};
  }
  .react-select__indicator-separator {
    /* ability to hide caret when not enough space */
    width: ${props => (props.nocaret ? '0' : '1px')};
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
    height: ${props => (props.maxheight ? `${props.maxheight}px` : 'unset')};
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

const EkPlan = ({ apValues, addAp }) => {
  const store = useContext(storeContext)
  const client = useApolloClient()

  const { activeNodeArray } = store.tree
  const projId = activeNodeArray[1] || '99999999-9999-9999-9999-999999999999'

  let data
  let error
  const loadOptions = useCallback(
    async (inputValue, cb) => {
      const filter = !!inputValue
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
      console.log('ChooseAp, loadOptions', { inputValue, filter })
      try {
        result = await client.query({
          query: queryApsToChoose,
          variables: {
            filter,
          },
        })
      } catch (err) {
        console.log('ChooseAp, loadOptions', { err })
        error = err
      }
      console.log('ChooseAp, loadOptions', { result })
      data = result.data
      console.log('ChooseAp, loadOptions', { data })
      const options = get(data, 'allAps.nodes', [])
      console.log('ChooseAp, loadOptions', { options })
      cb(options)
    },
    [apValues, projId],
  )

  const onChange = option => {
    console.log('ChooseAp, onChange', { option })
    option && option.value && addAp(option)
  }

  console.log('EkPlan', {
    apValues,
  })
  const value = {
    value: '',
    label: '',
  }

  return (
    <ErrorBoundary>
      <SelectContainer>
        <Label>Art wählen</Label>
        <StyledSelect
          defaultOptions
          onChange={onChange}
          value={value}
          hideSelectedOptions
          placeholder=""
          isClearable
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
        />
        {error && <Error>{error.message}</Error>}
      </SelectContainer>
    </ErrorBoundary>
  )
}

export default observer(EkPlan)
