import React, { useCallback, useState, useEffect } from 'react'
import AsyncSelect from 'react-select/async'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from 'react-apollo-hooks'
import get from 'lodash/get'

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

const SelectTypable = ({ field, form, label, query, queryNodesName }) => {
  const { onChange, onBlur, value, name } = field
  const { errors, handleSubmit } = form
  const saveToDbError = errors[name]

  const client = useApolloClient()
  const [inputValue, setInputValue] = useState(value || '')

  useEffect(() => setInputValue(value || ''), [value])

  const loadOptions = useCallback(async (inputValue, cb) => {
    const filter = !!inputValue
      ? { artname: { includesInsensitive: inputValue } }
      : { artname: { isNull: false } }
    const { data } = await client.query({
      query,
      variables: {
        filter,
      },
    })
    const options = get(data, `${queryNodesName}.nodes`, [])
    cb(options)
  })

  const onInputChange = useCallback((value, { action }) => {
    // update inputValue when typing in the input
    if (!['input-blur', 'menu-close'].includes(action)) {
      if (!value) {
        // if inputValue was one character long, user must be deleting it
        // THIS IS A BAD HACK BUT NECCESSARY BECAUSE AFTER CHOOSING AN OPTION
        // onInputChange GETS A VALUE OF '', NOT THE OPTION CHOOSEN
        if (inputValue.length === 1) {
          onMyChange({ value: null, label: null })
        }
      }
      setInputValue(value)
    }
  })

  const onMyBlur = useCallback(() => {
    if (!!inputValue) {
      onMyChange({ value: inputValue, label: inputValue })
    }
  }, [inputValue])

  const onMyChange = useCallback(option => {
    const value = option && option.value ? option.value : null
    const fakeEvent = {
      target: {
        name: 'wirtspflanze',
        value,
      },
    }
    onChange(fakeEvent)
    onBlur(fakeEvent)
    setTimeout(() => handleSubmit())
  })

  const selectValue = {
    value: value || '',
    label: value || '',
  }

  return (
    <Container data-id={name}>
      {label && <Label>{label}</Label>}
      <StyledSelect
        id={name}
        defaultOptions
        name={name}
        onChange={onMyChange}
        onBlur={onMyBlur}
        value={selectValue}
        inputValue={inputValue || ''}
        hideSelectedOptions
        placeholder="(Für Vorschläge tippen)"
        isClearable
        // remove as can't select without typing
        nocaret
        // don't show a no options message
        noOptionsMessage={() => null}
        tabSelectsValue={false}
        // enable deleting typed values
        backspaceRemovesValue
        classNamePrefix="react-select"
        onInputChange={onInputChange}
        loadOptions={loadOptions}
      />
      {saveToDbError && <Error>{saveToDbError}</Error>}
    </Container>
  )
}

export default observer(SelectTypable)
