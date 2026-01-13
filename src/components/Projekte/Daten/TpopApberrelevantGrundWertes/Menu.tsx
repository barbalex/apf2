import { useContext } from 'react'
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
import { observer } from 'mobx-react-lite'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { FilterButton } from '../../../shared/MenuBar/FilterButton.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { moveTo } from '../../../../modules/moveTo/index.js'
import { copyTo } from '../../../../modules/copyTo/index.js'
import { closeLowerNodes } from '../../TreeContainer/closeLowerNodes.js'
import { MobxContext } from '../../../../mobxContext.js'

import type { TpopApberrelevantGrundWerteCode } from '../../../../generated/apflora/models.js'

interface CreateTpopApberrelevantGrundWerteResult {
  createTpopApberrelevantGrundWerte: {
    tpopApberrelevantGrundWerte: {
      id: TpopApberrelevantGrundWerteCode
    }
  }
}

interface MenuProps {
  toggleFilterInput?: () => void
}

const iconStyle = { color: 'white' }

export const Menu = observer(({ toggleFilterInput }: MenuProps) => {
  const { search, pathname } = useLocation()
  const navigate = useNavigate()
  const { projId, tpopApberrelevantGrundWerteId } = useParams()

  const store = useContext(MobxContext)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const onClickAdd = async () => {
    let result
    try {
      result =
        await apolloClient.mutate<CreateTpopApberrelevantGrundWerteResult>({
          mutation: gql`
            mutation createTpopApberrelevantGrundWerteForTpopApberrelevantGrundWerteForm {
              createTpopApberrelevantGrundWerte(
                input: { tpopApberrelevantGrundWerte: {} }
              ) {
                tpopApberrelevantGrundWerte {
                  id
                }
              }
            }
          `,
        })
    } catch (error) {
      return store.enqueNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopApberrelevantGrundWerte`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeRoot`],
    })
    const id =
      result?.data?.createTpopApberrelevantGrundWerte
        ?.tpopApberrelevantGrundWerte?.id
    navigate(`./${id}${search}`)
  }

  return (
    <ErrorBoundary>
      <MenuBar>
        {!!toggleFilterInput && (
          <FilterButton toggleFilterInput={toggleFilterInput} />
        )}
        <Tooltip title="Neuen Grund erstellen">
          <IconButton onClick={onClickAdd}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
      </MenuBar>
    </ErrorBoundary>
  )
})
