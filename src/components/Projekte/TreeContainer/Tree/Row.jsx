import React, { useContext, useCallback } from 'react'
import styled from '@emotion/styled'
import {
  MdLocalFlorist,
  MdSwapVerticalCircle,
  MdExpandMore,
  MdContentCopy,
  MdPhotoLibrary,
  MdChevronRight,
  MdRemove,
  MdMoreHoriz,
  MdPictureAsPdf,
} from 'react-icons/md'
import { observer } from 'mobx-react-lite'
import Highlighter from 'react-highlight-words'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import upperFirst from 'lodash/upperFirst'
import { useApolloClient, gql } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'

import isNodeInActiveNodePath from '../isNodeInActiveNodePath'
import isNodeOrParentInActiveNodePath from '../isNodeOrParentInActiveNodePath'
import isNodeOpen from '../isNodeOpen'
import toggleNode from './toggleNode'
import toggleNodeSymbol from './toggleNodeSymbol'
import storeContext from '../../../../storeContext'
import { ContextMenuTrigger } from 'react-contextmenu/dist/react-contextmenu'
import useSearchParamsState from '../../../../modules/useSearchParamsState'
import isMobilePhone from '../../../../modules/isMobilePhone'
import historizeForAp from '../../../../modules/historizeForAp'
import historize from '../../../../modules/historize'
import { ReactComponent as TpopSvg100 } from '../../Karte/layers/Tpop/statusGroupSymbols/100.svg'
import { ReactComponent as TpopSvg100Highlighted } from '../../Karte/layers/Tpop/statusGroupSymbols/100_highlighted.svg'
import { ReactComponent as TpopSvg101 } from '../../Karte/layers/Tpop/statusGroupSymbols/101.svg'
import { ReactComponent as TpopSvg101Highlighted } from '../../Karte/layers/Tpop/statusGroupSymbols/101_highlighted.svg'
import { ReactComponent as TpopSvg200 } from '../../Karte/layers/Tpop/statusGroupSymbols/200.svg'
import { ReactComponent as TpopSvg200Highlighted } from '../../Karte/layers/Tpop/statusGroupSymbols/200_highlighted.svg'
import { ReactComponent as TpopSvg201 } from '../../Karte/layers/Tpop/statusGroupSymbols/201.svg'
import { ReactComponent as TpopSvg201Highlighted } from '../../Karte/layers/Tpop/statusGroupSymbols/201_highlighted.svg'
import { ReactComponent as TpopSvg202 } from '../../Karte/layers/Tpop/statusGroupSymbols/202.svg'
import { ReactComponent as TpopSvg202Highlighted } from '../../Karte/layers/Tpop/statusGroupSymbols/202_highlighted.svg'
import { ReactComponent as TpopSvg300 } from '../../Karte/layers/Tpop/statusGroupSymbols/300.svg'
import { ReactComponent as TpopSvg300Highlighted } from '../../Karte/layers/Tpop/statusGroupSymbols/300_highlighted.svg'
import { ReactComponent as TpopIcon } from '../../Karte/layers/Tpop/tpop.svg'
import { ReactComponent as TpopIconHighlighted } from '../../Karte/layers/Tpop/tpopHighlighted.svg'
import { ReactComponent as TpopUIcon } from '../../Karte/layers/Tpop/statusGroup/u.svg'
import { ReactComponent as TpopUIconHighlighted } from '../../Karte/layers/Tpop/statusGroup/uHighlighted.svg'
import { ReactComponent as TpopAIcon } from '../../Karte/layers/Tpop/statusGroup/a.svg'
import { ReactComponent as TpopAIconHighlighted } from '../../Karte/layers/Tpop/statusGroup/aHighlighted.svg'
import { ReactComponent as TpopPIcon } from '../../Karte/layers/Tpop/statusGroup/p.svg'
import { ReactComponent as TpopPIconHighlighted } from '../../Karte/layers/Tpop/statusGroup/pHighlighted.svg'
import { ReactComponent as TpopQIcon } from '../../Karte/layers/Tpop/statusGroup/q.svg'
import { ReactComponent as TpopQIconHighlighted } from '../../Karte/layers/Tpop/statusGroup/qHighlighted.svg'
import { ReactComponent as PopSvg100 } from '../../Karte/layers/Pop/statusGroupSymbols/100.svg'
import { ReactComponent as PopSvg100Highlighted } from '../../Karte/layers/Pop/statusGroupSymbols/100_highlighted.svg'
import { ReactComponent as PopSvg101 } from '../../Karte/layers/Pop/statusGroupSymbols/101.svg'
import { ReactComponent as PopSvg101Highlighted } from '../../Karte/layers/Pop/statusGroupSymbols/101_highlighted.svg'
import { ReactComponent as PopSvg200 } from '../../Karte/layers/Pop/statusGroupSymbols/200.svg'
import { ReactComponent as PopSvg200Highlighted } from '../../Karte/layers/Pop/statusGroupSymbols/200_highlighted.svg'
import { ReactComponent as PopSvg201 } from '../../Karte/layers/Pop/statusGroupSymbols/201.svg'
import { ReactComponent as PopSvg201Highlighted } from '../../Karte/layers/Pop/statusGroupSymbols/201_highlighted.svg'
import { ReactComponent as PopSvg202 } from '../../Karte/layers/Pop/statusGroupSymbols/202.svg'
import { ReactComponent as PopSvg202Highlighted } from '../../Karte/layers/Pop/statusGroupSymbols/202_highlighted.svg'
import { ReactComponent as PopSvg300 } from '../../Karte/layers/Pop/statusGroupSymbols/300.svg'
import { ReactComponent as PopSvg300Highlighted } from '../../Karte/layers/Pop/statusGroupSymbols/300_highlighted.svg'
import { ReactComponent as PopIcon } from '../../Karte/layers/Pop/pop.svg'
import { ReactComponent as PopIconHighlighted } from '../../Karte/layers/Pop/popHighlighted.svg'
import { ReactComponent as PopUIcon } from '../../Karte/layers/Pop/statusGroup/u.svg'
import { ReactComponent as PopUIconHighlighted } from '../../Karte/layers/Pop/statusGroup/uHighlighted.svg'
import { ReactComponent as PopAIcon } from '../../Karte/layers/Pop/statusGroup/a.svg'
import { ReactComponent as PopAIconHighlighted } from '../../Karte/layers/Pop/statusGroup/aHighlighted.svg'
import { ReactComponent as PopPIcon } from '../../Karte/layers/Pop/statusGroup/p.svg'
import { ReactComponent as PopPIconHighlighted } from '../../Karte/layers/Pop/statusGroup/pHighlighted.svg'
import { ReactComponent as PopQIcon } from '../../Karte/layers/Pop/statusGroup/q.svg'
import { ReactComponent as PopQIconHighlighted } from '../../Karte/layers/Pop/statusGroup/qHighlighted.svg'

