import React, { useCallback } from 'react'
import Select from 'react-select'
import styled from 'styled-components'

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
const StyledSelect = styled(Select)`
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

const SharedSelect = ({
  field,
  form,
  label,
  labelSize,
  options,
  loading,
  maxHeight = null,
  noCaret = false,
}) => {
  const { onChange, onBlur, value, name } = field
  const { errors, handleSubmit } = form
  const error = errors[name]

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

  // show ... while options are loading
  const loadingOptions = [{ value, label: '...' }]
  const optionsToUse = loading && value ? loadingOptions : options
  const selectValue = optionsToUse.find(o => o.value === value)

  return (
    <Container data-id={name}>
      {label && <Label labelsize={labelSize}>{label}</Label>}
      <StyledSelect
        id={name}
        name={name}
        value={selectValue}
        options={optionsToUse}
        onChange={onMyChange}
        hideSelectedOptions
        placeholder=""
        isClearable
        isSearchable
        noOptionsMessage={() => '(keine)'}
        maxheight={maxHeight}
        classNamePrefix="react-select"
        nocaret={noCaret}
      />
      {error && <Error>{error}</Error>}
    </Container>
  )
}

export default SharedSelect
