import { memo, useCallback, useContext, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { FaMap } from 'react-icons/fa6'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import uniq from 'lodash/uniq'
import { observer } from 'mobx-react-lite'
import { useAtom } from 'jotai'

import { MenuBar, buttonWidth } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { isMobilePhone } from '../../../../modules/isMobilePhone.js'
import { useSearchParamsState } from '../../../../modules/useSearchParamsState.js'
import { StoreContext } from '../../../../storeContext.js'
import { LabelFilter, labelFilterWidth } from '../../../shared/LabelFilter.jsx'
import { listLabelFilterIsIconAtom } from '../../../../JotaiStore/index.js'

const iconStyle = { color: 'white' }

export const Menu = memo(
  observer(({ apfloraLayer }) => {
    const tanstackQueryClient = useQueryClient()

    const store = useContext(StoreContext)
    const { setActiveApfloraLayers, activeApfloraLayers } = store

    const [projekteTabs, setProjekteTabs] = useSearchParamsState(
      'projekteTabs',
      isMobilePhone() ? ['tree'] : ['tree', 'daten'],
    )
    const showMapIfNotYetVisible = useCallback(
      (projekteTabs) => {
        const isVisible = projekteTabs.includes('karte')
        if (!isVisible) {
          setProjekteTabs([...projekteTabs, 'karte'])
        }
      },
      [setProjekteTabs],
    )
    const onClickShowOnMap = useCallback(() => {
      showMapIfNotYetVisible(projekteTabs)
      setActiveApfloraLayers(uniq([...activeApfloraLayers, apfloraLayer]))
    }, [
      showMapIfNotYetVisible,
      projekteTabs,
      setActiveApfloraLayers,
      activeApfloraLayers,
    ])

    const [labelFilterIsIcon] = useAtom(listLabelFilterIsIconAtom)
    const widths = useMemo(
      () =>
        labelFilterIsIcon ?
          [buttonWidth, buttonWidth]
        : [labelFilterWidth, buttonWidth],
      [labelFilterIsIcon],
    )

    return (
      <ErrorBoundary>
        <MenuBar
          bgColor="#388e3c"
          color="white"
          widths={widths}
        >
          <LabelFilter />
          <Tooltip title="Zeige auf Karte">
            <IconButton onClick={onClickShowOnMap}>
              <FaMap style={iconStyle} />
            </IconButton>
          </Tooltip>
        </MenuBar>
      </ErrorBoundary>
    )
  }),
)
