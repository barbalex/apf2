import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { FaPlus } from 'react-icons/fa6'

import { MenuBar } from '../../../../shared/MenuBar/index.tsx'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.tsx'

const iconStyle = { color: 'white' }

export const HistorienMenu = ({ onAdd }) => (
  <ErrorBoundary>
    <MenuBar>
      <Tooltip title="neue Historien-Zeile hinzufügen">
        <IconButton onClick={onAdd}>
          <FaPlus style={iconStyle} />
        </IconButton>
      </Tooltip>
    </MenuBar>
  </ErrorBoundary>
)
