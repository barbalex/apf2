import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { FaPlus } from 'react-icons/fa6'
import { MdOutlineMoveDown, MdContentCopy } from 'react-icons/md'
import { BsSignStopFill } from 'react-icons/bs'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { observer } from 'mobx-react-lite'

import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import { FilterButton } from '../../../shared/MenuBar/FilterButton.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { moveTo } from '../../../../modules/moveTo/index.js'
import { copyTo } from '../../../../modules/copyTo/index.js'
import { MobxContext } from '../../../../mobxContext.js'

import type { TpopmassnId } from '../../../../models/apflora/TpopmassnId.ts'
import type { TpopId } from '../../../../models/apflora/TpopId.ts'

interface CreateTpopmassnResult {
  data: {
    createTpopmassn: {
      tpopmassn: {
        id: TpopmassnId
        tpopId: TpopId
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
  const { tpopId } = useParams()

  const store = useContext(MobxContext)
  const { setMoving, moving, setCopying, copying } = store

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const onClickAdd = async () => {
    let result: CreateTpopmassnResult | undefined
    try {
      result = await apolloClient.mutate<CreateTpopmassnResult['data']>({
        mutation: gql`
          mutation createTpopmassnForTpopmassnsForm($tpopId: UUID!) {
            createTpopmassn(input: { tpopmassn: { tpopId: $tpopId } }) {
              tpopmassn {
                id
                tpopId
              }
            }
          }
        `,
        variables: {
          tpopId,
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
      queryKey: [`treeTpopmassn`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpop`],
    })
    const id = result?.data?.createTpopmassn?.tpopmassn?.id
    navigate(`./${id}${search}`)
  }

  const isMovingMassn = moving.table === 'tpopmassn'
  const onClickMoveMassnToHere = () =>
    moveTo({
      id: tpopId,
      apolloClient,
      store,
    })

  const onClickStopMoving = () =>
    setMoving({
      table: null,
      id: '99999999-9999-9999-9999-999999999999',
      label: null,
      toTable: null,
      fromParentId: null,
    })

  const isCopyingMassn = copying.table === 'tpopmassn'
  const onClickCopyMassnToHere = () =>
    copyTo({
      parentId: tpopId,
      apolloClient,
      store,
    })

  const onClickStopCopying = () =>
    setCopying({
      table: null,
      id: '99999999-9999-9999-9999-999999999999',
      label: null,
      withNextLevel: false,
    })

  return (
    <ErrorBoundary>
      <MenuBar
        rerenderer={`${moving.label}/${copying.label}/${isMovingMassn}/${isCopyingMassn}`}
      >
        {!!toggleFilterInput && (
          <FilterButton toggleFilterInput={toggleFilterInput} />
        )}
        <Tooltip title="Neue Massnahme erstellen">
          <IconButton onClick={onClickAdd}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
        {isMovingMassn && (
          <Tooltip title={`Verschiebe '${moving.label}' hierhin`}>
            <IconButton onClick={onClickMoveMassnToHere}>
              <MdOutlineMoveDown style={iconStyle} />
            </IconButton>
          </Tooltip>
        )}
        {isMovingMassn && (
          <Tooltip title={`Verschieben von '${moving.label}' abbrechen`}>
            <IconButton onClick={onClickStopMoving}>
              <BsSignStopFill style={iconStyle} />
            </IconButton>
          </Tooltip>
        )}
        {isCopyingMassn && (
          <Tooltip title={`Kopiere '${copying.label}' hierhin`}>
            <IconButton onClick={onClickCopyMassnToHere}>
              <MdContentCopy style={iconStyle} />
            </IconButton>
          </Tooltip>
        )}
        {isCopyingMassn && (
          <Tooltip title={`Kopieren von '${copying.label}' abbrechen`}>
            <IconButton onClick={onClickStopCopying}>
              <BsSignStopFill style={iconStyle} />
            </IconButton>
          </Tooltip>
        )}
      </MenuBar>
    </ErrorBoundary>
  )
})
