import { useQueryClient } from '@tanstack/react-query'
import { FaMap } from 'react-icons/fa6'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { uniq } from 'es-toolkit'
import { useAtomValue, useSetAtom } from 'jotai'

import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import { FilterButton } from '../../../shared/MenuBar/FilterButton.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { useProjekteTabs } from '../../../../modules/useProjekteTaps.ts'
import {
  mapActiveApfloraLayersAtom,
  setMapActiveApfloraLayersAtom,
} from '../../../../store/index.ts'

interface MenuProps {
  apfloraLayer?: string
  toggleFilterInput?: () => void
}

const iconStyle = { color: 'white' }

// TODO: how to pass both props?
// TODO: need to add menu to other beobs to enable filtering
export const Menu = ({ apfloraLayer, toggleFilterInput }: MenuProps) => {
  const tsQueryClient = useQueryClient()

  const activeApfloraLayers = useAtomValue(mapActiveApfloraLayersAtom)
  const setActiveApfloraLayers = useSetAtom(setMapActiveApfloraLayersAtom)

  const [projekteTabs, setProjekteTabs] = useProjekteTabs()
  const showMapIfNotYetVisible = (projekteTabs: string[]) => {
    const isVisible = projekteTabs.includes('karte')
    if (!isVisible) {
      setProjekteTabs([...projekteTabs, 'karte'])
    }
  }

  const onClickShowOnMap = () => {
    showMapIfNotYetVisible(projekteTabs)
    setActiveApfloraLayers(uniq([...activeApfloraLayers, apfloraLayer]))
  }

  return (
    <ErrorBoundary>
      <MenuBar>
        {!!toggleFilterInput && (
          <FilterButton toggleFilterInput={toggleFilterInput} />
        )}
        <Tooltip title="Zeige auf Karte">
          <IconButton onClick={onClickShowOnMap}>
            <FaMap style={iconStyle} />
          </IconButton>
        </Tooltip>
      </MenuBar>
    </ErrorBoundary>
  )
}
