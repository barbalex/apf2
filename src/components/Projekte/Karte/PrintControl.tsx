import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { useMap } from 'react-leaflet'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { MdPrint } from 'react-icons/md'

import { printMap } from './mapExport.ts'

import { addNotificationAtom, setMapHideControlsAtom } from '../../../store/index.ts'

import styles from './FullscreenControl.module.css'

// easyprint's size modes, translated like the old defaultSizeTitles
const SIZE_MODES = [
  { label: 'Aktuelle Grösse', pageSize: '' },
  { label: 'A4 quer', pageSize: 'A4 landscape' },
  { label: 'A4 hoch', pageSize: 'A4 portrait' },
] as const

export const PrintControl = () => {
  const map = useMap()
  const setHideMapControls = useSetAtom(setMapHideControlsAtom)
  const addNotification = useSetAtom(addNotificationAtom)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const print = async (pageSize: string) => {
    setAnchorEl(null)
    setHideMapControls(true)
    try {
      await printMap(map, pageSize)
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        options: { variant: 'error' },
      })
    } finally {
      setHideMapControls(false)
    }
  }

  return (
    <>
      <button
        title="drucken"
        className={styles.button}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <MdPrint />
      </button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {SIZE_MODES.map((mode) => (
          <MenuItem
            key={mode.label}
            onClick={() => void print(mode.pageSize)}
          >
            {mode.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
