import { useContext } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { FaMap } from 'react-icons/fa6'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { uniq } from 'es-toolkit'
import { observer } from 'mobx-react-lite'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { FilterButton } from '../../../shared/MenuBar/FilterButton.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { useProjekteTabs } from '../../../../modules/useProjekteTabs.js'
import { MobxContext } from '../../../../mobxContext.js'

const iconStyle = { color: 'white' }

// TODO: how to pass both props?
// TODO: need to add menu to other beobs to enable filtering
export const Menu = observer(({ apfloraLayer, toggleFilterInput }) => {
  const tsQueryClient = useQueryClient()

  const store = useContext(MobxContext)
  const { setActiveApfloraLayers, activeApfloraLayers } = store

  const [projekteTabs, setProjekteTabs] = useProjekteTabs()
  const showMapIfNotYetVisible = (projekteTabs) => {
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
})
