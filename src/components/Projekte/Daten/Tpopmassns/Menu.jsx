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
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import { MenuBar, buttonWidth } from '../../../shared/MenuBar/index.jsx'
import { FilterButton } from '../../../shared/MenuBar/FilterButton.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { moveTo } from '../../../../modules/moveTo/index.js'
import { copyTo } from '../../../../modules/copyTo/index.js'
import { MobxContext } from '../../../../mobxContext.js'

const MoveIcon = styled(MdOutlineMoveDown)`
  color: white;
`
const CopyIcon = styled(MdContentCopy)`
  color: white;
`
const iconStyle = { color: 'white' }

export const Menu = observer(({ toggleFilterInput }) => {
  const { search } = useLocation()
  const navigate = useNavigate()
  const { tpopId } = useParams()

  const store = useContext(MobxContext)
  const { setMoving, moving, setCopying, copying } = store

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const onClickAdd = async () => {
    let result
    try {
      result = await apolloClient.mutate({
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
        message: error.message,
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
              <MoveIcon />
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
              <CopyIcon />
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
