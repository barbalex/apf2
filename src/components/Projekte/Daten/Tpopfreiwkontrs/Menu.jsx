import { memo, useCallback, useContext } from 'react'
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
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useAtom } from 'jotai'

import { MenuBar, buttonWidth } from '../../../shared/MenuBar/index.jsx'
import { FilterButton } from '../../../shared/MenuBar/FilterButton.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { openLowerNodes } from '../../TreeContainer/openLowerNodes/index.js'
import { closeLowerNodes } from '../../TreeContainer/closeLowerNodes.js'
import { moveTo } from '../../../../modules/moveTo/index.js'
import { copyTo } from '../../../../modules/copyTo/index.js'
import { MobxContext } from '../../../../mobxContext.js'
import { showTreeMenusAtom } from '../../../../JotaiStore/index.js'

const MoveIcon = styled(MdOutlineMoveDown)`
  color: white;
`
const CopyIcon = styled(MdContentCopy)`
  color: white;
`
const iconStyle = { color: 'white' }

export const Menu = memo(
  observer(({ toggleFilterInput }) => {
    const { search } = useLocation()
    const navigate = useNavigate()
    const apolloClient = useApolloClient()
    const tsQueryClient = useQueryClient()
    const { projId, apId, popId, tpopId } = useParams()
    const store = useContext(MobxContext)
    const { setMoving, moving, setCopying, copying } = store

    const onClickAdd = useCallback(async () => {
      let result
      try {
        result = await apolloClient.mutate({
          mutation: gql`
            mutation createTpopfreiwkontrForTpopfreiwkontrForm($tpopId: UUID!) {
              createTpopkontr(
                input: {
                  tpopkontr: {
                    tpopId: $tpopId
                    typ: "Freiwilligen-Erfolgskontrolle"
                  }
                }
              ) {
                tpopkontr {
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
        queryKey: [`treeTpopfreiwkontr`],
      })
      tsQueryClient.invalidateQueries({
        queryKey: [`treeTpop`],
      })
      const id = result?.data?.createTpopkontr?.tpopkontr?.id
      navigate(`./${id}${search}`)
    }, [apolloClient, store, tsQueryClient, navigate, search, tpopId])

    const onClickOpenLowerNodes = useCallback(() => {
      openLowerNodes({
        id: tpopId,
        projId,
        apId,
        popId,
        apolloClient,
        store,
        menuType: 'tpopfreiwkontrFolder',
      })
    }, [projId, apId, popId, apolloClient, store])

    const onClickCloseLowerNodes = useCallback(() => {
      closeLowerNodes({
        url: [
          'Projekte',
          projId,
          'Arten',
          apId,
          'Populationen',
          popId,
          'Teil-Populationen',
          tpopId,
          'Freiwilligen-Kontrollen',
        ],
        store,
        search,
      })
    }, [projId, apId, popId, store, search])

    const isMovingEkf = moving.table === 'tpopfreiwkontr'
    const onClickMoveEkfToHere = useCallback(() => {
      return moveTo({
        id: tpopId,
        apolloClient,
        store,
      })
    }, [tpopId, apolloClient, store, moveTo])

    const onClickStopMoving = useCallback(() => {
      setMoving({
        table: null,
        id: '99999999-9999-9999-9999-999999999999',
        label: null,
        toTable: null,
        fromParentId: null,
      })
    }, [setMoving])

    const isCopyingEkf = copying.table === 'tpopfreiwkontr'
    const onClickCopyEkfToHere = useCallback(() => {
      return copyTo({
        parentId: tpopId,
        apolloClient,
        store,
      })
    }, [copyTo, tpopId, apolloClient, store])

    const onClickStopCopying = useCallback(() => {
      setCopying({
        table: null,
        id: '99999999-9999-9999-9999-999999999999',
        label: null,
        withNextLevel: false,
      })
    }, [setCopying])

    const [showTreeMenus] = useAtom(showTreeMenusAtom)

    return (
      <ErrorBoundary>
        <MenuBar
          rerenderer={`${moving.label}/${copying.label}/${isMovingEkf}/${isCopyingEkf}/${showTreeMenus}`}
        >
          {!!toggleFilterInput && (
            <FilterButton toggleFilterInput={toggleFilterInput} />
          )}
          <Tooltip title="Neue Freiwilligen-Kontrolle erstellen">
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
          {isMovingEkf && (
            <Tooltip title={`Verschiebe '${moving.label}' hierhin`}>
              <IconButton onClick={onClickMoveEkfToHere}>
                <MoveIcon />
              </IconButton>
            </Tooltip>
          )}
          {isMovingEkf && (
            <Tooltip title={`Verschieben von '${moving.label}' abbrechen`}>
              <IconButton onClick={onClickStopMoving}>
                <BsSignStopFill style={iconStyle} />
              </IconButton>
            </Tooltip>
          )}
          {isCopyingEkf && (
            <Tooltip title={`Kopiere '${copying.label}' hierhin`}>
              <IconButton onClick={onClickCopyEkfToHere}>
                <CopyIcon />
              </IconButton>
            </Tooltip>
          )}
          {isCopyingEkf && (
            <Tooltip title={`Kopieren von '${copying.label}' abbrechen`}>
              <IconButton onClick={onClickStopCopying}>
                <BsSignStopFill style={iconStyle} />
              </IconButton>
            </Tooltip>
          )}
        </MenuBar>
      </ErrorBoundary>
    )
  }),
)