const tpopIcons = {
  normal: {
    100: TpopIcon,
    '100Highlighted': TpopIconHighlighted,
    101: TpopIcon,
    '101Highlighted': TpopIconHighlighted,
    200: TpopIcon,
    '200Highlighted': TpopIconHighlighted,
    201: TpopIcon,
    '201Highlighted': TpopIconHighlighted,
    202: TpopIcon,
    '202Highlighted': TpopIconHighlighted,
    300: TpopIcon,
    '300Highlighted': TpopIconHighlighted,
  },
  statusGroup: {
    100: TpopUIcon,
    '100Highlighted': TpopUIconHighlighted,
    101: TpopUIcon,
    '101Highlighted': TpopUIconHighlighted,
    200: TpopAIcon,
    '200Highlighted': TpopAIconHighlighted,
    201: TpopAIcon,
    '201Highlighted': TpopAIconHighlighted,
    202: TpopAIcon,
    '202Highlighted': TpopAIconHighlighted,
    300: TpopPIcon,
    '300Highlighted': TpopPIconHighlighted,
  },
  statusGroupSymbols: {
    100: TpopSvg100,
    '100Highlighted': TpopSvg100Highlighted,
    101: TpopSvg101,
    '101Highlighted': TpopSvg101Highlighted,
    200: TpopSvg200,
    '200Highlighted': TpopSvg200Highlighted,
    201: TpopSvg201,
    '201Highlighted': TpopSvg201Highlighted,
    202: TpopSvg202,
    '202Highlighted': TpopSvg202Highlighted,
    300: TpopSvg300,
    '300Highlighted': TpopSvg300Highlighted,
  },
}
const popIcons = {
  normal: {
    100: PopIcon,
    '100Highlighted': PopIconHighlighted,
    101: PopIcon,
    '101Highlighted': PopIconHighlighted,
    200: PopIcon,
    '200Highlighted': PopIconHighlighted,
    201: PopIcon,
    '201Highlighted': PopIconHighlighted,
    202: PopIcon,
    '202Highlighted': PopIconHighlighted,
    300: PopIcon,
    '300Highlighted': PopIconHighlighted,
  },
  statusGroup: {
    100: PopUIcon,
    '100Highlighted': PopUIconHighlighted,
    101: PopUIcon,
    '101Highlighted': PopUIconHighlighted,
    200: PopAIcon,
    '200Highlighted': PopAIconHighlighted,
    201: PopAIcon,
    '201Highlighted': PopAIconHighlighted,
    202: PopAIcon,
    '202Highlighted': PopAIconHighlighted,
    300: PopPIcon,
    '300Highlighted': PopPIconHighlighted,
  },
  statusGroupSymbols: {
    100: PopSvg100,
    '100Highlighted': PopSvg100Highlighted,
    101: PopSvg101,
    '101Highlighted': PopSvg101Highlighted,
    200: PopSvg200,
    '200Highlighted': PopSvg200Highlighted,
    201: PopSvg201,
    '201Highlighted': PopSvg201Highlighted,
    202: PopSvg202,
    '202Highlighted': PopSvg202Highlighted,
    300: PopSvg300,
    '300Highlighted': PopSvg300Highlighted,
  },
}

