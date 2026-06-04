import { useSetAtom } from 'jotai'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { FaPlus } from 'react-icons/fa6'
import { MdOutlineMoveDown, MdContentCopy } from 'react-icons/md'
import { RiFolderCloseFill } from 'react-icons/ri'
import { BsSignStopFill } from 'react-icons/bs'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import { FilterButton } from '../../../shared/MenuBar/FilterButton.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { moveTo } from '../../../../modules/moveTo/index.ts'
import { copyTo } from '../../../../modules/copyTo/index.ts'
import { closeLowerNodes } from '../../TreeContainer/closeLowerNodes.ts'

import type { EkAbrechnungstypWerteCode } from '../../../../models/apflora/EkAbrechnungstypWerte.ts'

import {
  addNotificationAtom,
} from '../../../../store/index.ts'


interface CreateEkAbrechnungstypWerteResult {
  data?: {
    createEkAbrechnungstypWerte?: {
      ekAbrechnungstypWerte?: {
        id: EkAbrechnungstypWerteCode
      }
    }
  }
}

interface MenuProps {
  toggleFilterInput?: () => void
}

const iconStyle = { color: 'white' }

export const Menu = ({ toggleFilterInput }: MenuProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const { search, pathname } = useLocation()
  const navigate = useNavigate()
  const { projId, ekAbrechnungstypWerteId } = useParams<{
    projId: string
    ekAbrechnungstypWerteId: string
  }>()

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const onClickAdd = async () => {
    let result: CreateEkAbrechnungstypWerteResult | undefined
    try {
      result = await apolloClient.mutate({
        mutation: gql`
          mutation createEkAbrechnungstypWerteForEkAbrechnungstypWerteForm {
            createEkAbrechnungstypWerte(input: { ekAbrechnungstypWerte: {} }) {
              ekAbrechnungstypWerte {
                id
              }
            }
          }
        `,
      })
    } catch (error) {
      return addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    tsQueryClient.invalidateQueries({
      queryKey: [`treeEkAbrechnungstypWerte`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeRoot`],
    })
    const id =
      result?.data?.createEkAbrechnungstypWerte?.ekAbrechnungstypWerte?.id
    navigate(`./${id}${search}`)
  }

  return (
    <ErrorBoundary>
      <MenuBar>
        {!!toggleFilterInput && (
          <FilterButton toggleFilterInput={toggleFilterInput} />
        )}
        <Tooltip title="Neuen Abrechnungstyp erstellen">
          <IconButton onClick={onClickAdd}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
      </MenuBar>
    </ErrorBoundary>
  )
}
