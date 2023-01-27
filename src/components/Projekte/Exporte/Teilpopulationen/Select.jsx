import React, { useCallback } from 'react'
import Select from 'react-select'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

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
const StyledSelect = styled(Select)`
  > div {
    background-color: rgba(0, 0, 0, 0) !important;
    border-bottom-color: rgba(0, 0, 0, 0.1);
    border-top: none;
    border-left: none;
    border-right: none;
    border-radius: 0;
  }
  > div > div {
    padding-left: 0;
  }
  > div > div > div {
    margin-left: 0;
  }
  > div:focus-within {
    border-bottom-color: rgba(28, 80, 31, 1) !important;
    box-shadow: none;
  }
  > div:hover {
    border-bottom-width: 2px;
  }
  .react-select__menu,
  .react-select__menu-list {
    height: 130px;
    height: ${props => (props.maxheight ? `${props.maxheight}px` : 'unset')};
  }
`

const SharedSelect = ({
  value,
  field = '',
  label,
  error,
  options,
  saveToDb,
  maxHeight = null,
}) => {
  const onChange = useCallback(
    option => saveToDb(option ? option.value : null),
    [saveToDb],
  )

  return (
    <Container>
      {label && <Label>{label}</Label>}
      <StyledSelect
        id={field}
        name={field}
        defaultValue={options.find(o => o.value === value)}
        options={options}
        onChange={onChange}
        hideSelectedOptions
        placeholder=""
        isClearable
        isSearchable
        noOptionsMessage={() => '(keine)'}
        maxheight={maxHeight}
        classNamePrefix="react-select"
      />
      {error && <Error>{error}</Error>}
    </Container>
  )
}

export default observer(SharedSelect)