const PrintIcon = styled(MdPictureAsPdf)`
  font-size: 1.5rem;
`
const singleRowHeight = 23
const StyledNode = styled.div`
  padding-left: ${(props) => `${Number(props['data-level']) * 17 - 10}px`};
  height: ${singleRowHeight}px;
  max-height: ${singleRowHeight}px;
  box-sizing: border-box;
  margin: 0;
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  user-select: none;
  color: ${(props) =>
    props['data-nodeisinactivenodepath'] ? '#D84315' : 'inherit'};
`
const StyledExpandMoreIcon = styled(MdExpandMore)`
  margin-top: ${(props) =>
    props['data-nodeisopen'] ? '-6px !important' : '1px !important'};
  margin-left: ${(props) => (props['data-nodeisopen'] ? '-1px !important' : 0)};
  margin-right: ${(props) =>
    props['data-nodeisopen'] ? '-5px !important' : 0};
  padding-left: ${(props) => (props['data-nodeisopen'] ? '2px' : '2px')};
  height: ${(props) =>
    props['data-nodeisopen'] ? '30px !important' : '22px !important'};
  width: ${(props) =>
    props['data-nodeisopen'] ? '30px !important' : '26px !important'};
  color: ${(props) =>
    props['data-nodeisinactivenodepath'] ? '#D84315 !important' : 'inherit'};
  cursor: pointer;
  &:hover {
    color: #f57c00 !important;
  }
`
const StyledChevronRightIcon = styled(MdChevronRight)`
  padding-left: 2px;
  height: 22px !important;
  width: 26px;
  cursor: pointer;
  font-size: 1.5rem;
  &:hover {
    color: #f57c00 !important;
  }
`
const StyledMoreHorizIcon = styled(MdMoreHoriz)`
  margin-top: ${(props) =>
    props['data-nodeisinactivenodepath']
      ? '-5px !important'
      : '-2px !important'};
  padding-left: ${(props) =>
    props['data-nodeisinactivenodepath'] ? '1px' : '2px'};
  height: ${(props) =>
    props['data-nodeisinactivenodepath']
      ? '26px !important'
      : '22px !important'};
  color: ${(props) =>
    props['data-nodeisinactivenodepath'] ? '#D84315 !important' : 'inherit'};
  font-size: 1.5rem;
  width: 26px;
  cursor: pointer;
  &:hover {
    color: #f57c00 !important;
  }
`
const StyledRemoveIcon = styled(MdRemove)`
  padding-left: 6px;
  padding-right: 2px;
  height: 22px !important;
  width: 16px !important;
  font-size: 1.5rem;
`
const SymbolDiv = styled.div`
  cursor: pointer;
  width: 28px;
`
const TextSpan = styled.span`
  margin-left: 0;
  padding-right: 5px;
  font-size: 16px !important;
  font-weight: ${(props) =>
    props['data-nodeisinactivenodepath'] ? '700 !important' : 'inherit'};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden !important;
  cursor: pointer;
  &:hover {
    color: #f57c00;
  }
`
const StyledMapIcon = styled(MdLocalFlorist)`
  padding-right: 2px;
  margin-left: -2px;
  height: 20px !important;
  font-size: 1.4rem;
`
const PopMapIcon = styled(StyledMapIcon)`
  color: #947500 !important;
`
const TpopMapIcon = styled(StyledMapIcon)`
  color: #016f19 !important;
`
const BeobNichtBeurteiltMapIcon = styled(StyledMapIcon)`
  color: #9a009a !important;
`
const BeobNichtZuzuordnenMapIcon = styled(StyledMapIcon)`
  color: #ffe4ff !important;
`
const BeobZugeordnetMapIcon = styled(StyledMapIcon)`
  color: #ff00ff !important;
`
const BeobNichtBeurteiltFilteredMapIcon = styled(BeobNichtBeurteiltMapIcon)`
  paint-order: stroke;
  stroke-width: 8px;
  stroke: #fff900;
`
const BeobNichtZuzuordnenFilteredMapIcon = styled(BeobNichtZuzuordnenMapIcon)`
  paint-order: stroke;
  stroke-width: 8px;
  stroke: #fff900;
`
const BeobZugeordnetFilteredMapIcon = styled(BeobZugeordnetMapIcon)`
  paint-order: stroke;
  stroke-width: 8px;
  stroke: #fff900;
`
const MovingIcon = styled(MdSwapVerticalCircle)`
  padding-left: 0.2em;
  height: 20px !important;
  color: rgb(255, 90, 0) !important;
  font-size: 1.5rem;
`
const CopyingIcon = styled(MdContentCopy)`
  padding-left: 0.2em;
  height: 20px !important;
  color: rgb(255, 90, 0) !important;
  font-size: 1.5rem;
`
const BiotopCopyingIcon = styled(MdPhotoLibrary)`
  padding-left: 0.2em;
  height: 20px !important;
  color: rgb(255, 90, 0) !important;
  font-size: 1.5rem;
`
const PrintIconContainer = styled.div`
  cursor: pointer;
  padding-left: 8px;
  svg {
    font-size: 19px !important;
  }
  &:hover {
    svg {
      font-size: 22px !important;
    }
  }
`
const IconContainer = styled.div`
  padding-right: 4px;
  margin-left: -2px;
  font-size: 1.1rem;
`

