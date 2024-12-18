import { memo, useContext, useCallback } from 'react'
import styled from '@emotion/styled'
import {
  MdLocalFlorist,
  MdSwapVerticalCircle,
  MdOutlineMoveDown,
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
import { useParams, useNavigate, useLocation } from 'react-router'
import upperFirst from 'lodash/upperFirst'
import { useApolloClient, gql } from '@apollo/client'
import { useSnackbar } from 'notistack'

import { isNodeInActiveNodePath } from '../isNodeInActiveNodePath.js'
import { isNodeOrParentInActiveNodePath } from '../isNodeOrParentInActiveNodePath.js'
import { isNodeOpen } from '../isNodeOpen.js'
import { toggleNode } from './toggleNode.js'
import { toggleNodeSymbol } from './toggleNodeSymbol.js'
import { MobxContext } from '../../../../mobxContext.js'
import { ContextMenuTrigger } from '../../../../modules/react-contextmenu/index.js'
import { historizeForAp } from '../../../../modules/historizeForAp.js'
import { historize } from '../../../../modules/historize.js'
import { useSearchParamsState } from '../../../../modules/useSearchParamsState.js'

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
  contentvisibility: auto;
  contain-intrinsic-size: 0 23px;
  transition: opacity 300ms ease-in-out;
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
    props['data-nodeisinactivenodepath'] ? '-5px !important' : (
      '-2px !important'
    )};
  padding-left: ${(props) =>
    props['data-nodeisinactivenodepath'] ? '1px' : '2px'};
  height: ${(props) =>
    props['data-nodeisinactivenodepath'] ? '26px !important' : (
      '22px !important'
    )};
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
export const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-right: 4px;
  margin-left: -2px;
`
export const PopMapIconComponent = () => (
  <IconContainer title="Populationen in Karte sichtbar">
    <PopMapIcon />
  </IconContainer>
)
const TpopMapIcon = styled(StyledMapIcon)`
  color: #016f19 !important;
`
export const TpopMapIconComponent = () => (
  <IconContainer title="Teil-Populationen in Karte sichtbar">
    <TpopMapIcon />
  </IconContainer>
)
const BeobNichtBeurteiltMapIcon = styled(StyledMapIcon)`
  color: #9a009a !important;
`
export const BeobNichtBeurteiltMapIconComponent = () => (
  <IconContainer title="Beobachtungen nicht beurteilt in Karte sichtbar">
    <BeobNichtBeurteiltMapIcon />
  </IconContainer>
)
const BeobNichtZuzuordnenMapIcon = styled(StyledMapIcon)`
  color: #ffe4ff !important;
`
export const BeobNichtZuzuordnenMapIconComponent = () => (
  <IconContainer title="Beobachtungen nicht zuzuordnen in Karte sichtbar">
    <BeobNichtZuzuordnenMapIcon />
  </IconContainer>
)
const BeobZugeordnetMapIcon = styled(StyledMapIcon)`
  color: #ff00ff !important;
`
export const BeobZugeordnetMapIconComponent = () => (
  <IconContainer title="Beobachtungen zugeordnet in Karte sichtbar">
    <BeobZugeordnetMapIcon />
  </IconContainer>
)
const BeobNichtBeurteiltFilteredMapIcon = styled(BeobNichtBeurteiltMapIcon)`
  paint-order: stroke;
  stroke-width: 8px;
  stroke: #fff900;
`
export const BeobNichtBeurteiltFilteredMapIconComponent = () => (
  <IconContainer title="Beobachtung in Karte hervorgehoben">
    <BeobNichtBeurteiltFilteredMapIcon />
  </IconContainer>
)
const BeobNichtZuzuordnenFilteredMapIcon = styled(BeobNichtZuzuordnenMapIcon)`
  paint-order: stroke;
  stroke-width: 8px;
  stroke: #fff900;
`
export const BeobNichtZuzuordnenFilteredMapIconComponent = () => (
  <IconContainer title="Beobachtung in Karte hervorgehoben">
    <BeobNichtZuzuordnenFilteredMapIcon />
  </IconContainer>
)
const BeobZugeordnetFilteredMapIcon = styled(BeobZugeordnetMapIcon)`
  paint-order: stroke;
  stroke-width: 8px;
  stroke: #fff900;
`
export const BeobZugeordnetFilteredMapIconComponent = () => (
  <IconContainer title="Beobachtung in Karte hervorgehoben">
    <BeobZugeordnetFilteredMapIcon />
  </IconContainer>
)
const MovingIcon = styled(MdOutlineMoveDown)`
  padding-left: 0.2em;
  height: 20px !important;
  color: rgb(255, 90, 0) !important;
  font-size: 1.5rem;
