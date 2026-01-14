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

import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import { FilterButton } from '../../../shared/MenuBar/FilterButton.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { moveTo } from '../../../../modules/moveTo/index.ts'
import { copyTo } from '../../../../modules/copyTo/index.ts'
import { closeLowerNodes } from '../../TreeContainer/closeLowerNodes.ts'
import { MobxContext } from '../../../../mobxContext.js'

import type { TpopkontrzaehlEinheitWerteCode } from '../../../../models/apflora/TpopkontrzaehlEinheitWerteCode.ts'

interface CreateTpopkontrzaehlEinheitWerteResult {
  data: {
    createTpopkontrzaehlEinheitWerte: {
      tpopkontrzaehlEinheitWerte: {
        id: string
      }
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
  const { projId, tpopkontrzaehlEinheitWerteId } = useParams()

  const store = useContext(MobxContext)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const onClickAdd = async () => {
    let result: CreateTpopkontrzaehlEinheitWerteResult | undefined
    try {
      result = await apolloClient.mutate<
        CreateTpopkontrzaehlEinheitWerteResult['data']
      >({
        mutation: gql`
          mutation createTpopkontrzaehlEinheitWerteForTpopkontrzaehlEinheitWerteForm {
            createTpopkontrzaehlEinheitWerte(
              input: { tpopkontrzaehlEinheitWerte: {} }
            ) {
              tpopkontrzaehlEinheitWerte {
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
      queryKey: [`treeTpopkontrzaehlEinheitWerte`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeRoot`],
    })
    const id =
      result?.data?.createTpopkontrzaehlEinheitWerte?.tpopkontrzaehlEinheitWerte
        ?.id
    navigate(`./${id}${search}`)
  }

  return (
    <ErrorBoundary>
      <MenuBar>
        {!!toggleFilterInput && (
          <FilterButton toggleFilterInput={toggleFilterInput} />
        )}
        <Tooltip title="Neue Zähl-Einheit erstellen">
          <IconButton onClick={onClickAdd}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
      </MenuBar>
    </ErrorBoundary>
  )
})
