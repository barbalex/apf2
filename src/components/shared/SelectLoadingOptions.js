/**
 * This does not work as planned:
 * It loads 8 options at mount
 * BUT DOES NOT SHOW THEM WHEN USER ENTERS FIELD
 */

import React, { useCallback } from 'react'
import AsyncSelect from 'react-select/async'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/client'
import get from 'lodash/get'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
`
const Label = styled.div`
  font-size: ${(props) => (props.labelsize ? `${props.labelsize}px` : '12px')};
  color: rgb(0, 0, 0, 0.54);
`
const Error = styled.div`
  font-size: 12px;
  color: red;
`
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
  }
`

const SelectTypable = ({
  row,
  valueLabelPath,
  valueLabel,
  field = '',
  label,
  labelSize,
  error: saveToDbError,
  saveToDb,
  query,
  filter,
  queryNodesName,
}) => {
  const client = useApolloClient()

  const loadOptions = useCallback(
    async (inputValue, cb) => {
      const ownFilter = inputValue
        ? { artname: { includesInsensitive: inputValue } }
        : { artname: { isNull: false } }
      let result
      try {
        result = await client.query({
          query,
          variables: {
            filter: filter ? filter(inputValue) : ownFilter,
          },
        })
      } catch (error) {
        console.log({ error })
      }
      const { data } = result
      const options = data?.[queryNodesName]?.nodes ?? []
      cb(options)
    },
    [client, filter, query, queryNodesName],
  )

  const onChange = useCallback(
    (option) => {
      const value = option && option.value ? option.value : null
      const fakeEvent = {
        target: {
          name: field,
          value,
        },
      }
      saveToDb(fakeEvent)
    },
    [field, saveToDb],
  )

  const value = {
    value: row[field] ?? '',
    label: valueLabel ? valueLabel : get(row, valueLabelPath) ?? '',
  }

  return (
    <Container data-id={field}>
      {label && <Label labelsize={labelSize}>{label}</Label>}
      <StyledSelect
        id={field}
        defaultOptions
        name={field}
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
      {saveToDbError && <Error>{saveToDbError}</Error>}
    </Container>
  )
}

export default observer(SelectTypable)
