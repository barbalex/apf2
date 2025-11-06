import FormGroup from '@mui/material/FormGroup'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Checkbox from '@mui/material/Checkbox'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import { InfoWithPopover } from './InfoWithPopover.jsx'
import { container, formControl } from './CheckboxWithInfo.module.css'

const StyledFormControlLabel = styled(FormControlLabel)`
  margin-top: -10px;
  .MuiFormControlLabel-label {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.5);
    user-select: none;
  }
`

export const CheckboxWithInfo = observer(
  ({ value = null, label, name, popover, saveToDb, error }) => {
    const onCheck = (e, val) => saveToDb(val)

    return (
      <div className={container}>
        <FormControl
          component="fieldset"
          error={!!error}
          aria-describedby={`${label}ErrorText`}
          variant="standard"
          className={formControl}
        >
          <FormGroup>
            <StyledFormControlLabel
              label={label}
              control={
                <Checkbox
                  checked={value}
                  onChange={onCheck}
                  value={label}
                  color="primary"
                  inputProps={{ 'data-id': name }}
                />
              }
            />
          </FormGroup>
          {!!error && (
            <FormHelperText id={`${label}ErrorText`}>{error}</FormHelperText>
          )}
        </FormControl>
        <div>
          <InfoWithPopover name={name}>{popover}</InfoWithPopover>
        </div>
      </div>
    )
  },
)
