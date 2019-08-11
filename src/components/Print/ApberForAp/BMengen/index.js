import React from "react"
import styled from "styled-components"
import get from "lodash/get"
import flatten from "lodash/flatten"
import min from "lodash/min"
import sum from "lodash/sum"
import maxBy from "lodash/maxBy"
import groupBy from "lodash/groupBy"
import { useQuery } from "@apollo/react-hooks"

import query from "./query"

const Container = styled.div`
  padding: 0.2cm 0;
  break-inside: avoid;
`
const Title = styled.h3`
  font-size: 16px;
  font-weight: 800;
  margin-bottom: -18px;
`
const Row = styled.div`
  display: flex;
  padding: 0.05cm 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
  page-break-inside: avoid;
`
const YearRow = styled.div`
  display: flex;
  padding: 0.05cm 0;
`
const NkRow = styled(Row)`
  padding: 0.3cm 0 0.05cm 0;
`
const LabelRow = styled(Row)`
  font-size: 12px;
`
const Year = styled.div`
  position: relative;
  left: 10.9cm;
  width: 2cm;
`
const YearSince = styled.div`
  position: relative;
  left: 11.45cm;
  width: 2cm;
`
const Label1 = styled.div`
  min-width: 10cm;
  max-width: 10cm;
`
const Label2Davon = styled.div`
  font-size: 10px;
  text-align: right;
  padding-left: 1.2cm;
  min-width: 2cm;
  max-width: 2cm;
  top: 3px;
  position: relative;
  color: grey;
`
const Label2AfterDavon = styled.div`
  padding-left: 1cm;
  min-width: 8cm;
  max-width: 8cm;
`
const Label3 = styled.div`
  min-width: 10cm;
  max-width: 10cm;
  padding-left: 3cm;
`
const Number = styled.div`
  min-width: 1cm;
  max-width: 1cm;
  text-align: right;
`
const PopBerJahr = styled(Number)``
const TpopBerJahr = styled(Number)``
const PopSeit = styled(Number)`
  margin-left: 1cm;
`
const TpopSeit = styled(Number)``

