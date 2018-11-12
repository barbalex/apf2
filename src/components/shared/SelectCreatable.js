// @flow
import React from 'react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import CreatableSelect from 'react-select/lib/Creatable'
import styled from 'styled-components'

const Container = styled.div`
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
const StyledSelect = styled(CreatableSelect)`
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
  } /*
  > div > div > div {
    margin-left: 0;
  }*/
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

const enhance = compose(
  withState('stateValue', 'setStateValue', null),
  withHandlers({
    onChange: ({ saveToDb, name }) => option => {
      const fakeEvent = {
        target: {
          name,
          value: option ? option.value : null,
        },
      }
      saveToDb(fakeEvent)
    },
    onInputChange: ({ setStateValue }) => value => setStateValue(value),
    onBlur: ({ saveToDb, stateValue, name }) => event => {
      if (stateValue) {
        const fakeEvent = {
          target: {
            name,
            value: stateValue,
          },
        }
        saveToDb(fakeEvent)
      }
    },
  }),
)

const SharedSelectCreatable = ({
  value,
  field = '',
  label,
  name,
  error,
  options: optionsIn,
  stateValue,
  onChange,
  onInputChange,
  onBlur,
  maxHeight = null,
  noCaret = false,
}: {
  value?: ?number | ?string,
  field?: string,
  label: string,
  name: string,
  error: string,
  options: Array<Object>,
  stateValue: Number | String,
  onChange: () => void,
  onInputChange: () => void,
  onBlur: () => void,
  maxHeight?: number,
  noCaret: boolean,
}) => {
  // need to add value to options list if it is not yet included
  const valuesArray = optionsIn.map(o => o.value)
  const options = [...optionsIn]
  if (value && !valuesArray.includes(value)) {
    options.push({ label: value, value })
  }
  return (
    <Container>
      {label && <Label>{label}</Label>}
      <StyledSelect
        id={field}
        name={field}
        defaultValue={options.find(o => o.value === value)}
        options={options}
        onChange={onChange}
        onBlur={onBlur}
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
      {error && <Error>{error}</Error>}
    </Container>
  )
}

export default enhance(SharedSelectCreatable)
