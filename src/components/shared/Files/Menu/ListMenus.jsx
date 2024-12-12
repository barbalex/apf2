import { useCallback, useContext, memo } from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { FaPlus, FaEye } from 'react-icons/fa6'
import { useNavigate, useLocation } from 'react-router'

import { ErrorBoundary } from '../../ErrorBoundary.jsx'
import { UploaderContext } from '../../../../UploaderContext.js'

export const ListMenus = memo(({ files }) => {
  const navigate = useNavigate()
  const { search } = useLocation()
  const uploaderCtx = useContext(UploaderContext)
  const api = uploaderCtx?.current?.getAPI?.()

  const firstFileId = files?.[0]?.fileId

  const onClickPreview = useCallback(() => {
    navigate(`${firstFileId}/Vorschau${search}`)
  }, [firstFileId, search, navigate])

  return (
    <ErrorBoundary>
      <Tooltip
        key="vorschau_oeffnen"
        title="Vorschau öffnen"
      >
        <IconButton
          onClick={onClickPreview}
          disabled={!firstFileId}
        >
          <FaEye />
        </IconButton>
      </Tooltip>
      <Tooltip
        key="dateien_hochladen"
        title="Dateien hochladen"
      >
        <IconButton onClick={api?.initFlow}>
          <FaPlus />
        </IconButton>
      </Tooltip>
    </ErrorBoundary>
  )
})
