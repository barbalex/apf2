import React, { useState, useCallback, useEffect } from 'react'
import CreatableSelect from 'react-select/creatable'
import styled from 'styled-components'
import IconButton from '@material-ui/core/IconButton'
import AddLocation from '@material-ui/icons/AddLocationOutlined'
import { observer } from 'mobx-react-lite'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
`
const Label = styled.div`
  font-size: 12px;
  color: ${props => (props.error ? '#f44336' : 'rgb(0, 0, 0, 0.54)')};
`
const Error = styled.div`
  font-size: 12px;
  color: #f44336;
`
const Field = styled.div`
  display: flex;
  justify-content: space-between;
  align-content: stretch;
`
const StyledSelect = styled(CreatableSelect)`
  width: 100%;
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
const StyledIconButton = styled(IconButton)`
  margin-top: -5px !important;
`

const SharedSelectCreatable = ({
  field,
  form,
  label,
  options: optionsIn,
  loading,
  showLocate,
  onClickLocate,
  maxHeight = null,
  noCaret = false,
}) => {
  const { onChange, onBlur, value, name } = field
  const { errors, handleSubmit } = form
  const error = errors[name]

  const [stateValue, setStateValue] = useState(null)

  const onMyChange = useCallback(
    option => {
      const fakeEvent = {
        target: {
          name,
          value: option ? option.value : null,
        },
      }
      onChange(fakeEvent)
      onBlur(fakeEvent)
      setTimeout(() => handleSubmit())
    },
    [name],
  )
  const onInputChange = useCallback(value => setStateValue(value))
  const onMyBlur = useCallback(
    event => {
      if (stateValue) {
        const fakeEvent = {
          target: {
            name,
            value: stateValue,
          },
        }
        onChange(fakeEvent)
        onBlur(fakeEvent)
        setTimeout(() => handleSubmit())
      }
    },
    [stateValue, name],
  )

  useEffect(() => {
    setStateValue(value)
  }, [value])

  // need to add value to options list if it is not yet included
  const valuesArray = optionsIn.map(o => o.value)
  const options = [...optionsIn]
  if (value && !valuesArray.includes(value)) {
    options.push({ label: value, value })
  }

  // show ... while options are loading
  const loadingOptions = [{ value, label: '...' }]
  const optionsToUse = loading && value ? loadingOptions : options
  const selectValue = optionsToUse.find(o => o.value === value)

  return (
    <Container data-id={name}>
      {label && <Label error={!!error}>{label}</Label>}
      <Field>
        <StyledSelect
          id={name}
          name={name}
          value={selectValue}
          options={options}
          onChange={onMyChange}
          onBlur={onMyBlur}
          onInputChange={onInputChange}
          hideSelectedOptions
          placeholder=""
          isClearable
          isSearchable
          noOptionsMessage={() => '(keine)'}
          maxheight={maxHeight}
          classNamePrefix="react-select"
          nocaret={noCaret}
        />
        {showLocate && (
          <StyledIconButton
            aria-label="Mit Hilfe der Koordinaten automatisch setzen"
            title="Mit Hilfe der Koordinaten automatisch setzen"
            onClick={onClickLocate}
          >
            <AddLocation />
          </StyledIconButton>
        )}
      </Field>
      {error && <Error>{error}</Error>}
    </Container>
  )
}

export default observer(SharedSelectCreatable)