const BMengen = ({ apId, jahr, startJahr }) => {
  const { data, error, loading } = useQuery(query, {
    variables: { apId, jahr },
  })
  // 1.
  const oneLPop_pop = get(data, "apById.oneLPop.nodes", [])
    .filter(p => get(p, "tpopsByPopId.totalCount") > 0)
    .filter(p => get(p, "popbersByPopId.totalCount") > 0)
  const oneLPop = oneLPop_pop.length
  const oneLPop_popbers = flatten(
    oneLPop_pop.map(p => get(p, "popbersByPopId.nodes", []))
  )

  const oneLTpop_pop = get(data, "apById.oneLTpop.nodes", [])
  const oneLTpop_tpop = flatten(
    oneLTpop_pop.map(p => get(p, "tpopsByPopId.nodes", []))
  )
  const oneLTpop = flatten(
    oneLTpop_tpop.map(p => get(p, "tpopbersByTpopId.totalCount", 0))
  ).filter(tpopbersCount => tpopbersCount > 0).length
  const oneLTpop_tpopbers = flatten(
    oneLTpop_tpop.map(t => get(t, "tpopbersByTpopId.nodes", []))
  )

  const oneRPop = get(data, "apById.oneRPop.nodes", [])
    .filter(p => get(p, "tpopsByPopId.totalCount") > 0)
    .filter(p => get(p, "popbersByPopId.totalCount") > 0).length
  const oneRPop_pop = get(data, "apById.oneRPop.nodes", []).filter(
    p => get(p, "tpopsByPopId.totalCount") > 0
  )
  const oneRPop_popbers = flatten(
    oneRPop_pop.map(p => get(p, "popbersByPopId.nodes", []))
  )
  const oneRPop_popbersByPopId = groupBy(oneRPop_popbers, b => b.popId)
  const oneRPop_lastPopbers = Object.keys(oneRPop_popbersByPopId).map(b =>
    maxBy(oneRPop_popbersByPopId[b], "jahr")
  )

  const oneRTpop_pop = get(data, "apById.oneRTpop.nodes", [])
  const oneRTpop_tpop = flatten(
    oneRTpop_pop.map(p => get(p, "tpopsByPopId.nodes", []))
  )
  const oneRTpop = flatten(
    oneRTpop_tpop.map(p => get(p, "tpopbersByTpopId.totalCount", 0))
  ).filter(tpopbersCount => tpopbersCount > 0).length
  const oneRTpop_tpopbers = flatten(
    oneRTpop_tpop.map(p => get(p, "tpopbersByTpopId.nodes", []))
  )
  const oneRTpop_tpopbersByTpopId = groupBy(oneRTpop_tpopbers, b => b.tpopId)
  const oneRTpop_lastTpopbers = Object.keys(oneRTpop_tpopbersByTpopId).map(b =>
    maxBy(oneRTpop_tpopbersByTpopId[b], "jahr")
  )
  const oneRTpop_firstYear = min(oneRTpop_tpopbers.map(b => b.jahr))

  // 2.
  const twoLPop = oneLPop_popbers.filter(b => b.entwicklung === 3).length
  const twoLTpop = oneLTpop_tpopbers.filter(b => b.entwicklung === 3).length
  const twoRPop = oneRPop_lastPopbers.filter(b => b.entwicklung === 3).length
  const twoRTpop = oneRTpop_lastTpopbers.filter(b => b.entwicklung === 3).length

  // 3.
  const threeLPop = oneLPop_popbers.filter(b => b.entwicklung === 2).length
  const threeLTpop = oneLTpop_tpopbers.filter(b => b.entwicklung === 2).length
  const threeRPop = oneRPop_lastPopbers.filter(b => b.entwicklung === 2).length
  const threeRTpop = oneRTpop_lastTpopbers.filter(b => b.entwicklung === 2)
    .length

  // 4.
  const fourLPop = oneLPop_popbers.filter(b => b.entwicklung === 1).length
  const fourLTpop = oneLTpop_tpopbers.filter(b => b.entwicklung === 1).length
  const fourRPop = oneRPop_lastPopbers.filter(b => b.entwicklung === 1).length
  const fourRTpop = oneRTpop_lastTpopbers.filter(b => b.entwicklung === 1)
    .length

  // 5.
  const fiveLPop = oneLPop_popbers.filter(b => b.entwicklung === 4).length
  const fiveLTpop = oneLTpop_tpopbers.filter(b => b.entwicklung === 4).length
  const fiveRPop = oneRPop_lastPopbers.filter(b => b.entwicklung === 4).length
  const fiveRTpop = oneRTpop_lastTpopbers.filter(b => b.entwicklung === 4)
    .length

  // 6.
  const sixLPop = oneLPop_popbers.filter(b => b.entwicklung === 8).length
  const sixLTpop = oneLTpop_tpopbers.filter(b => b.entwicklung === 8).length
  const sixRPop = oneRPop_lastPopbers.filter(b => b.entwicklung === 8).length
  const sixRTpop = oneRTpop_lastTpopbers.filter(b => b.entwicklung === 8).length

  // 7.
  const sevenLPop_allPops = get(data, "apById.sevenLPop.nodes", []).filter(
    p => get(p, "tpopsByPopId.totalCount") > 0
  ).length
  const sevenLPop = sevenLPop_allPops - oneLPop
  const sevenLTpop_allTpops = sum(
    get(data, "apById.sevenLTpop.nodes", []).map(p =>
      get(p, "tpopsByPopId.totalCount")
    )
  )
  const sevenLTpop = sevenLTpop_allTpops - oneLTpop
  const sevenRPop = sevenLPop_allPops - oneRPop
  const sevenRTpop = sevenLTpop_allTpops - oneRTpop

  if (error) return `Fehler: ${error.message}`

  return (
    <Container>
      <Title>B. Bestandesentwicklung</Title>
      <YearRow>
        <Year>{jahr}</Year>
        <YearSince>{`Seit ${loading ? "..." : oneRTpop_firstYear}`}</YearSince>
      </YearRow>
      <LabelRow>
        <Label1 />
        <PopBerJahr>Pop</PopBerJahr>
        <TpopBerJahr>TPop</TpopBerJahr>
        <PopSeit>Pop</PopSeit>
        <TpopSeit>TPop</TpopSeit>
      </LabelRow>
      <Row>
        <Label1>kontrolliert (inkl. Ansaatversuche)</Label1>
        <PopBerJahr>{loading ? "..." : oneLPop}</PopBerJahr>
        <TpopBerJahr>{loading ? "..." : oneLTpop}</TpopBerJahr>
        <PopSeit>{loading ? "..." : oneRPop}</PopSeit>
        <TpopSeit>{loading ? "..." : oneRTpop}</TpopSeit>
      </Row>
      <Row>
        <Label2Davon>davon:</Label2Davon>
        <Label2AfterDavon>zunehmend</Label2AfterDavon>
        <PopBerJahr>{loading ? "..." : twoLPop}</PopBerJahr>
        <TpopBerJahr>{loading ? "..." : twoLTpop}</TpopBerJahr>
        <PopSeit>{loading ? "..." : twoRPop}</PopSeit>
        <TpopSeit>{loading ? "..." : twoRTpop}</TpopSeit>
      </Row>
      <Row>
        <Label3>stabil</Label3>
        <PopBerJahr>{loading ? "..." : threeLPop}</PopBerJahr>
        <TpopBerJahr>{loading ? "..." : threeLTpop}</TpopBerJahr>
        <PopSeit>{loading ? "..." : threeRPop}</PopSeit>
        <TpopSeit>{loading ? "..." : threeRTpop}</TpopSeit>
      </Row>
      <Row>
        <Label3>abnehmend</Label3>
        <PopBerJahr>{loading ? "..." : fourLPop}</PopBerJahr>
        <TpopBerJahr>{loading ? "..." : fourLTpop}</TpopBerJahr>
        <PopSeit>{loading ? "..." : fourRPop}</PopSeit>
        <TpopSeit>{loading ? "..." : fourRTpop}</TpopSeit>
      </Row>
      <Row>
        <Label3>unsicher</Label3>
        <PopBerJahr>{loading ? "..." : fiveLPop}</PopBerJahr>
        <TpopBerJahr>{loading ? "..." : fiveLTpop}</TpopBerJahr>
        <PopSeit>{loading ? "..." : fiveRPop}</PopSeit>
        <TpopSeit>{loading ? "..." : fiveRTpop}</TpopSeit>
      </Row>
      <Row>
        <Label3>erloschen</Label3>
        <PopBerJahr>{loading ? "..." : sixLPop}</PopBerJahr>
        <TpopBerJahr>{loading ? "..." : sixLTpop}</TpopBerJahr>
        <PopSeit>{loading ? "..." : sixRPop}</PopSeit>
        <TpopSeit>{loading ? "..." : sixRTpop}</TpopSeit>
      </Row>
      <NkRow>
        <Label1>nicht kontrolliert (inkl. Ansaatversuche)</Label1>
        <PopBerJahr>{loading ? "..." : sevenLPop}</PopBerJahr>
        <TpopBerJahr>{loading ? "..." : sevenLTpop}</TpopBerJahr>
        <PopSeit>{loading ? "..." : sevenRPop}</PopSeit>
        <TpopSeit>{loading ? "..." : sevenRTpop}</TpopSeit>
      </NkRow>
    </Container>
  )
}

export default BMengen
