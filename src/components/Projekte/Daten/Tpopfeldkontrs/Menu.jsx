import { memo, useCallback, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
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
import { LabelFilter, labelFilterWidth } from '../../../shared/LabelFilter.jsx'
import { listLabelFilterIsIconAtom } from '../../../../JotaiStore/index.js'
import { hideTreeAtom } from '../../../../JotaiStore/index.js'

const MoveIcon = styled(MdOutlineMoveDown)`
  color: white;
`
const CopyIcon = styled(MdContentCopy)`
  color: white;
`
const iconStyle = { color: 'white' }

export const Menu = memo(
  observer(({ toggleFilterInput }) => {
    const apolloClient = useApolloClient()
    const tanstackQueryClient = useQueryClient()

    const { search } = useLocation()
    const navigate = useNavigate()
    const { projId, apId, popId, tpopId } = useParams()

    const store = useContext(MobxContext)
    const {
      setMoving,
      moving,
      setCopying,
      copying,
      copyingBiotop,
      setCopyingBiotop,
    } = store
    const { activeNodeArray, openNodes, setOpenNodes } = store.tree

    const onClickAdd = useCallback(async () => {
      // 1. create new tpopkontr
      let result
      try {
        result = await apolloClient.mutate({
          mutation: gql`
            mutation createTpopfeldkontrForTpopfeldkontrForm($tpopId: UUID!) {
              createTpopkontr(input: { tpopkontr: { tpopId: $tpopId } }) {
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
      const id = result?.data?.createTpopkontr?.tpopkontr?.id

      // 2. add new tpopkontrzaehl
      const resultZaehl = await apolloClient.mutate({
        mutation: gql`
          mutation createTpokontrzaehlForTpopfeldkontrs($parentId: UUID!) {
            createTpopkontrzaehl(
              input: { tpopkontrzaehl: { tpopkontrId: $parentId } }
            ) {
              tpopkontrzaehl {
                id
              }
            }
          }
        `,
        variables: { parentId: id },
      })

      // 3. open the tpopkontrzaehl Folder
      const zaehlId =
        resultZaehl?.data?.createTpopkontrzaehl?.tpopkontrzaehl?.id
      const tpopkontrNode = [...activeNodeArray, id]
      const zaehlungenFolderNode = [...tpopkontrNode, 'Zaehlungen']
      const zaehlungNode = [...zaehlungenFolderNode, zaehlId]
      const newOpenNodes = [
        ...openNodes,
        tpopkontrNode,
        zaehlungenFolderNode,
        zaehlungNode,
      ]
      setOpenNodes(newOpenNodes)

      // 4. refresh tree
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeTpopfeldkontr`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeTpop`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeTpopfeldkontrzaehl`],
      })

      // 5. navigate to new tpopkontr
      navigate(`./${id}${search}`)
    }, [apolloClient, store, tanstackQueryClient, navigate, search, tpopId])

    const onClickOpenLowerNodes = useCallback(() => {
      openLowerNodes({
        id: tpopId,
        projId,
        apId,
        popId,
        client: apolloClient,
        store,
        menuType: 'tpopfeldkontrFolder',
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
          'Feld-Kontrollen',
        ],
        store,
        search,
      })
    }, [projId, apId, popId, store, search])

    const isMovingEk = moving.table === 'tpopfeldkontr'
    const onClickMoveEkfToHere = useCallback(() => {
      return moveTo({
        id: tpopId,
        client: apolloClient,
        store,
        tanstackQueryClient,
      })
    }, [tpopId, apolloClient, store, tanstackQueryClient, moveTo])

    const onClickStopMoving = useCallback(() => {
      setMoving({
        table: null,
        id: '99999999-9999-9999-9999-999999999999',
        label: null,
        toTable: null,
        fromParentId: null,
      })
    }, [setMoving])

    const isCopyingEk = copying.table === 'tpopfeldkontr'
    const isCopyingBiotop = !!copyingBiotop.id
    const isCopying = isCopyingEk || isCopyingBiotop
    const onClickCopyEkfToHere = useCallback(() => {
      return copyTo({
        parentId: tpopId,
        client: apolloClient,
        store,
        tanstackQueryClient,
      })
    }, [copyTo, tpopId, apolloClient, store, tanstackQueryClient])

    const onClickStopCopying = useCallback(() => {
      setCopying({
        table: null,
        id: '99999999-9999-9999-9999-999999999999',
        label: null,
        withNextLevel: false,
      })
      setCopyingBiotop({ id: null, label: null })
    }, [setCopying, setCopyingBiotop])

    const [labelFilterIsIcon] = useAtom(listLabelFilterIsIconAtom)
    const [hideTree] = useAtom(hideTreeAtom)

    return (
      <ErrorBoundary>
        <MenuBar
          rerenderer={`${moving.label}/${copying.label}/${copyingBiotop.label}/${isMovingEk}/${isCopyingEk}/${hideTree}`}
        >
          <LabelFilter
            width={labelFilterIsIcon ? buttonWidth : labelFilterWidth}
          />
          <Tooltip title="Neue Feld-Kontrolle erstellen">
            <IconButton onClick={onClickAdd}>
              <FaPlus style={iconStyle} />
            </IconButton>
          </Tooltip>
          {!hideTree && (
            <Tooltip title="Ordner im Navigationsbaum öffnen">
              <IconButton onClick={onClickOpenLowerNodes}>
                <FaFolderTree style={iconStyle} />
              </IconButton>
            </Tooltip>
          )}
          {!hideTree && (
            <Tooltip title="Ordner im Navigationsbaum schliessen">
              <IconButton onClick={onClickCloseLowerNodes}>
                <RiFolderCloseFill style={iconStyle} />
              </IconButton>
            </Tooltip>
          )}
          {isMovingEk && (
            <Tooltip title={`Verschiebe '${moving.label}' hierhin`}>
              <IconButton onClick={onClickMoveEkfToHere}>
                <MoveIcon />
              </IconButton>
            </Tooltip>
          )}
          {isMovingEk && (
            <Tooltip title={`Verschieben von '${moving.label}' abbrechen`}>
              <IconButton onClick={onClickStopMoving}>
                <BsSignStopFill style={iconStyle} />
              </IconButton>
            </Tooltip>
          )}
          {isCopyingEk && (
            <Tooltip title={`Kopiere '${copying.label}' hierhin`}>
              <IconButton onClick={onClickCopyEkfToHere}>
                <CopyIcon />
              </IconButton>
            </Tooltip>
          )}
          {isCopying && (
            <Tooltip
              title={`Kopieren von '${copying.label ?? copyingBiotop.label}' abbrechen`}
            >
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
