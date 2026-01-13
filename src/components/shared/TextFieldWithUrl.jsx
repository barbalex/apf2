/**
 * not used any more
 * used to be used for berichte
 */

import { MdOpenInNew } from 'react-icons/md'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import { green } from '@mui/material/colors'
import getUrls from 'get-urls'

import {
  container,
  openInNewIcon,
  formControl,
} from './TextFieldWithUrl.module.css'

export const TextFieldWithUrl = ({
  field,
  form,
  label,
  type = 'text',
  multiLine = false,
  disabled = false,
}) => {
  const { onChange, onBlur, value, name } = field
  const { error: errors, handleSubmit } = form
  const error = errors?.[name]

  const urls = value ? getUrls(value) : []

  const onKeyPress = (event) => event.key === 'Enter' && handleSubmit()

  return (
    <div className={container}>
      <FormControl
        disabled={disabled}
        fullWidth
        error={!!error}
        aria-describedby={`${label}ErrorText`}
        variant="standard"
        className={formControl}
      >
        <InputLabel
          htmlFor={name}
          shrink
        >
          {`${label} (gültige URL's beginnen mit "https://", "//" oder "www.")`}
        </InputLabel>
        <Input
          id={name}
          data-id={name}
          value={value || value === 0 ? value : ''}
          type={type}
          multiline={multiLine}
          onChange={onChange}
          onBlur={onBlur}
          onKeyPress={onKeyPress}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        {!!error && (
          <FormHelperText id={`${label}ErrorText`}>{error}</FormHelperText>
        )}
      </FormControl>
      {Array.from(urls).map((url, index) => (
        <div
          key={index}
          title={`${url} öffnen`}
        >
          <MdOpenInNew
            onClick={() => window.open(url, '_blank')}
            data-id="open-url"
            className={openInNewIcon}
          />
        </div>
      ))}
    </div>
  )
}
