// @flow
import React from 'react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import Select from 'react-select'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`
const Label = styled.div`
  font-size: 12px;
  color: rgb(0, 0, 0, 0.54);
`
const StyledSelect = styled(Select)`
  margin-bottom: 12px;
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
`

const enhance = compose(
  withHandlers({
    onChange: ({ saveToDb }) => option =>
      saveToDb(option ? option.value : null),
  }),
)

const SharedSelect = ({
  value,
  field,
  label,
  options,
  onChange,
}: {
  value?: ?number | ?string,
  field: string,
  label: string,
  options: Array<Object>,
  onChange: () => void,
}) => (
  <Container>
    <Label>{label}</Label>
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
    />
  </Container>
)

export default enhance(SharedSelect)
