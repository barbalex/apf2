import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { FaPlus, FaFolderTree } from 'react-icons/fa6'
import { RiFolderCloseFill } from 'react-icons/ri'
import { MdOutlineMoveDown, MdContentCopy } from 'react-icons/md'
import { BsSignStopFill } from 'react-icons/bs'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { observer } from 'mobx-react-lite'
import { useAtom } from 'jotai'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { FilterButton } from '../../../shared/MenuBar/FilterButton.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { openLowerNodes } from '../../TreeContainer/openLowerNodes/index.ts'
import { closeLowerNodes } from '../../TreeContainer/closeLowerNodes.ts'
import { moveTo } from '../../../../modules/moveTo/index.js'
import { copyTo } from '../../../../modules/copyTo/index.js'
import { MobxContext } from '../../../../mobxContext.js'
import { showTreeMenusAtom } from '../../../../JotaiStore/index.js'

import type { TpopId } from '../../../../models/apflora/TpopId.ts'
import type { PopId } from '../../../../models/apflora/PopId.ts'

interface CreateTpopResult {
  data: {
    createTpop: {
      tpop: {
        id: TpopId
        popId: PopId
      }
    }
  }
}

interface MenuProps {
  toggleFilterInput?: () => void
}

const iconStyle = { color: 'white' }

export const Menu = observer(({ toggleFilterInput }: MenuProps) => {
  const { search } = useLocation()
  const navigate = useNavigate()
  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()
  const { projId, apId, popId } = useParams()
  const store = useContext(MobxContext)
  const { setMoving, moving, setCopying, copying } = store

  const onClickAdd = async () => {
    let result: CreateTpopResult | undefined
    try {
      result = await apolloClient.mutate<CreateTpopResult['data']>({
        mutation: gql`
          mutation createTpopForTpopsForm($popId: UUID!) {
            createTpop(input: { tpop: { popId: $popId } }) {
              tpop {
                id
                popId
              }
            }
          }
        `,
        variables: {
          popId,
        },
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
      queryKey: [`treeTpop`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treePopFolders`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treePop`],
    })
    const id = result?.data?.createTpop?.tpop?.id
    navigate(`./${id}${search}`)
  }

  const onClickOpenLowerNodes = () =>
    openLowerNodes({
      id: popId,
      projId,
      apId,
      popId,
      apolloClient,
      store,
      menuType: 'tpopFolder',
    })

  const onClickCloseLowerNodes = () =>
    closeLowerNodes({
      url: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
      ],
      store,
      search,
    })

  const isTpopMoving = moving.table === 'tpop'
  const onClickMoveTpopToHere = () =>
    moveTo({
      id: popId,
      apolloClient,
      store,
    })

  const onClickStopMovingTpop = () =>
    setMoving({
      table: null,
      id: '99999999-9999-9999-9999-999999999999',
      label: null,
      toTable: null,
      fromParentId: null,
    })

  const isCopyingTpop = copying.table === 'tpop'

  const onClickCopyTpopToHere = () =>
    copyTo({
      parentId: popId,
      apolloClient,
      store,
    })

  const onClickStopCopyingTpop = () =>
    setCopying({
      table: null,
      id: '99999999-9999-9999-9999-999999999999',
      label: null,
      withNextLevel: false,
    })

  const [showTreeMenus] = useAtom(showTreeMenusAtom)

  return (
    <ErrorBoundary>
      <MenuBar rerenderer={`${isTpopMoving}/${isCopyingTpop}/${showTreeMenus}`}>
        {!!toggleFilterInput && (
          <FilterButton toggleFilterInput={toggleFilterInput} />
        )}
        <Tooltip title="Neue Teil-Population erstellen">
          <IconButton onClick={onClickAdd}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
        {showTreeMenus && (
          <Tooltip title="Ordner im Navigationsbaum öffnen">
            <IconButton onClick={onClickOpenLowerNodes}>
              <FaFolderTree style={iconStyle} />
            </IconButton>
          </Tooltip>
        )}
        {showTreeMenus && (
          <Tooltip title="Ordner im Navigationsbaum schliessen">
            <IconButton onClick={onClickCloseLowerNodes}>
              <RiFolderCloseFill style={iconStyle} />
            </IconButton>
          </Tooltip>
        )}
        {isTpopMoving && (
          <Tooltip title={`Verschiebe '${moving.label}' zu dieser Population`}>
            <IconButton onClick={onClickMoveTpopToHere}>
              <MdOutlineMoveDown style={iconStyle} />
            </IconButton>
          </Tooltip>
        )}
        {isCopyingTpop && (
          <Tooltip title={`Kopiere '${copying.label}' in diese Population`}>
            <IconButton onClick={onClickCopyTpopToHere}>
              <MdContentCopy style={iconStyle} />
            </IconButton>
          </Tooltip>
        )}
        {isCopyingTpop && (
          <Tooltip title={`Kopieren von '${copying.label}' abbrechen`}>
            <IconButton onClick={onClickStopCopyingTpop}>
              <BsSignStopFill style={iconStyle} />
            </IconButton>
          </Tooltip>
        )}
      </MenuBar>
    </ErrorBoundary>
  )
})
