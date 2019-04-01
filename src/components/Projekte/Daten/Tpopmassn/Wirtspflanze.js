// @flow
import React, { useCallback, useState, useEffect } from 'react'
import AsyncSelect from 'react-select/lib/Async'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQuery, useApolloClient } from 'react-apollo-hooks'
import get from 'lodash/get'

import queryAeEigenschaftens from './queryAeEigenschaftens'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
`
const Label = styled.div`
  font-size: ${props => (props.labelsize ? `${props.labelsize}px` : '12px')};
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

const Wirtspflanze = ({
  row,
  error: saveToDbError,
  saveToDb,
}: {
  row: Object,
  error: string,
  saveToDb: () => void,
}) => {
  const client = useApolloClient()
  const [inputValue, setInputValue] = useState(row.wirtspflanze || '')

  useEffect(() => {
    setInputValue(row.wirtspflanze || '')
  }, [row.wirtspflanze])

  const loadOptions = async (inputValue, cb) => {
    console.log('Wirtspflanze, loadOptions', { inputValue })
    const filter =
      inputValue && inputValue !== row.wirtspflanze
        ? { artname: { includesInsensitive: inputValue } }
        : { artname: { isNull: false } }
    const { data } = await client.query({
      query: queryAeEigenschaftens,
      variables: {
        filter,
      },
    })
    const aeEigenschaften = get(data, 'allAeEigenschaftens.nodes', [])
    console.log('Wirtspflanze, loadOptions', { aeEigenschaften })
    cb(aeEigenschaften)
  }

  const onInputChange = (value, { action }) => {
    console.log('Wirtspflanze, onInputchange', { value, action })
    if (['input-change'].includes(action)) {
      console.log('Wirtspflanze, onInputchange, setting value')
      setInputValue(value)
      const fakeEvent = {
        target: {
          name: 'wirtspflanze',
          value,
        },
      }
      saveToDb(fakeEvent)
      return value
    }
  }

  const onChange = useCallback(option => {
    console.log('Wirtspflanze, onChange', {
      inputValue,
      option,
    })
    const value =
      option && option.value ? option.value : inputValue ? inputValue : null
    const fakeEvent = {
      target: {
        name: 'wirtspflanze',
        value,
      },
    }
    saveToDb(fakeEvent)
    setInputValue(value)
    console.log('Wirtspflanze, onChange', {
      value,
    })
  })

  console.log('Wirtspflanze rendering', {
    wirtspflanze: row.wirtspflanze,
    inputValue,
  })

  return (
    <Container data-id="wirtspflanze">
      <Label>Wirtspflanze</Label>
      <StyledSelect
        defaultOptions
        name="wirtspflanze"
        onChange={onChange}
        inputValue={inputValue}
        hideSelectedOptions
        placeholder="Tippen, um auszuwählen..."
        isClearable
        isSearchable
        noOptionsMessage={() => null}
        backspaceRemovesValue
        tabSelectsValue={false}
        classNamePrefix="react-select"
        onInputChange={onInputChange}
        loadOptions={loadOptions}
      />
      {saveToDbError && <Error>{saveToDbError}</Error>}
    </Container>
  )
}

export default observer(Wirtspflanze)
