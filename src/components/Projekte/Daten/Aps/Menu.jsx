import { memo, useCallback, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { observer } from 'mobx-react-lite'
import { FaPlus } from 'react-icons/fa6'
import { MdOutlineMoveDown, MdContentCopy } from 'react-icons/md'
import { RiFolderCloseFill } from 'react-icons/ri'
import { BsSignStopFill } from 'react-icons/bs'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import styled from '@emotion/styled'
import { useAtom } from 'jotai'

import { MenuBar, buttonWidth } from '../../../shared/MenuBar/index.jsx'
import { FilterButton } from '../../../shared/MenuBar/FilterButton.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { MenuTitle } from '../../../shared/Files/Menu/index.jsx'
import { moveTo } from '../../../../modules/moveTo/index.js'
import { copyTo } from '../../../../modules/copyTo/index.js'
import { closeLowerNodes } from '../../TreeContainer/closeLowerNodes.js'
import { ApFilter } from '../../TreeContainer/ApFilter/index.jsx'
import { MobxContext } from '../../../../mobxContext.js'
import { showTreeMenusAtom } from '../../../../JotaiStore/index.js'

const Fitter = styled.div`
  margin-top: ${(props) => (props.inmenu === 'true' ? -8 : -15)}px;
  padding-left: 5px;
`
const iconStyle = { color: 'white' }

export const Menu = memo(
  observer(({ toggleFilterInput }) => {
    const { search, pathname } = useLocation()
    const navigate = useNavigate()
    const client = useApolloClient()
    const tanstackQueryClient = useQueryClient()
    const { projId, apId } = useParams()
    const store = useContext(MobxContext)

    const { setMoving, moving, copying, setCopying } = store
    const [showTreeMenus] = useAtom(showTreeMenusAtom)

    const onClickAdd = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
          mutation: gql`
            mutation createApForApsForm($projId: UUID!) {
              createAp(input: { ap: { projId: $projId } }) {
                ap {
                  id
                  projId
                }
              }
            }
          `,
          variables: { projId },
        })
      } catch (error) {
        return store.enqueNotification({
          message: error.message,
          options: {
            variant: 'error',
          },
        })
      }
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeAp`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeRoot`],
      })
      const id = result?.data?.createAp?.ap?.id
      navigate(`/Daten/Projekte/${projId}/Arten/${id}${search}`)
    }, [projId, client, store, tanstackQueryClient, navigate, search])

    const onClickMoveHere = useCallback(() => {
      moveTo({
        id: apId,
        store,
        client,
        tanstackQueryClient,
      })
    }, [apId, store, client])

    const onClickStopMoving = useCallback(() => {
      setMoving({
        table: null,
        id: '99999999-9999-9999-9999-999999999999',
        label: null,
        toTable: null,
        fromParentId: null,
      })
    }, [setMoving])

    const onClickCopyTo = useCallback(() => {
      copyTo({
        parentId: apId,
        client,
        store,
        tanstackQueryClient,
      })
    }, [apId, client, store, tanstackQueryClient])

    const onClickCloseLowerNodes = useCallback(() => {
      closeLowerNodes({
        url: ['Projekte', projId, 'Arten', apId],
        store,
        search,
      })
    }, [projId, apId, store, search])

    const onClickStopCopying = useCallback(() => {
      setCopying({
        table: null,
        id: '99999999-9999-9999-9999-999999999999',
        label: null,
        withNextLevel: false,
      })
    }, [setCopying])

    const isMoving = !!moving.table
    const isCopying = !!copying.table

    return (
      <ErrorBoundary>
        <MenuBar rerenderer={`${moving.id}/${copying.id}`}>
          {!!toggleFilterInput && (
            <FilterButton toggleFilterInput={toggleFilterInput} />
          )}
          <Tooltip title="Neue Art erstellen">
            <IconButton onClick={onClickAdd}>
              <FaPlus style={iconStyle} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Ordner im Navigationsbaum schliessen">
            <IconButton onClick={onClickCloseLowerNodes}>
              <RiFolderCloseFill style={iconStyle} />
            </IconButton>
          </Tooltip>
          {isMoving &&
            moving.toTable === 'ap' &&
            moving.fromParentId !== apId && (
              <Tooltip title={`Verschiebe ${moving.label} zu dieser Art`}>
                <IconButton onClick={onClickMoveHere}>
                  <MdOutlineMoveDown style={iconStyle} />
                </IconButton>
              </Tooltip>
            )}
          {isMoving && (
            <Tooltip title={`Verschieben von '${moving.label}' abbrechen`}>
              <IconButton onClick={onClickStopMoving}>
                <BsSignStopFill style={iconStyle} />
              </IconButton>
            </Tooltip>
          )}
          {isCopying && (
            <Tooltip title={`Kopiere '${copying.label}' in diese Art`}>
              <IconButton onClick={onClickCopyTo}>
                <MdContentCopy style={iconStyle} />
              </IconButton>
            </Tooltip>
          )}
          {isCopying && (
            <Tooltip title={`Kopieren von '${copying.label}' abbrechen`}>
              <IconButton onClick={onClickStopCopying}>
                <BsSignStopFill style={iconStyle} />
              </IconButton>
            </Tooltip>
          )}
          <Fitter>
            <ApFilter color="white" />
          </Fitter>
        </MenuBar>
      </ErrorBoundary>
    )
  }),
)
