import { memo, forwardRef } from 'react'
import Tooltip from '@mui/material/Tooltip'
import { useAtom } from 'jotai'

import { isDesktopViewAtom } from '../../../JotaiStore/index.js'
import { Label } from './Label.jsx'

export const LabelWrapper = memo(
  forwardRef(({ navData, outerContainerRef, labelStyle }, labelRef) => {
    const [isDesktopView] = useAtom(isDesktopViewAtom)

    if (isDesktopView) {
      return (
        <Tooltip title={navData.label}>
          <Label
            navData={navData}
            outerContainerRef={outerContainerRef}
            labelStyle={labelStyle}
            ref={labelRef}
          />
        </Tooltip>
      )
    }

    return (
      <Label
        navData={navData}
        outerContainerRef={outerContainerRef}
        labelStyle={labelStyle}
        ref={labelRef}
      />
    )
  }),
)
