import FormGroup from '@mui/material/FormGroup'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Checkbox from '@mui/material/Checkbox'
import { styled } from '@mui/material/styles'
import { observer } from 'mobx-react-lite'

import { InfoWithPopover } from './InfoWithPopover.jsx'
import styles from './CheckboxWithInfo.module.css'

// https://mui.com/material-ui/react-menu/#customization
const StyledFormControlLabel = styled((props) => (
  <FormControlLabel {...props} />
))(() => ({
  marginTop: -10,
  '& .MuiFormControlLabel-label': {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.5)',
    userSelect: 'none',
  },
}))

export const CheckboxWithInfo = observer(
  ({ value = null, label, name, popover, saveToDb, error }) => {
    const onCheck = (e, val) => saveToDb(val)

    return (
      <div className={styles.container}>
        <FormControl
          component="fieldset"
          error={!!error}
          aria-describedby={`${label}ErrorText`}
          variant="standard"
          className={styles.formControl}
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