`
export const MovingComponent = () => (
  <IconContainer title="zum Verschieben gemerkt, bereit um in einer anderen Art einzufügen">
    <MovingIcon />
  </IconContainer>
)
const CopyingIcon = styled(MdContentCopy)`
  padding-left: 0.2em;
  height: 20px !important;
  color: rgb(255, 90, 0) !important;
  font-size: 1.5rem;
`
export const CopyingComponent = () => (
  <IconContainer title="kopiert, bereit zum Einfügen">
    <CopyingIcon />
  </IconContainer>
)
const BiotopCopyingIcon = styled(MdPhotoLibrary)`
  padding-left: 0.2em;
  height: 20px !important;
  color: rgb(255, 90, 0) !important;
  font-size: 1.5rem;
`
export const BiotopCopyingComponent = () => (
  <IconContainer title="Biotop kopiert, bereit zum Einfügen">
    <BiotopCopyingIcon />
  </IconContainer>
)
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

export const transitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
}

export const Row = memo(
  observer(({ node, transitionState, ref }) => {
    const { apId, tpopId } = useParams()
    const navigate = useNavigate()
    const { search } = useLocation()

    const client = useApolloClient()

    // console.log('Row, node:', node)
    // console.log('Row', { transitionState, ref })

    const store = useContext(MobxContext)
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
    const nodeOrParentIsInActivePath =
      onlyShowActivePath ?
        isNodeOrParentInActiveNodePath({ node, activeNodeArray })
      : false

    // build symbols
    let useSymbolIcon = true
    let useSymbolSpan = false
    let symbolIcon
    if (node.hasChildren && (nodeIsOpen || node.alwaysOpen)) {
      symbolIcon = 'expandMore'
    } else if (node.hasChildren) {
      symbolIcon = 'chevronRight'
    } else if (node.label === 'lade Daten...') {
      symbolIcon = 'moreHoriz'
    } else {
      useSymbolSpan = true
      useSymbolIcon = false
    }
    const showPrintIcon =
      node.menuType === 'apber' || node.menuType === 'apberuebersicht'
    const printIconTitle =
      node.menuType === 'apberuebersicht' ?
        'Druckversion. Achtung: braucht Minuten, um vollständig zu laden'
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
        onlyShowActivePath,
      })
    }, [navigate, node, search, store, onlyShowActivePath])

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
            'Arten, Pop und TPop werden historisiert, damit Sie aktuelle Daten sehen',
            {
              variant: 'info',
              persist: true,
            },
          )
          await historize({ store, apberuebersicht })
          closeSnackbar(snackbarKey)
        }
        setPrintingJberYear(+node.label)
        navigate(`/Daten/${[...node.url, 'print'].join('/')}${search}`)
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
        if (!apberuebersicht || apberuebersicht?.historyFixed === false) {
          snackbarKey = enqueueSnackbar(
            'Art, Pop und TPop werden historisiert',
            {
              variant: 'info',
              persist: true,
            },
          )
          await historizeForAp({ store, year: Number(node.label), apId })
          closeSnackbar(snackbarKey)
        }
        setPrintingJberYear(+node.label)
        navigate(`/Daten/${[...node.url, 'print'].join('/')}${search}`)
      }
    }, [
      apId,
      client,
      closeSnackbar,
      enqueueSnackbar,
      navigate,
      node,
      search,
      setPrintingJberYear,
      store,
    ])

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
          data-singleelementname={node.singleElementName}
          data-jahr={node.jahr}
          // need this id to scroll elements into view
          id={node.id}
          ref={ref}
          style={transitionState ? transitionStyles[transitionState] : {}}
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
          {node.labelLeftElements?.length &&
            node.labelLeftElements.map((El, index) => <El key={index} />)}
          <TextSpan
            data-nodeisinactivenodepath={nodeIsInActiveNodePath}
            node={node}
            onClick={onClickNode}
          >
            {nodeLabelFilter?.[node.menuType] ?
              <Highlighter
                searchWords={[nodeLabelFilter[node.menuType]]}
                textToHighlight={node.label}
              />
            : node.label}
          </TextSpan>
          {node.labelRightElements?.length &&
            node.labelRightElements.map((El, index) => <El key={index} />)}
          {showPrintIcon && (
            <PrintIconContainer
              title={printIconTitle}
              onClick={onClickPrint}
            >
              <PrintIcon />
            </PrintIconContainer>
          )}
        </StyledNode>
      </ContextMenuTrigger>
    )
  }),
)
