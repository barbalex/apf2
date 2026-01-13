import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import { MdDeleteSweep } from 'react-icons/md'

import styles from './Filter.module.css'

export const Filter = ({ filter, setFilter }) => {
  const onChange = (e) => setFilter(e.target.value)
  const onClickEmptyFilter = () => setFilter('')

  return (
    <FormControl
      fullWidth
      variant="standard"
    >
      <InputLabel htmlFor="filterInput">filtern</InputLabel>
      <Input
        id="filterInput"
        value={filter}
        onChange={onChange}
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        endAdornment={
          filter ?
            <InputAdornment
              position="end"
              onClick={onClickEmptyFilter}
              title="Filter entfernen"
            >
              <MdDeleteSweep className={styles.deleteFilter} />
            </InputAdornment>
          : null
        }
        className={styles.input}
      />
    </FormControl>
  )
}
