import React, { useCallback } from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import InputAdornment from '@material-ui/core/InputAdornment'
import DeleteFilterIcon from '@material-ui/icons/DeleteSweep'
import styled from 'styled-components'

const StyledInput = styled(Input)`
  div hr {
    width: calc(100% - 20px) !important;
  }
  &:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
`
const StyledDeleteFilterIcon = styled(DeleteFilterIcon)`
  cursor: pointer;
  pointer-events: auto;
  padding-top: 5px;
  color: rgba(0, 0, 0, 0.7);
`

const Filter = ({ filter, setFilter }) => {
  const onChange = useCallback(e => setFilter(e.target.value))
  const onClickEmptyFilter = useCallback(() => setFilter(''))

  return (
    <FormControl fullWidth>
      <InputLabel htmlFor="filterInput">filtern</InputLabel>
      <StyledInput
        id="filterInput"
        value={filter}
        onChange={onChange}
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        endAdornment={
          !!filter ? (
            <InputAdornment
              position="end"
              onClick={onClickEmptyFilter}
              title="Filter entfernen"
            >
              <StyledDeleteFilterIcon />
            </InputAdornment>
          ) : null
        }
      />
    </FormControl>
  )
}

export default Filter