const Row = ({ node }) => {
  const { apId, tpopId } = useParams()
  const navigate = useNavigate()
  const { search } = useLocation()

  const client = useApolloClient()
  const queryClient = useQueryClient()

  // console.log('Row, node:', node)

  const store = useContext(storeContext)
  const {
    activeApfloraLayers,
    copying,
    moving,
    copyingBiotop,
    setPrintingJberYear,
    map,
  } = store
  const tree = store.tree
  const {
    openNodes,
    nodeLabelFilter,
    activeNodeArray,
    showTpopIcon,
    showPopIcon,
  } = tree
  const { tpopIcon: tpopIconName, popIcon: popIconName } = map
  const activeId = activeNodeArray[activeNodeArray.length - 1]
  const nodeIsActive = node.id === activeId

  const nodeIsInActiveNodePath = isNodeInActiveNodePath({
    node,
    activeNodeArray,
  })
  const nodeIsOpen = isNodeOpen({ openNodes, url: node.url })

  const [onlyShowActivePathString] = useSearchParamsState(
    'onlyShowActivePath',
    'false',
  )
  const onlyShowActivePath = onlyShowActivePathString === 'true'

  // only calculate if needed
  const nodeOrParentIsInActivePath = onlyShowActivePath
    ? isNodeOrParentInActiveNodePath({ node, activeNodeArray })
    : false

  // build symbols
  let useSymbolIcon = true
  let useSymbolSpan = false
  let symbolIcon
  let showPrintIcon = false
  if (node.hasChildren && nodeIsOpen) {
    symbolIcon = 'expandMore'
  } else if (node.hasChildren) {
    symbolIcon = 'chevronRight'
  } else if (node.label === 'lade Daten...') {
    symbolIcon = 'moreHoriz'
  } else {
    useSymbolSpan = true
    useSymbolIcon = false
  }
  if (node.menuType === 'apber' || node.menuType === 'apberuebersicht') {
    showPrintIcon = true
  }
  const printIconTitle =
    node.menuType === 'apberuebersicht'
      ? 'Druckversion. Achtung: braucht Minuten, um vollständig zu laden'
      : 'Druckversion'
  const dataUrl = JSON.stringify(node.url)
  const level =
    node.url[0] === 'Projekte' ? node.url.length - 1 : node.url.length
  const isMoving =
    node.nodeType === 'table' &&
    node.menuType === moving.table &&
    node.id === moving.id
  const isCopying =
    node.nodeType === 'table' &&
    node.menuType === copying.table &&
    node.id === copying.id
  const amCopyingBiotop =
    node.nodeType === 'table' && node.id === copyingBiotop.id

  const onClickNode = useCallback(() => {
    toggleNode({
      node,
      store,
      navigate,
      search,
    })
  }, [navigate, node, search, store])

  const onClickNodeSymbol = useCallback(() => {
    toggleNodeSymbol({ node, store, search, navigate })
  }, [navigate, node, search, store])

  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const onClickPrint = useCallback(async () => {
    if (!apId) {
      // apberuebersicht
      const { data } = await client.query({
        query: gql`
          query apberuebersichtForPrint($id: UUID!) {
            apberuebersichtById(id: $id) {
              id
              jahr
              historyFixed
            }
          }
        `,
        variables: { id: node.id },
      })
      const apberuebersicht = data?.apberuebersichtById
      let snackbarKey
      if (apberuebersicht?.historyFixed === false) {
        snackbarKey = enqueueSnackbar(
          'Arten, Pop und TPop werden historisiert, damit Sie aktuelle Daten sehen. Danach wird der Bericht aktualisiert. Sorry, das dauert...',
          {
            variant: 'info',
            persist: true,
          },
        )
        historize({ store, apberuebersicht }).then(() => {
          closeSnackbar(snackbarKey)
          queryClient.invalidateQueries({
            queryKey: [`ApberForYearQuery`],
          })
          setTimeout(() =>
            queryClient.invalidateQueries({
              queryKey: [`jberAktPopQuery`],
            }),
          )
        })
      }
    } else {
      // apber
      const { data } = await client.query({
        query: gql`
          query apberForPrint($jahr: Int!) {
            allApberuebersichts(filter: { jahr: { equalTo: $jahr } }) {
              nodes {
                id
                historyFixed
              }
            }
          }
        `,
        variables: { jahr: Number(node.label) },
      })
      const apberuebersicht = data?.allApberuebersichts?.nodes?.[0]
      let snackbarKey
      if (apberuebersicht?.historyFixed === false) {
        snackbarKey = enqueueSnackbar(
          'Art, Pop und TPop werden historisiert, damit Sie aktuelle Daten sehen. Danach wird der Bericht aktualisiert. Sorry, das dauert...',
          {
            variant: 'info',
            persist: true,
          },
        )
        historizeForAp({ store, year: Number(node.label), apId }).then(() => {
          closeSnackbar(snackbarKey)
          queryClient.invalidateQueries({
            queryKey: [`apByIdJahrForApberForApFromAp`],
          })
        })
      }
    }
    setPrintingJberYear(+node.label)
    navigate(`/Daten/${[...node.url, 'print'].join('/')}${search}`)
  }, [
    apId,
    client,
    closeSnackbar,
    enqueueSnackbar,
    navigate,
    node,
    queryClient,
    search,
    setPrintingJberYear,
    store,
  ])

  const [projekteTabs] = useSearchParamsState(
    'projekteTabs',
    isMobilePhone() ? ['tree'] : ['tree', 'daten'],
  )
  const karteIsVisible = projekteTabs.includes('karte')

  const tpopIconIsHighlighted =
    karteIsVisible && activeApfloraLayers.includes('tpop') && nodeIsActive
  const TpopIcon = node.status
    ? tpopIconIsHighlighted
      ? tpopIcons[tpopIconName][node.status + 'Highlighted']
      : tpopIcons[tpopIconName][node.status]
    : tpopIconIsHighlighted
    ? TpopQIconHighlighted
    : TpopQIcon

  const popIconIsHighlighted =
    karteIsVisible && activeApfloraLayers.includes('pop') && nodeIsActive
  const PopIcon = node.status
    ? popIconIsHighlighted
      ? popIcons[popIconName][node.status + 'Highlighted']
      : popIcons[popIconName][node.status]
    : popIconIsHighlighted
    ? PopQIconHighlighted
    : PopQIcon

  // console.log('Row, node:', node)

  if (onlyShowActivePath && !nodeOrParentIsInActivePath) return null

  return (
    <ContextMenuTrigger
      // need this id for the menu to work
      id={`tree${upperFirst(node.menuType)}`}
      //collect={(props) => ({ key: index })}
      collect={(props) => props}
      nodeId={node.id}
      tableId={node.tableId}
      nodeLabel={node.label}
    >
      <StyledNode
        data-level={level}
        data-nodeisinactivenodepath={nodeIsInActiveNodePath}
        data-id={node.tableId || node.id}
        data-parentid={node.parentTableId || node.parentId}
        data-url={dataUrl}
        data-nodetype={node.nodeType}
        data-label={node.label}
        data-menutype={node.menuType}
        data-jahr={node.jahr}
        // need this id to scroll elements into view
        id={node.id}
      >
        {useSymbolIcon && (
          <SymbolDiv onClick={onClickNodeSymbol}>
            {symbolIcon === 'expandMore' && (
              <StyledExpandMoreIcon
                data-nodeisinactivenodepath={nodeIsInActiveNodePath}
                data-nodeisopen={nodeIsOpen}
              />
            )}
            {symbolIcon === 'chevronRight' && <StyledChevronRightIcon />}
            {symbolIcon === 'moreHoriz' && (
              <StyledMoreHorizIcon
                data-nodeisinactivenodepath={nodeIsInActiveNodePath}
              />
            )}
          </SymbolDiv>
        )}
        {useSymbolSpan && (
          <SymbolDiv onClick={onClickNode}>
            <StyledRemoveIcon />
          </SymbolDiv>
        )}
        {node.menuType === 'pop' && node.status && showPopIcon && (
          <IconContainer>
            <PopIcon />
          </IconContainer>
        )}
        {node.menuType === 'tpop' && node.status && showTpopIcon && (
          <IconContainer>
            <TpopIcon />
          </IconContainer>
        )}
        {karteIsVisible && (
          <>
            {node.menuType === 'ap' &&
              node.id === apId &&
              activeApfloraLayers.includes('pop') && (
                <div title="in Karte sichtbar">
                  <PopMapIcon />
                </div>
              )}
            {node.menuType === 'ap' &&
              node.id === apId &&
              activeApfloraLayers.includes('tpop') && (
                <div title="in Karte sichtbar">
                  <TpopMapIcon />
                </div>
              )}
            {node.menuType === 'beobNichtBeurteiltFolder' &&
              node.id === apId &&
              activeApfloraLayers.includes('beobNichtBeurteilt') && (
                <div title="in Karte sichtbar">
                  <BeobNichtBeurteiltMapIcon />
                </div>
              )}
            {node.menuType === 'beobNichtZuzuordnenFolder' &&
              node.id === apId &&
              activeApfloraLayers.includes('beobNichtZuzuordnen') && (
                <div title="in Karte sichtbar">
                  <BeobNichtZuzuordnenMapIcon />
                </div>
              )}
            {node.menuType === 'beobZugeordnetFolder' &&
              node.id === tpopId &&
              activeApfloraLayers.includes('beobZugeordnet') && (
                <div title="in Karte sichtbar">
                  <BeobZugeordnetMapIcon />
                </div>
              )}
            {node.menuType === 'beobNichtBeurteilt' &&
              activeApfloraLayers.includes('beobNichtBeurteilt') &&
              !nodeIsActive && (
                <div title="in Karte sichtbar">
                  <BeobNichtBeurteiltMapIcon />
                </div>
              )}
            {node.menuType === 'beobNichtBeurteilt' &&
              activeApfloraLayers.includes('beobNichtBeurteilt') &&
              nodeIsActive && (
                <div title="in Karte hervorgehoben">
                  <BeobNichtBeurteiltFilteredMapIcon />
                </div>
              )}
            {node.menuType === 'beobNichtZuzuordnen' &&
              activeApfloraLayers.includes('beobNichtZuzuordnen') &&
              !nodeIsActive && (
                <div title="in Karte sichtbar">
                  <BeobNichtZuzuordnenMapIcon />
                </div>
              )}
            {node.menuType === 'beobNichtZuzuordnen' &&
              activeApfloraLayers.includes('beobNichtZuzuordnen') &&
              nodeIsActive && (
                <div title="in Karte hervorgehoben">
                  <BeobNichtZuzuordnenFilteredMapIcon />
                </div>
              )}
            {activeApfloraLayers.includes('beobZugeordnet') &&
              node.menuType === 'beobZugeordnet' &&
              !nodeIsActive && (
                <div title="in Karte sichtbar">
                  <BeobZugeordnetMapIcon />
                </div>
              )}
            {activeApfloraLayers.includes('beobZugeordnet') &&
              node.menuType === 'beobZugeordnet' &&
              nodeIsActive && (
                <div title="in Karte hervorgehoben">
                  <BeobZugeordnetFilteredMapIcon />
                </div>
              )}
          </>
        )}
        <TextSpan
          data-nodeisinactivenodepath={nodeIsInActiveNodePath}
          node={node}
          onClick={onClickNode}
        >
          {nodeLabelFilter?.[node.menuType] ? (
            <Highlighter
              searchWords={[nodeLabelFilter[node.menuType]]}
              textToHighlight={node.label}
            />
          ) : (
            node.label
          )}
        </TextSpan>
        {isMoving && (
          <div title="zum Verschieben gemerkt, bereit zum Einfügen">
            <MovingIcon />
          </div>
        )}
        {isCopying && (
          <div title="kopiert, bereit zum Einfügen">
            <CopyingIcon />
          </div>
        )}
        {amCopyingBiotop && (
          <div title="Biotop kopiert, bereit zum Einfügen">
            <BiotopCopyingIcon />
          </div>
        )}
        {showPrintIcon && (
          <PrintIconContainer title={printIconTitle} onClick={onClickPrint}>
            <PrintIcon />
          </PrintIconContainer>
        )}
      </StyledNode>
    </ContextMenuTrigger>
  )
}

export default observer(Row)
