import { useState, useEffect, useRef } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Input from '@mui/material/Input'
import Tooltip from '@mui/material/Tooltip'
import { MdClear } from 'react-icons/md'

import {
  ekPlanFilterApAtom,
  ekPlanFilterPopNrAtom,
  ekPlanFilterPopNameAtom,
  ekPlanFilterPopStatusAtom,
  ekPlanFilterNrAtom,
  ekPlanFilterGemeindeAtom,
  ekPlanFilterFlurnameAtom,
  ekPlanFilterStatusAtom,
  ekPlanFilterBekanntSeitAtom,
  ekPlanFilterLv95XAtom,
  ekPlanFilterLv95YAtom,
  ekPlanFilterEkfKontrolleurAtom,
  ekPlanSetFilterApAtom,
  ekPlanSetFilterPopNrAtom,
  ekPlanSetFilterPopNameAtom,
  ekPlanSetFilterPopStatusAtom,
  ekPlanSetFilterNrAtom,
  ekPlanSetFilterGemeindeAtom,
  ekPlanSetFilterFlurnameAtom,
  ekPlanSetFilterStatusAtom,
  ekPlanSetFilterBekanntSeitAtom,
  ekPlanSetFilterLv95XAtom,
  ekPlanSetFilterLv95YAtom,
  ekPlanSetFilterEkfKontrolleurAtom,
  ekPlanSetFilterEmptyEkfrequenzAtom,
  ekPlanSetFilterEmptyEkfrequenzStartjahrAtom,
} from '../../../../store/index.ts'

const filterAtomMap = {
  ap: ekPlanFilterApAtom,
  popNr: ekPlanFilterPopNrAtom,
  popName: ekPlanFilterPopNameAtom,
  popStatus: ekPlanFilterPopStatusAtom,
  nr: ekPlanFilterNrAtom,
  gemeinde: ekPlanFilterGemeindeAtom,
  flurname: ekPlanFilterFlurnameAtom,
  status: ekPlanFilterStatusAtom,
  bekanntSeit: ekPlanFilterBekanntSeitAtom,
  lv95X: ekPlanFilterLv95XAtom,
  lv95Y: ekPlanFilterLv95YAtom,
  ekfKontrolleur: ekPlanFilterEkfKontrolleurAtom,
}

const setFilterAtomMap = {
  ap: ekPlanSetFilterApAtom,
  popNr: ekPlanSetFilterPopNrAtom,
  popName: ekPlanSetFilterPopNameAtom,
  popStatus: ekPlanSetFilterPopStatusAtom,
  nr: ekPlanSetFilterNrAtom,
  gemeinde: ekPlanSetFilterGemeindeAtom,
  flurname: ekPlanSetFilterFlurnameAtom,
  status: ekPlanSetFilterStatusAtom,
  bekanntSeit: ekPlanSetFilterBekanntSeitAtom,
  lv95X: ekPlanSetFilterLv95XAtom,
  lv95Y: ekPlanSetFilterLv95YAtom,
  ekfKontrolleur: ekPlanSetFilterEkfKontrolleurAtom,
}

const valForStore = (valPassed: string): string | null => {
  if (!valPassed) return null
  return valPassed
}
const valForState = (valPassed: unknown) => {
  let val = valPassed
  if (!val && val !== 0) val = ''

  return val
}

export const TextFilter = ({
  column,
  closeMenu,
}: {
  column: { name: string }
  closeMenu: () => void
}) => {
  const setFilterEmptyEkfrequenz = useSetAtom(
    ekPlanSetFilterEmptyEkfrequenzAtom,
  )
  const setFilterEmptyEkfrequenzStartjahr = useSetAtom(
    ekPlanSetFilterEmptyEkfrequenzStartjahrAtom,
  )
  const { name } = column

  const type =
    (
      [
        'popNr',
        'nr',
        'bekanntSeit',
        'lv95X',
        'lv95Y',
        'ekfrequenzStartjahr',
      ].includes(name)
    ) ?
      'number'
    : 'text'

  const filterAtom = filterAtomMap[name as keyof typeof filterAtomMap]
  const setFilterAtom = setFilterAtomMap[name as keyof typeof setFilterAtomMap]
  const storeValue = useAtomValue(filterAtom ?? ekPlanFilterApAtom)
  const storeSetFunction = useSetAtom(setFilterAtom ?? ekPlanSetFilterApAtom)

  const [localValue, setLocalValue] = useState(() =>
    String(valForState(storeValue) ?? ''),
  )
  const [prevStoreValue, setPrevStoreValue] = useState(storeValue)
  if (prevStoreValue !== storeValue) {
    setPrevStoreValue(storeValue)
    setLocalValue(String(valForState(storeValue) ?? ''))
  }

  const inputRef = useRef<HTMLInputElement | null>(null)

  const onChange = (event: { target: { value: string } }) =>
    setLocalValue(valForState(event.target.value) as string)

  const onBlur = (event: { target: { value: string } }) => {
    if (
      event.target.value != storeValue &&  
      !(event.target.value === '' && storeValue === null)
    ) {
      storeSetFunction(valForStore(event.target.value) as never)
      if (name === 'ekfrequenz') setFilterEmptyEkfrequenz(false)
      if (name === 'ekfrequenzStartjahr')
        setFilterEmptyEkfrequenzStartjahr(false)
      closeMenu()
    }
  }

  const onClickEmpty = (event: { stopPropagation: () => void }) => {
    // prevent blur event which would close menu
    event.stopPropagation()
    if (localValue) {
      setLocalValue('')
    }
    inputRef.current?.focus()
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [])
  const onKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    // need to stop propagation
    // menu focuses next label if that's first character is pressed
    // this blurs the textfield, so the filter can't be entered
    // See: https://github.com/mui/material-ui/issues/36133
    // https://github.com/barbalex/apf2/issues/609
    event.stopPropagation()
    if (event.key === 'Enter') {
      onBlur({ target: { value: (event.target as HTMLInputElement).value } })
    }
  }

  return (
    <FormControl>
      <InputLabel
        htmlFor="EkPlanHeaderFilter"
        variant="standard"
      >
        Filter
      </InputLabel>
      <Input
        id="EkPlanHeaderFilter"
        inputRef={inputRef}
        type={type}
        value={localValue}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        endAdornment={
          <InputAdornment position="end">
            <Tooltip title="Filter leeren">
              <IconButton
                aria-label="Filter leeren"
                onClick={onClickEmpty}
                size="large"
              >
                <MdClear />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        }
      />
    </FormControl>
  )
}
