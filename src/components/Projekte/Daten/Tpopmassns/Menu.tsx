import { useSetAtom, useAtomValue } from 'jotai'
import { graphql } from '../../../../gql/index.ts'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { FaPlus } from 'react-icons/fa6'
import { MdOutlineMoveDown, MdContentCopy } from 'react-icons/md'
import { BsSignStopFill } from 'react-icons/bs'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import { FilterButton } from '../../../shared/MenuBar/FilterButton.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { moveTo } from '../../../../modules/moveTo/index.ts'
import { copyTo } from '../../../../modules/copyTo/index.ts'

import type { TpopmassnId } from '../../../../models/apflora/Tpopmassn.ts'
import type { TpopId } from '../../../../models/apflora/Tpop.ts'

import {
  addNotificationAtom,
  copyingAtom,
  setCopyingAtom,
  movingAtom,
  setMovingAtom,
} from '../../../../store/index.ts'

interface CreateTpopmassnResult {
  createTpopmassn: {
    tpopmassn: {
      id: TpopmassnId
      tpopId: TpopId
    }
  }
}

interface MenuProps {
  toggleFilterInput?: () => void
}

const iconStyle = { color: 'white' }

export const Menu = ({ toggleFilterInput }: MenuProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const { search } = useLocation()
  const navigate = useNavigate()
  const { tpopId } = useParams()

  const moving = useAtomValue(movingAtom)
  const setMoving = useSetAtom(setMovingAtom)
  const copying = useAtomValue(copyingAtom)
  const setCopying = useSetAtom(setCopyingAtom)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const onClickAdd = async () => {
    let result: { data?: CreateTpopmassnResult | undefined } | undefined
    try {
      result = await apolloClient.mutate<CreateTpopmassnResult>({
        mutation: graphql(`
          mutation createTpopmassnForTpopmassnsForm($tpopId: UUID!) {
            createTpopmassn(input: { tpopmassn: { tpopId: $tpopId } }) {
              tpopmassn {
                id
                tpopId
              }
            }
          }
        `),
        variables: {
          tpopId: tpopId ?? '',
        },
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
      queryKey: [`treeTpopmassn`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeTpop`],
    })
    const id = result?.data?.createTpopmassn?.tpopmassn?.id
    void navigate(`./${id}${search}`)
  }

  const isMovingMassn = moving.table === 'tpopmassn'
  const onClickMoveMassnToHere = () => moveTo({ id: tpopId })

  const onClickStopMoving = () =>
    setMoving({
      table: null,
      id: '99999999-9999-9999-9999-999999999999',
      label: null,
      toTable: null,
      fromParentId: null,
    })

  const isCopyingMassn = copying.table === 'tpopmassn'
  const onClickCopyMassnToHere = () => copyTo({ parentId: tpopId })

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
          <IconButton onClick={() => void onClickAdd()}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
        {isMovingMassn && (
          <Tooltip title={`Verschiebe '${moving.label}' hierhin`}>
            <IconButton onClick={() => void onClickMoveMassnToHere()}>
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
            <IconButton onClick={() => void onClickCopyMassnToHere()}>
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
}
