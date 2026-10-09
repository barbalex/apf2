import { useContext } from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { FaPlus, FaEye } from 'react-icons/fa6'
import { useNavigate, useLocation } from 'react-router'

import { ErrorBoundary } from '../../ErrorBoundary.tsx'
import { UploaderContext } from '../../../../UploaderContext.ts'
import type { FileNode } from '../types.ts'

export const ListMenus = ({ files }: { files: FileNode[] }) => {
  const navigate = useNavigate()
  const { search } = useLocation()
  const uploaderCtx = useContext(UploaderContext)
  const api = uploaderCtx?.current?.getAPI?.()

  const firstFileId = files?.[0]?.fileId

  const onClickPreview = () => void navigate(`${firstFileId}/Vorschau${search}`)

  return (
    <ErrorBoundary>
      <Tooltip
        key="vorschau_oeffnen"
        title="Vorschau öffnen"
      >
        <span>
          <IconButton
            onClick={onClickPreview}
            disabled={!firstFileId}
          >
            <FaEye />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip
        key="dateien_hochladen"
        title="Dateien hochladen"
      >
        <IconButton onClick={() => api?.initFlow()}>
          <FaPlus />
        </IconButton>
      </Tooltip>
    </ErrorBoundary>
  )
}
