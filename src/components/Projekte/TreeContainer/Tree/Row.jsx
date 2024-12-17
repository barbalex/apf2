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
import { useProjekteTabs } from '../../../../modules/useProjekteTabs.js'
import { historizeForAp } from '../../../../modules/historizeForAp.js'
import { historize } from '../../../../modules/historize.js'
import { useSearchParamsState } from '../../../../modules/useSearchParamsState.js'
// adding ?react to .svg leads to error:
// Warning: </src/components/Projekte/Karte/layers/Pop/statusGroupSymbols/100.svg?react /> is using incorrect casing.
// Use PascalCase for React components, or lowercase for HTML elements
// https://github.com/pd4d10/vite-plugin-svgr/issues/95
import TpopSvg100 from '../../Karte/layers/Tpop/statusGroupSymbols/100.svg'
import TpopSvg100Highlighted from '../../Karte/layers/Tpop/statusGroupSymbols/100Highlighted.svg'
import TpopSvg101 from '../../Karte/layers/Tpop/statusGroupSymbols/101.svg'
import TpopSvg101Highlighted from '../../Karte/layers/Tpop/statusGroupSymbols/101Highlighted.svg'
import TpopSvg200 from '../../Karte/layers/Tpop/statusGroupSymbols/200.svg'
import TpopSvg200Highlighted from '../../Karte/layers/Tpop/statusGroupSymbols/200Highlighted.svg'
import TpopSvg201 from '../../Karte/layers/Tpop/statusGroupSymbols/201.svg'
import TpopSvg201Highlighted from '../../Karte/layers/Tpop/statusGroupSymbols/201Highlighted.svg'
import TpopSvg202 from '../../Karte/layers/Tpop/statusGroupSymbols/202.svg'
import TpopSvg202Highlighted from '../../Karte/layers/Tpop/statusGroupSymbols/202Highlighted.svg'
import TpopSvg300 from '../../Karte/layers/Tpop/statusGroupSymbols/300.svg'
import TpopSvg300Highlighted from '../../Karte/layers/Tpop/statusGroupSymbols/300Highlighted.svg'
import TpopIcon from '../../Karte/layers/Tpop/tpop.svg'
import TpopIconHighlighted from '../../Karte/layers/Tpop/tpopHighlighted.svg'
import TpopUIcon from '../../Karte/layers/Tpop/statusGroup/u.svg'
import TpopUIconHighlighted from '../../Karte/layers/Tpop/statusGroup/uHighlighted.svg'
import TpopAIcon from '../../Karte/layers/Tpop/statusGroup/a.svg'
import TpopAIconHighlighted from '../../Karte/layers/Tpop/statusGroup/aHighlighted.svg'
import TpopPIcon from '../../Karte/layers/Tpop/statusGroup/p.svg'
import TpopPIconHighlighted from '../../Karte/layers/Tpop/statusGroup/pHighlighted.svg'
import TpopQIcon from '../../Karte/layers/Tpop/statusGroup/q.svg'
import TpopQIconHighlighted from '../../Karte/layers/Tpop/statusGroup/qHighlighted.svg'
import PopSvg100 from '../../Karte/layers/Pop/statusGroupSymbols/100.svg'
import PopSvg100Highlighted from '../../Karte/layers/Pop/statusGroupSymbols/100Highlighted.svg'
import PopSvg101 from '../../Karte/layers/Pop/statusGroupSymbols/101.svg'
import PopSvg101Highlighted from '../../Karte/layers/Pop/statusGroupSymbols/101Highlighted.svg'
import PopSvg200 from '../../Karte/layers/Pop/statusGroupSymbols/200.svg'
import PopSvg200Highlighted from '../../Karte/layers/Pop/statusGroupSymbols/200Highlighted.svg'
import PopSvg201 from '../../Karte/layers/Pop/statusGroupSymbols/201.svg'
import PopSvg201Highlighted from '../../Karte/layers/Pop/statusGroupSymbols/201Highlighted.svg'
import PopSvg202 from '../../Karte/layers/Pop/statusGroupSymbols/202.svg'
import PopSvg202Highlighted from '../../Karte/layers/Pop/statusGroupSymbols/202Highlighted.svg'
import PopSvg300 from '../../Karte/layers/Pop/statusGroupSymbols/300.svg'
import PopSvg300Highlighted from '../../Karte/layers/Pop/statusGroupSymbols/300Highlighted.svg'
import PopIcon from '../../Karte/layers/Pop/pop.svg'
import PopIconHighlighted from '../../Karte/layers/Pop/popHighlighted.svg'
import PopUIcon from '../../Karte/layers/Pop/statusGroup/u.svg'
import PopUIconHighlighted from '../../Karte/layers/Pop/statusGroup/uHighlighted.svg'
import PopAIcon from '../../Karte/layers/Pop/statusGroup/a.svg'
import PopAIconHighlighted from '../../Karte/layers/Pop/statusGroup/aHighlighted.svg'
import PopPIcon from '../../Karte/layers/Pop/statusGroup/p.svg'
import PopPIconHighlighted from '../../Karte/layers/Pop/statusGroup/pHighlighted.svg'
import PopQIcon from '../../Karte/layers/Pop/statusGroup/q.svg'
import PopQIconHighlighted from '../../Karte/layers/Pop/statusGroup/qHighlighted.svg'

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
const IconContainer0 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-right: 4px;
  margin-left: -2px;
