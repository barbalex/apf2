import { apiInsert } from '../../../../modules/api.ts'
import { v7 as uuidv7 } from 'uuid'
import { useSetAtom } from 'jotai'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { FaPlus } from 'react-icons/fa6'
import { MdContentCopy } from 'react-icons/md'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import { FilterButton } from '../../../shared/MenuBar/FilterButton.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'

import {
  addNotificationAtom,
  setOpenChooseApToCopyEkfrequenzsFromAtom,
} from '../../../../store/index.ts'

interface MenuProps {
  toggleFilterInput?: () => void
}

const iconStyle = { color: 'white' }

// TODO: add menu to setOpenChooseApToCopyEkfrequenzsFrom
export const Menu = ({ toggleFilterInput }: MenuProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const { search } = useLocation()
  const navigate = useNavigate()
  const { apId } = useParams()

  const tsQueryClient = useQueryClient()

  const setOpenChooseApToCopyEkfrequenzsFrom = useSetAtom(
    setOpenChooseApToCopyEkfrequenzsFromAtom,
  )

  const onClickAdd = async () => {
    const newId = uuidv7()
    try {
      await apiInsert('ekfrequenz', {
        id: newId,
        ap_id: apId ?? '',
      })
    } catch (error) {
      return addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeEkfrequenz`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeApFolders`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeAp`],
    })
    const id = newId
    void navigate(`./${id}${search}`)
  }

  const onClickCopy = () => setOpenChooseApToCopyEkfrequenzsFrom(true)

  return (
    <ErrorBoundary>
      <MenuBar>
        {!!toggleFilterInput && (
          <FilterButton toggleFilterInput={toggleFilterInput} />
        )}
        <Tooltip title="Neue EK-Frequenz erstellen">
          <IconButton onClick={() => void onClickAdd()}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Aus anderer Art kopieren">
          <IconButton onClick={onClickCopy}>
            <MdContentCopy style={iconStyle} />
          </IconButton>
        </Tooltip>
      </MenuBar>
    </ErrorBoundary>
  )
}
