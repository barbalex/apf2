import React, { useContext, useMemo } from "react"
import get from "lodash/get"
import flatten from "lodash/flatten"
import { observer } from "mobx-react-lite"
import MarkerClusterGroup from "react-leaflet-markercluster"
import { useQuery } from "react-apollo-hooks"

import Marker from "./Marker"
import storeContext from "../../../../../storeContext"
import query from "./query"
import idsInsideFeatureCollection from "../../../../../modules/idsInsideFeatureCollectionLv95"
import { simpleTypes as popType } from "../../../../../store/NodeFilterTree/pop"
import { simpleTypes as tpopType } from "../../../../../store/NodeFilterTree/tpop"

const iconCreateFunction = function(cluster) {
  const markers = cluster.getAllChildMarkers()
  const hasHighlightedPop = markers.some(
    m => m.options.icon.options.className === "popIconHighlighted"
  )
  const className = hasHighlightedPop ? "popClusterHighlighted" : "popCluster"
  if (typeof window === "undefined") return () => {}
  return window.L.divIcon({
    html: markers.length,
    className,
    iconSize: window.L.point(40, 40),
  })
}

const Pop = ({ treeName }) => {
  const store = useContext(storeContext)
  const {
    nodeFilter,
    activeApfloraLayers,
    addError,
    mapFilter,
    setRefetchKey,
  } = store
  const tree = store[treeName]
  const { map } = tree
  const { setPopIdsFiltered } = map

  const activeNodes = store[`${treeName}ActiveNodes`]
  const projId = activeNodes.projekt || "99999999-9999-9999-9999-999999999999"
  const apId = activeNodes.ap || "99999999-9999-9999-9999-999999999999"
  const isActiveInMap = activeApfloraLayers.includes("pop")
  const tpopLayerIsActive = activeApfloraLayers.includes("tpop")
  const perProj = apId === "99999999-9999-9999-9999-999999999999"
  const perAp = apId !== "99999999-9999-9999-9999-999999999999"

  const popFilter = { x: { isNull: false }, y: { isNull: false } }
  const popFilterValues = Object.entries(nodeFilter[treeName].pop).filter(
    e => e[1] || e[1] === 0
  )
  popFilterValues.forEach(([key, value]) => {
    const expression = popType[key] === "string" ? "includes" : "equalTo"
    popFilter[key] = { [expression]: value }
  })
  if (!!tree.nodeLabelFilter.pop) {
    popFilter.label = {
      includesInsensitive: tree.nodeLabelFilter.pop,
    }
  }

  const tpopFilter = { x: { isNull: false }, y: { isNull: false } }
  const tpopFilterValues = Object.entries(nodeFilter[treeName].tpop).filter(
    e => e[1] || e[1] === 0
  )
  tpopFilterValues.forEach(([key, value]) => {
    const expression = tpopType[key] === "string" ? "includes" : "equalTo"
    tpopFilter[key] = { [expression]: value }
  })
  if (!!tree.nodeLabelFilter.tpop) {
    tpopFilter.label = {
      includesInsensitive: tree.nodeLabelFilter.tpop,
    }
  }

  var { data, error, refetch } = useQuery(query, {
    variables: {
      perAp,
      apId,
      perProj,
      projId,
      tpopLayerIsActive,
      isActiveInMap,
      popFilter,
      tpopFilter,
    },
  })
  setRefetchKey({ key: "popForMap", value: refetch })

  if (error) {
    addError(
      new Error(
        `Fehler beim Laden der Populationen für die Karte: ${error.message}`
      )
    )
  }

  const aps = get(
    data,
    `projektById.${!!perAp ? "perAp" : "perProj"}.nodes`,
    []
  )
  let pops = useMemo(
    () => flatten(aps.map(ap => get(ap, "popsByApId.nodes", []))),
    [aps]
  )

  // if tpop are filtered, only show their pop
  if (activeApfloraLayers.includes("tpop")) {
    const popsForTpops = flatten(aps.map(ap => get(ap, "popsByApId.nodes", [])))
    // adding useMemo here results in error ???
    const tpops = flatten(
      popsForTpops.map(pop => get(pop, "tpopsByPopId.nodes", []))
    )
    const popIdsOfTpops = tpops.map(t => t.popId)
    pops = pops.filter(p => popIdsOfTpops.includes(p.id))
  }

  const mapPopIdsFiltered = useMemo(
    () =>
      idsInsideFeatureCollection({
        mapFilter,
        data: pops,
        idKey: "id",
        xKey: "x",
        yKey: "y",
      }),
    [mapFilter, pops]
  )
  setPopIdsFiltered(mapPopIdsFiltered)

  return (
    <MarkerClusterGroup
      maxClusterRadius={66}
      iconCreateFunction={iconCreateFunction}
    >
      {pops.map(pop => (
        <Marker key={pop.id} treeName={treeName} pop={pop} />
      ))}
    </MarkerClusterGroup>
  )
}

export default observer(Pop)