`
export const PopMapIconComponent = () => (
  <IconContainer0 title="Populationen in Karte sichtbar">
    <PopMapIcon />
  </IconContainer0>
)
const TpopMapIcon = styled(StyledMapIcon)`
  color: #016f19 !important;
`
export const TpopMapIconComponent = () => (
  <IconContainer0 title="Teil-Populationen in Karte sichtbar">
    <TpopMapIcon />
  </IconContainer0>
)
const BeobNichtBeurteiltMapIcon = styled(StyledMapIcon)`
  color: #9a009a !important;
`
export const BeobNichtBeurteiltMapIconComponent = () => (
  <IconContainer0 title="Beobachtungen nicht beurteilt in Karte sichtbar">
    <BeobNichtBeurteiltMapIcon />
  </IconContainer0>
)
const BeobNichtZuzuordnenMapIcon = styled(StyledMapIcon)`
  color: #ffe4ff !important;
`
export const BeobNichtZuzuordnenMapIconComponent = () => (
  <IconContainer0 title="Beobachtungen nicht zuzuordnen in Karte sichtbar">
    <BeobNichtZuzuordnenMapIcon />
  </IconContainer0>
)
const BeobZugeordnetMapIcon = styled(StyledMapIcon)`
  color: #ff00ff !important;
`
export const BeobZugeordnetMapIconComponent = () => (
  <IconContainer0 title="Beobachtungen zugeordnet in Karte sichtbar">
    <BeobZugeordnetMapIcon />
  </IconContainer0>
)
const BeobNichtBeurteiltFilteredMapIcon = styled(BeobNichtBeurteiltMapIcon)`
  paint-order: stroke;
  stroke-width: 8px;
  stroke: #fff900;
`
export const BeobNichtBeurteiltFilteredMapIconComponent = () => (
  <IconContainer0 title="Beobachtung in Karte hervorgehoben">
    <BeobNichtBeurteiltFilteredMapIcon />
  </IconContainer0>
)
const BeobNichtZuzuordnenFilteredMapIcon = styled(BeobNichtZuzuordnenMapIcon)`
  paint-order: stroke;
  stroke-width: 8px;
  stroke: #fff900;
`
export const BeobNichtZuzuordnenFilteredMapIconComponent = () => (
  <IconContainer0 title="Beobachtung in Karte hervorgehoben">
    <BeobNichtZuzuordnenFilteredMapIcon />
  </IconContainer0>
)
const BeobZugeordnetFilteredMapIcon = styled(BeobZugeordnetMapIcon)`
  paint-order: stroke;
  stroke-width: 8px;
  stroke: #fff900;
`
export const BeobZugeordnetFilteredMapIconComponent = () => (
  <IconContainer0 title="Beobachtung in Karte hervorgehoben">
    <BeobZugeordnetFilteredMapIcon />
  </IconContainer0>
)
const MovingIcon = styled(MdOutlineMoveDown)`
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
    let showPrintIcon = false
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
    if (node.menuType === 'apber' || node.menuType === 'apberuebersicht') {
      showPrintIcon = true
    }
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

    const [projekteTabs] = useProjekteTabs()
    const karteIsVisible = projekteTabs.includes('karte')

    const tpopIconIsHighlighted =
      karteIsVisible && activeApfloraLayers.includes('tpop') && nodeIsActive
    const TpopIcon =
      node.status ?
        tpopIconIsHighlighted ?
          tpopIcons[tpopIconName][node.status + 'Highlighted']
        : tpopIcons[tpopIconName][node.status]
      : tpopIconIsHighlighted ? TpopQIconHighlighted
      : TpopQIcon

    const popIconIsHighlighted =
      karteIsVisible && activeApfloraLayers.includes('pop') && nodeIsActive
    const PopIcon =
      node.status ?
        popIconIsHighlighted ?
          popIcons[popIconName][node.status + 'Highlighted']
        : popIcons[popIconName][node.status]
      : popIconIsHighlighted ? PopQIconHighlighted
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
          {isMoving && (
            <div title="zum Verschieben gemerkt, bereit um in einer anderen Art einzufügen">
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
