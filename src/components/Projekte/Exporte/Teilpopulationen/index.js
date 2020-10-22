import React, { useContext, useState, useCallback } from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import styled from 'styled-components'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'
import { useSnackbar } from 'notistack'

import SelectLoadingOptions from '../../../shared/SelectLoadingOptions'
import exportModule from '../../../../modules/export'
import queryAeTaxonomies from './queryAeTaxonomies'
import storeContext from '../../../../storeContext'

const StyledCard = styled(Card)`
  margin: 10px 0;
  background-color: #fff8e1 !important;
`
const StyledCardActions = styled(CardActions)`
  justify-content: space-between;
  cursor: pointer;
  height: auto !important;
`
const CardActionIconButton = styled(IconButton)`
  transform: ${(props) => (props['data-expanded'] ? 'rotate(180deg)' : 'none')};
`
const CardActionTitle = styled.div`
  padding-left: 8px;
  font-weight: bold;
  word-break: break-word;
  user-select: none;
`
const StyledCardContent = styled(CardContent)`
  margin: -15px 0 0 0;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: stretch;
  align-content: stretch;
  overflow: auto;
`
const DownloadCardButton = styled(Button)`
  flex-basis: 450px;
  > span:first-of-type {
    text-transform: none !important;
    font-weight: 500;
    display: block;
    text-align: left;
    justify-content: flex-start !important;
    user-select: none;
  }
`
const AutocompleteContainer = styled.div`
  flex-basis: 450px;
  padding-left: 16px;
`
const Li = styled.li`
  margin-top: -6px;
  margin-bottom: -3px;
`
const EwmDiv = styled.div`
  margin-top: -14px;
  margin-bottom: 3px;
`

const isRemoteHost =
  typeof window !== 'undefined' && window.location.hostname !== 'localhost'

const Teilpopulationen = ({ treeName }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)

  const {
    enqueNotification,
    removeNotification,
    dataFilterTableIsFiltered,
    tpopGqlFilter,
  } = store

  const [expanded, setExpanded] = useState(false)
  const { closeSnackbar } = useSnackbar()
  const [ewmMessage, setEwmMessage] = useState('')

  const onClickAction = useCallback(() => setExpanded(!expanded), [expanded])
  const onClickButton = useCallback(async () => {
    const notif = enqueNotification({
      message: `Export "Teilpopulationen" wird vorbereitet...`,
      options: {
        variant: 'info',
        persist: true,
      },
    })
    let result
    try {
      result = await client.query({
        query: gql`
          query tpopForExportQuery($filter: TpopFilter) {
            allTpops(
              filter: $filter
              orderBy: [AP_NAME_ASC, POP_BY_POP_ID__NR_ASC, NR_ASC]
            ) {
              nodes {
                popByPopId {
                  id
                  apByApId {
                    id
                    aeTaxonomyByArtId {
                      id
                      artname
                      familie
                    }
                    apBearbstandWerteByBearbeitung {
                      id
                      text
                    }
                    startJahr
                    apUmsetzungWerteByUmsetzung {
                      id
                      text
                    }
                  }
                  id
                  nr
                  name
                  popStatusWerteByStatus {
                    id
                    text
                  }
                  bekanntSeit
                  statusUnklar
                  statusUnklarBegruendung
                  x: lv95X
                  y: lv95Y
                }
                id
                nr
                gemeinde
                flurname
                status
                popStatusWerteByStatus {
                  id
                  text
                }
                bekanntSeit
                statusUnklar
                statusUnklarGrund
                x: lv95X
                y: lv95Y
                radius
                hoehe
                exposition
                klima
                neigung
                beschreibung
                katasterNr
                apberRelevant
                apberRelevantGrund
                eigentuemer
                kontakt
                nutzungszone
                bewirtschafter
                bewirtschaftung
                ekfrequenz
                ekfrequenzAbweichend
                adresseByEkfKontrolleur {
                  id
                  name
                }
                changed
                changedBy
              }
            }
          }
        `,
        variables: {
          filter: tpopGqlFilter,
        },
      })
    } catch (error) {
      enqueNotification({
        message: error.message,
        options: { variant: 'error' },
      })
    }
    const rows = get(result.data, 'allTpops.nodes', []).map((n) => ({
      apId: get(n, 'popByPopId.apByApId.id') || null,
      apFamilie:
        get(n, 'popByPopId.apByApId.aeTaxonomyByArtId.familie') || null,
      apArtname:
        get(n, 'popByPopId.apByApId.aeTaxonomyByArtId.artname') || null,
      apBearbeitung:
        get(n, 'popByPopId.apByApId.apBearbstandWerteByBearbeitung.text') ||
        null,
      apStartJahr: get(n, 'popByPopId.apByApId.startJahr') || null,
      apUmsetzung:
        get(n, 'popByPopId.apByApId.apUmsetzungWerteByUmsetzung.text') || null,
      popId: get(n, 'popByPopId.id') || null,
      popNr: get(n, 'popByPopId.nr') || null,
      popName: get(n, 'popByPopId.name') || null,
      popStatus: get(n, 'popByPopId.popStatusWerteByStatus.text') || null,
      popBekanntSeit: get(n, 'popByPopId.bekanntSeit') || null,
      popStatusUnklar: get(n, 'popByPopId.statusUnklar') || null,
      popStatusUnklarBegruendung:
        get(n, 'popByPopId.statusUnklarBegruendung') || null,
      popX: get(n, 'popByPopId.x') || null,
      popY: get(n, 'popByPopId.y') || null,
      id: n.id,
      nr: n.nr,
      gemeinde: n.gemeinde,
      flurname: n.flurname,
      status: n.status,
      statusDecodiert: get(n, 'popStatusWerteByStatus.text') || null,
      bekanntSeit: n.bekanntSeit,
      statusUnklar: n.statusUnklar,
      statusUnklarGrund: n.statusUnklarGrund,
      x: n.x,
      y: n.y,
      radius: n.radius,
      hoehe: n.hoehe,
      exposition: n.exposition,
      klima: n.klima,
      neigung: n.neigung,
      beschreibung: n.beschreibung,
      katasterNr: n.katasterNr,
      apberRelevant: n.apberRelevant,
      apberRelevantGrund: n.apberRelevantGrund,
      eigentuemer: n.eigentuemer,
      kontakt: n.kontakt,
      nutzungszone: n.nutzungszone,
      bewirtschafter: n.bewirtschafter,
      bewirtschaftung: n.bewirtschaftung,
      ekfrequenz: n.ekfrequenz,
      ekfrequenzAbweichend: n.ekfrequenzAbweichend,
      ekfKontrolleur: get(n, 'adresseByEkfKontrolleur.name') || null,
      changed: n.changed,
      changedBy: n.changedBy,
    }))
    const enrichedData = rows.map((oWithout) => {
      let o = { ...oWithout }
      let nachBeginnAp = null
      if (
        o.apStartJahr &&
        o.bekanntSeit &&
        [200, 201, 202].includes(o.status)
      ) {
        if (o.apStartJahr <= o.bekanntSeit) {
          nachBeginnAp = true
        } else {
          nachBeginnAp = false
        }
      }
      o.angesiedeltNachBeginnAp = nachBeginnAp
      return o
    })
    removeNotification(notif)
    closeSnackbar(notif)
    if (rows.length === 0) {
      return enqueNotification({
        message: 'Die Abfrage retournierte 0 Datensätze',
        options: {
          variant: 'warning',
        },
      })
    }
    exportModule({
      data: enrichedData,
      fileName: 'Teilpopulationen',
      store,
    })
  }, [
    client,
    closeSnackbar,
    enqueNotification,
    removeNotification,
    store,
    tpopGqlFilter,
  ])

  const aeTaxonomiesfilter = useCallback(
    (inputValue) =>
      !!inputValue
        ? {
            artname: { includesInsensitive: inputValue },
            // needed to turn this off because the postgraphile addon caused cors issues in production
            apByArtIdExists: true,
          }
        : { artname: { isNull: false } /*, apByArtIdExists: true*/ },
    [],
  )

  const tpopIsFiltered = dataFilterTableIsFiltered({
    treeName: 'tree',
    table: 'tpop',
  })

  return (
    <StyledCard>
      <StyledCardActions disableSpacing onClick={onClickAction}>
        <CardActionTitle>Teilpopulationen</CardActionTitle>
        <CardActionIconButton
          data-expanded={expanded}
          aria-expanded={expanded}
          aria-label="öffnen"
        >
          <Icon title={expanded ? 'schliessen' : 'öffnen'}>
            <ExpandMoreIcon />
          </Icon>
        </CardActionIconButton>
      </StyledCardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <StyledCardContent>
          <DownloadCardButton onClick={onClickButton}>
            {tpopIsFiltered
              ? 'Teilpopulationen (gefiltert)'
              : 'Teilpopulationen'}
          </DownloadCardButton>
          <DownloadCardButton
            onClick={async () => {
              const notif = enqueNotification({
                message: `Export "TeilpopulationenWebGisBun" wird vorbereitet...`,
                options: {
                  variant: 'info',
                  persist: true,
                },
              })
              let result
              try {
                result = await client.query({
                  query: await import('./allVTpopWebgisbuns').then(
                    (m) => m.default,
                  ),
                })
              } catch (error) {
                enqueNotification({
                  message: error.message,
                  options: { variant: 'error' },
                })
              }
              const rows = get(result.data, 'allVTpopWebgisbuns.nodes', [])
              removeNotification(notif)
              closeSnackbar(notif)
              if (rows.length === 0) {
                return enqueNotification({
                  message: 'Die Abfrage retournierte 0 Datensätze',
                  options: {
                    variant: 'warning',
                  },
                })
              }
              exportModule({
                data: rows,
                fileName: 'TeilpopulationenWebGisBun',
                idKey: 'TPOPID',
                xKey: 'TPOP_WGS84LAT',
                yKey: 'TPOP_WGS84LONG',
                store,
              })
            }}
          >
            Teilpopulationen für WebGIS BUN
          </DownloadCardButton>
          <DownloadCardButton
            onClick={async () => {
              const notif = enqueNotification({
                message: `Export "Teilpopulationen" wird vorbereitet...`,
                options: {
                  variant: 'info',
                  persist: true,
                },
              })
              let result
              try {
                result = await client.query({
                  query: await import('./queryTpopKml').then((m) => m.default),
                })
              } catch (error) {
                enqueNotification({
                  message: error.message,
                  options: { variant: 'error' },
                })
              }
              const rows = get(result.data, 'allTpops.nodes', []).map((z) => ({
                art: get(z, 'vTpopKmlsById.nodes[0].art', ''),
                label: get(z, 'vTpopKmlsById.nodes[0].label', ''),
                inhalte: get(z, 'vTpopKmlsById.nodes[0].inhalte', ''),
                id: get(z, 'vTpopKmlsById.nodes[0].id', ''),
                wgs84Lat: get(z, 'vTpopKmlsById.nodes[0].wgs84Lat', ''),
                wgs84Long: get(z, 'vTpopKmlsById.nodes[0].wgs84Long', ''),
                url: get(z, 'vTpopKmlsById.nodes[0].url', ''),
              }))
              removeNotification(notif)
              closeSnackbar(notif)
              if (rows.length === 0) {
                return enqueNotification({
                  message: 'Die Abfrage retournierte 0 Datensätze',
                  options: {
                    variant: 'warning',
                  },
                })
              }
              exportModule({
                data: sortBy(rows, ['art', 'label']),
                fileName: 'Teilpopulationen',
                store,
                kml: true,
              })
            }}
          >
            <div>Teilpopulationen für Google Earth</div>
            <div>(beschriftet mit PopNr/TPopNr)</div>
          </DownloadCardButton>
          <DownloadCardButton
            onClick={async () => {
              const notif = enqueNotification({
                message: `Export "TeilpopulationenNachNamen" wird vorbereitet...`,
                options: {
                  variant: 'info',
                  persist: true,
                },
              })
              let result
              try {
                result = await client.query({
                  query: await import('./queryTpopKmlNamen').then(
                    (m) => m.default,
                  ),
                })
              } catch (error) {
                enqueNotification({
                  message: error.message,
                  options: { variant: 'error' },
                })
              }
              const rows = get(result.data, 'allTpops.nodes', []).map((z) => ({
                art: get(z, 'vTpopKmlnamenById.nodes[0].art', ''),
                label: get(z, 'vTpopKmlnamenById.nodes[0].label', ''),
                inhalte: get(z, 'vTpopKmlnamenById.nodes[0].inhalte', ''),
                id: get(z, 'vTpopKmlnamenById.nodes[0].id', ''),
                wgs84Lat: get(z, 'vTpopKmlnamenById.nodes[0].wgs84Lat', ''),
                wgs84Long: get(z, 'vTpopKmlnamenById.nodes[0].wgs84Long', ''),
                url: get(z, 'vTpopKmlnamenById.nodes[0].url', ''),
              }))
              removeNotification(notif)
              closeSnackbar(notif)
              if (rows.length === 0) {
                return enqueNotification({
                  message: 'Die Abfrage retournierte 0 Datensätze',
                  options: {
                    variant: 'warning',
                  },
                })
              }
              exportModule({
                data: sortBy(rows, ['art', 'label']),
                fileName: 'TeilpopulationenNachNamen',
                store,
                kml: true,
              })
            }}
          >
            <div>Teilpopulationen für Google Earth</div>
            <div>(beschriftet mit Artname, PopNr/TPopNr)</div>
          </DownloadCardButton>
          <DownloadCardButton
            onClick={async () => {
              const notif = enqueNotification({
                message: `Export "TeilpopulationenVonApArtenOhneBekanntSeit" wird vorbereitet...`,
                options: {
                  variant: 'info',
                  persist: true,
                },
              })
              let result
              try {
                result = await client.query({
                  query: await import('./allVTpopOhnebekanntseits').then(
                    (m) => m.default,
                  ),
                })
              } catch (error) {
                enqueNotification({
                  message: error.message,
                  options: { variant: 'error' },
                })
              }
              const rows = get(
                result.data,
                'allVTpopOhnebekanntseits.nodes',
                [],
              )
              removeNotification(notif)
              closeSnackbar(notif)
              if (rows.length === 0) {
                return enqueNotification({
                  message: 'Die Abfrage retournierte 0 Datensätze',
                  options: {
                    variant: 'warning',
                  },
                })
              }
              exportModule({
                data: rows,
                fileName: 'TeilpopulationenVonApArtenOhneBekanntSeit',
                store,
              })
            }}
          >
            <div>Teilpopulationen von AP-Arten</div>
            <div>{'ohne "Bekannt seit"'}</div>
          </DownloadCardButton>
          <DownloadCardButton
            onClick={async () => {
              const notif = enqueNotification({
                message: `Export "TeilpopulationenOhneApBerichtRelevant" wird vorbereitet...`,
                options: {
                  variant: 'info',
                  persist: true,
                },
              })
              let result
              try {
                result = await client.query({
                  query: await import('./allVTpopOhneapberichtrelevants').then(
                    (m) => m.default,
                  ),
                })
              } catch (error) {
                enqueNotification({
                  message: error.message,
                  options: { variant: 'error' },
                })
              }
              const rows = get(
                result.data,
                'allVTpopOhneapberichtrelevants.nodes',
                [],
              )
              removeNotification(notif)
              closeSnackbar(notif)
              if (rows.length === 0) {
                return enqueNotification({
                  message: 'Die Abfrage retournierte 0 Datensätze',
                  options: {
                    variant: 'warning',
                  },
                })
              }
              exportModule({
                data: rows,
                fileName: 'TeilpopulationenOhneApBerichtRelevant',
                store,
              })
            }}
          >
            <div>Teilpopulationen ohne Eintrag</div>
            <div>{'im Feld "Für AP-Bericht relevant"'}</div>
          </DownloadCardButton>
          <DownloadCardButton
            onClick={async () => {
              const notif = enqueNotification({
                message: `Export "TeilpopulationenAnzahlMassnahmen" wird vorbereitet...`,
                options: {
                  variant: 'info',
                  persist: true,
                },
              })
              let result
              try {
                result = await client.query({
                  query: await import('./queryTpopAnzMassns').then(
                    (m) => m.default,
                  ),
                })
              } catch (error) {
                enqueNotification({
                  message: error.message,
                  options: { variant: 'error' },
                })
              }
              const rows = get(result.data, 'allTpops.nodes', []).map((n) => ({
                ap_id: get(n, 'vTpopAnzmassnsById.nodes[0].apId', ''),
                familie: get(n, 'vTpopAnzmassnsById.nodes[0].familie', ''),
                artname: get(n, 'vTpopAnzmassnsById.nodes[0].artname', ''),
                ap_bearbeitung: get(
                  n,
                  'vTpopAnzmassnsById.nodes[0].apBearbeitung',
                  '',
                ),
                ap_start_jahr: get(
                  n,
                  'vTpopAnzmassnsById.nodes[0].apStartJahr',
                  '',
                ),
                ap_umsetzung: get(
                  n,
                  'vTpopAnzmassnsById.nodes[0].apUmsetzung',
                  '',
                ),
                pop_id: get(n, 'vTpopAnzmassnsById.nodes[0].popId', ''),
                pop_nr: get(n, 'vTpopAnzmassnsById.nodes[0].popNr', ''),
                pop_name: get(n, 'vTpopAnzmassnsById.nodes[0].popName', ''),
                pop_status: get(n, 'vTpopAnzmassnsById.nodes[0].popStatus', ''),
                pop_bekannt_seit: get(
                  n,
                  'vTpopAnzmassnsById.nodes[0].popBekanntSeit',
                  '',
                ),
                pop_status_unklar: get(
                  n,
                  'vTpopAnzmassnsById.nodes[0].popStatusUnklar',
                  '',
                ),
                pop_status_unklar_begruendung: get(
                  n,
                  'vTpopAnzmassnsById.nodes[0].popStatusUnklarBegruendung',
                  '',
                ),
                pop_x: get(n, 'vTpopAnzmassnsById.nodes[0].popX', ''),
                pop_y: get(n, 'vTpopAnzmassnsById.nodes[0].popY', ''),
                id: get(n, 'vTpopAnzmassnsById.nodes[0].id', ''),
                nr: get(n, 'vTpopAnzmassnsById.nodes[0].nr', ''),
                gemeinde: get(n, 'vTpopAnzmassnsById.nodes[0].gemeinde', ''),
                flurname: get(n, 'vTpopAnzmassnsById.nodes[0].flurname', ''),
                status: get(n, 'vTpopAnzmassnsById.nodes[0].status', ''),
                bekannt_seit: get(
                  n,
                  'vTpopAnzmassnsById.nodes[0].bekanntSeit',
                  '',
                ),
                status_unklar: get(
                  n,
                  'vTpopAnzmassnsById.nodes[0].statusUnklar',
                  '',
                ),
                status_unklar_grund: get(
                  n,
                  'vTpopAnzmassnsById.nodes[0].statusUnklarGrund',
                  '',
                ),
                lv95X: get(n, 'vTpopAnzmassnsById.nodes[0].x', ''),
                lv95Y: get(n, 'vTpopAnzmassnsById.nodes[0].y', ''),
                radius: get(n, 'vTpopAnzmassnsById.nodes[0].radius', ''),
                hoehe: get(n, 'vTpopAnzmassnsById.nodes[0].hoehe', ''),
                exposition: get(
                  n,
                  'vTpopAnzmassnsById.nodes[0].exposition',
                  '',
                ),
                klima: get(n, 'vTpopAnzmassnsById.nodes[0].klima', ''),
                neigung: get(n, 'vTpopAnzmassnsById.nodes[0].neigung', ''),
                beschreibung: get(
                  n,
                  'vTpopAnzmassnsById.nodes[0].beschreibung',
                  '',
                ),
                kataster_nr: get(
                  n,
                  'vTpopAnzmassnsById.nodes[0].katasterNr',
                  '',
                ),
                apber_relevant: get(
                  n,
                  'vTpopAnzmassnsById.nodes[0].apberRelevant',
                  '',
                ),
                apber_relevant_grund: get(
                  n,
                  'vTpopAnzmassnsById.nodes[0].apberRelevantGrund',
                  '',
                ),
                eigentuemer: get(
                  n,
                  'vTpopAnzmassnsById.nodes[0].eigentuemer',
                  '',
                ),
                kontakt: get(n, 'vTpopAnzmassnsById.nodes[0].kontakt', ''),
                nutzungszone: get(
                  n,
                  'vTpopAnzmassnsById.nodes[0].nutzungszone',
                  '',
                ),
                bewirtschafter: get(
                  n,
                  'vTpopAnzmassnsById.nodes[0].bewirtschafter',
                  '',
                ),
                ekfrequenz: get(
                  n,
                  'vTpopAnzmassnsById.nodes[0].ekfrequenz',
                  '',
                ),
                ekfrequenz_abweichend: get(
                  n,
                  'vTpopAnzmassnsById.nodes[0].ekfrequenzAbweichend',
                  '',
                ),
                anzahlMassnahmen: get(
                  n,
                  'vTpopAnzmassnsById.nodes[0].anzahlMassnahmen',
                  '',
                ),
              }))
              removeNotification(notif)
              closeSnackbar(notif)
              if (rows.length === 0) {
                return enqueNotification({
                  message: 'Die Abfrage retournierte 0 Datensätze',
                  options: {
                    variant: 'warning',
                  },
                })
              }
              exportModule({
                data: sortBy(rows, ['artname', 'pop_nr', 'nr']),
                fileName: 'TeilpopulationenAnzahlMassnahmen',
                store,
              })
            }}
          >
            Anzahl Massnahmen pro Teilpopulation
          </DownloadCardButton>
          <DownloadCardButton
            onClick={async () => {
              const notif = enqueNotification({
                message: `Export "TeilpopulationenAnzKontrInklusiveLetzteKontrUndLetztenTPopBericht" wird vorbereitet...`,
                options: {
                  variant: 'info',
                  persist: true,
                },
              })
              let result
              try {
                result = await client.query({
                  query: await import(
                    './queryTpopErsteUndLetzteKontrolleUndLetzterTpopber'
                  ).then((m) => m.default),
                })
              } catch (error) {
                console.log('Teilpopulationen Export, onClickEwm', { error })
                enqueNotification({
                  message: error.message,
                  options: { variant: 'error' },
                })
              }
              const rows = get(result.data, 'allTpops.nodes', []).map((n) => ({
                ap_id: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].apId',
                  '',
                ),
                familie: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].familie',
                  '',
                ),
                artname: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].artname',
                  '',
                ),
                ap_bearbeitung: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].apBearbeitung',
                  '',
                ),
                ap_start_jahr: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].apStartJahr',
                  '',
                ),
                ap_umsetzung: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].apUmsetzung',
                  '',
                ),
                pop_id: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].popId',
                  '',
                ),
                pop_nr: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].popNr',
                  '',
                ),
                pop_name: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].popName',
                  '',
                ),
                pop_status: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].popStatus',
                  '',
                ),
                pop_bekannt_seit: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].popBekanntSeit',
                  '',
                ),
                pop_status_unklar: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].popStatusUnklar',
                  '',
                ),
                pop_status_unklar_begruendung: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].popStatusUnklarBegruendung',
                  '',
                ),
                pop_x: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].popX',
                  '',
                ),
                pop_y: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].popY',
                  '',
                ),
                id: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].id',
                  '',
                ),
                nr: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].nr',
                  '',
                ),
                gemeinde: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].gemeinde',
                  '',
                ),
                flurname: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].flurname',
                  '',
                ),
                status: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].status',
                  '',
                ),
                bekannt_seit: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].bekanntSeit',
                  '',
                ),
                status_unklar: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].statusUnklar',
                  '',
                ),
                status_unklar_grund: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].statusUnklarGrund',
                  '',
                ),
                lv95X: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].x',
                  '',
                ),
                lv95Y: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].y',
                  '',
                ),
                radius: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].radius',
                  '',
                ),
                hoehe: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].hoehe',
                  '',
                ),
                exposition: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].exposition',
                  '',
                ),
                klima: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].klima',
                  '',
                ),
                neigung: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].neigung',
                  '',
                ),
                beschreibung: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].beschreibung',
                  '',
                ),
                kataster_nr: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].katasterNr',
                  '',
                ),
                apber_relevant: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].apberRelevant',
                  '',
                ),
                apber_relevant_grund: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].apberRelevantGrund',
                  '',
                ),
                eigentuemer: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].eigentuemer',
                  '',
                ),
                kontakt: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].kontakt',
                  '',
                ),
                nutzungszone: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].nutzungszone',
                  '',
                ),
                bewirtschafter: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].bewirtschafter',
                  '',
                ),
                bewirtschaftung: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].bewirtschaftung',
                  '',
                ),
                ekfrequenz: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ekfrequenz',
                  '',
                ),
                ekfrequenz_abweichend: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ekfrequenzAbweichend',
                  '',
                ),
                changed: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].changed',
                  '',
                ),
                changed_by: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].changedBy',
                  '',
                ),
                anzahl_kontrollen: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].anzahlKontrollen',
                  '',
                ),
                erste_kontrolle_id: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleId',
                  '',
                ),
                erste_kontrolle_jahr: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleJahr',
                  '',
                ),
                erste_kontrolle_datum: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleDatum',
                  '',
                ),
                erste_kontrolle_typ: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleTyp',
                  '',
                ),
                erste_kontrolle_bearbeiter: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleBearbeiter',
                  '',
                ),
                erste_kontrolle_ueberlebensrate: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleUeberlebensrate',
                  '',
                ),
                erste_kontrolle_vitalitaet: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleVitalitaet',
                  '',
                ),
                erste_kontrolle_entwicklung: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleEntwicklung',
                  '',
                ),
                erste_kontrolle_ursachen: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleUrsachen',
                  '',
                ),
                erste_kontrolle_erfolgsbeurteilung: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleErfolgsbeurteilung',
                  '',
                ),
                erste_kontrolle_umsetzung_aendern: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleUmsetzungAendern',
                  '',
                ),
                erste_kontrolle_kontrolle_aendern: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleKontrolleAendern',
                  '',
                ),
                erste_kontrolle_bemerkungen: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleBemerkungen',
                  '',
                ),
                erste_kontrolle_lr_delarze: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleLrDelarze',
                  '',
                ),
                erste_kontrolle_lr_umgebung_delarze: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleLrUmgebungDelarze',
                  '',
                ),
                erste_kontrolle_vegetationstyp: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleVegetationstyp',
                  '',
                ),
                erste_kontrolle_konkurrenz: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleKonkurrenz',
                  '',
                ),
                erste_kontrolle_moosschicht: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleMoosschicht',
                  '',
                ),
                erste_kontrolle_krautschicht: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleKrautschicht',
                  '',
                ),
                erste_kontrolle_strauchschicht: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleStrauchschicht',
                  '',
                ),
                erste_kontrolle_baumschicht: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleBaumschicht',
                  '',
                ),
                erste_kontrolle_boden_typ: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleBodenTyp',
                  '',
                ),
                erste_kontrolle_boden_kalkgehalt: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleBodenKalkgehalt',
                  '',
                ),
                erste_kontrolle_boden_durchlaessigkeit: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleBodenDurchlaessigkeit',
                  '',
                ),
                erste_kontrolle_boden_humus: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleBodenHumus',
                  '',
                ),
                erste_kontrolle_boden_naehrstoffgehalt: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleBodenNaehrstoffgehalt',
                  '',
                ),
                erste_kontrolle_boden_abtrag: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleBodenAbtrag',
                  '',
                ),
                erste_kontrolle_wasserhaushalt: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleWasserhaushalt',
                  '',
                ),
                erste_kontrolle_idealbiotop_uebereinstimmung: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleIdealbiotopUebereinstimmung',
                  '',
                ),
                erste_kontrolle_handlungsbedarf: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleHandlungsbedarf',
                  '',
                ),
                erste_kontrolle_flaeche_ueberprueft: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleFlaecheUeberprueft',
                  '',
                ),
                erste_kontrolle_flaeche: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleFlaeche',
                  '',
                ),
                erste_kontrolle_plan_vorhanden: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrollePlanVorhanden',
                  '',
                ),
                erste_kontrolle_deckung_vegetation: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleDeckungVegetation',
                  '',
                ),
                erste_kontrolle_deckung_nackter_boden: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleDeckungNackterBoden',
                  '',
                ),
                erste_kontrolle_deckung_ap_art: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleDeckungApArt',
                  '',
                ),
                erste_kontrolle_jungpflanzen_vorhanden: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleJungpflanzenVorhanden',
                  '',
                ),
                erste_kontrolle_vegetationshoehe_maximum: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleVegetationshoeheMaximum',
                  '',
                ),
                erste_kontrolle_vegetationshoehe_mittel: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleVegetationshoeheMittel',
                  '',
                ),
                erste_kontrolle_gefaehrdung: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleGefaehrdung',
                  '',
                ),
                erste_kontrolle_changed: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleChanged',
                  '',
                ),
                erste_kontrolle_changed_by: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleChangedBy',
                  '',
                ),
                erste_kontrolle_apber_nicht_relevant: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleApberNichtRelevant',
                  '',
                ),
                erste_kontrolle_apber_nicht_relevant_grund: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleApberNichtRelevantGrund',
                  '',
                ),
                erste_kontrolle_ekf_bemerkungen: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleEkfBemerkungen',
                  '',
                ),
                erste_kontrolle_zaehlung_anzahlen: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleZaehlungAnzahlen',
                  '',
                ),
                erste_kontrolle_zaehlung_einheiten: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleZaehlungEinheiten',
                  '',
                ),
                erste_kontrolle_zaehlung_methoden: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleZaehlungMethoden',
                  '',
                ),
                letzte_kontrolle_id: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleId',
                  '',
                ),
                letzte_kontrolle_jahr: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleJahr',
                  '',
                ),
                letzte_kontrolle_datum: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleDatum',
                  '',
                ),
                letzte_kontrolle_typ: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleTyp',
                  '',
                ),
                letzte_kontrolle_bearbeiter: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleBearbeiter',
                  '',
                ),
                letzte_kontrolle_ueberlebensrate: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleUeberlebensrate',
                  '',
                ),
                letzte_kontrolle_vitalitaet: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleVitalitaet',
                  '',
                ),
                letzte_kontrolle_entwicklung: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleEntwicklung',
                  '',
                ),
                letzte_kontrolle_ursachen: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleUrsachen',
                  '',
                ),
                letzte_kontrolle_erfolgsbeurteilung: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleErfolgsbeurteilung',
                  '',
                ),
                letzte_kontrolle_umsetzung_aendern: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleUmsetzungAendern',
                  '',
                ),
                letzte_kontrolle_kontrolle_aendern: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleKontrolleAendern',
                  '',
                ),
                letzte_kontrolle_bemerkungen: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleBemerkungen',
                  '',
                ),
                letzte_kontrolle_lr_delarze: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleLrDelarze',
                  '',
                ),
                letzte_kontrolle_lr_umgebung_delarze: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleLrUmgebungDelarze',
                  '',
                ),
                letzte_kontrolle_vegetationstyp: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleVegetationstyp',
                  '',
                ),
                letzte_kontrolle_konkurrenz: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleKonkurrenz',
                  '',
                ),
                letzte_kontrolle_moosschicht: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleMoosschicht',
                  '',
                ),
                letzte_kontrolle_krautschicht: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleKrautschicht',
                  '',
                ),
                letzte_kontrolle_strauchschicht: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleStrauchschicht',
                  '',
                ),
                letzte_kontrolle_baumschicht: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleBaumschicht',
                  '',
                ),
                letzte_kontrolle_boden_typ: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleBodenTyp',
                  '',
                ),
                letzte_kontrolle_boden_kalkgehalt: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleBodenKalkgehalt',
                  '',
                ),
                letzte_kontrolle_boden_durchlaessigkeit: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleBodenDurchlaessigkeit',
                  '',
                ),
                letzte_kontrolle_boden_humus: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleBodenHumus',
                  '',
                ),
                letzte_kontrolle_boden_naehrstoffgehalt: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleBodenNaehrstoffgehalt',
                  '',
                ),
                letzte_kontrolle_boden_abtrag: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleBodenAbtrag',
                  '',
                ),
                letzte_kontrolle_wasserhaushalt: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleWasserhaushalt',
                  '',
                ),
                letzte_kontrolle_idealbiotop_uebereinstimmung: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleIdealbiotopUebereinstimmung',
                  '',
                ),
                letzte_kontrolle_handlungsbedarf: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleHandlungsbedarf',
                  '',
                ),
                letzte_kontrolle_flaeche_ueberprueft: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleFlaecheUeberprueft',
                  '',
                ),
                letzte_kontrolle_flaeche: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleFlaeche',
                  '',
                ),
                letzte_kontrolle_plan_vorhanden: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrollePlanVorhanden',
                  '',
                ),
                letzte_kontrolle_deckung_vegetation: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleDeckungVegetation',
                  '',
                ),
                letzte_kontrolle_deckung_nackter_boden: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleDeckungNackterBoden',
                  '',
                ),
                letzte_kontrolle_deckung_ap_art: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleDeckungApArt',
                  '',
                ),
                letzte_kontrolle_jungpflanzen_vorhanden: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleJungpflanzenVorhanden',
                  '',
                ),
                letzte_kontrolle_vegetationshoehe_maximum: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleVegetationshoeheMaximum',
                  '',
                ),
                letzte_kontrolle_vegetationshoehe_mittel: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleVegetationshoeheMittel',
                  '',
                ),
                letzte_kontrolle_gefaehrdung: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleGefaehrdung',
                  '',
                ),
                letzte_kontrolle_changed: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleChanged',
                  '',
                ),
                letzte_kontrolle_changed_by: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleChangedBy',
                  '',
                ),
                letzte_kontrolle_apber_nicht_relevant: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleApberNichtRelevant',
                  '',
                ),
                letzte_kontrolle_apber_nicht_relevant_grund: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleApberNichtRelevantGrund',
                  '',
                ),
                letzte_kontrolle_ekf_bemerkungen: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleEkfBemerkungen',
                  '',
                ),
                letzte_kontrolle_zaehlung_anzahlen: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleZaehlungAnzahlen',
                  '',
                ),
                letzte_kontrolle_zaehlung_einheiten: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleZaehlungEinheiten',
                  '',
                ),
                letzte_kontrolle_zaehlung_methoden: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleZaehlungMethoden',
                  '',
                ),
                tpopber_anz: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].tpopberAnz',
                  '',
                ),
                tpopber_id: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].tpopberId',
                  '',
                ),
                tpopber_jahr: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].tpopberJahr',
                  '',
                ),
                tpopber_entwicklung: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].tpopberEntwicklung',
                  '',
                ),
                tpopber_bemerkungen: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].tpopberBemerkungen',
                  '',
                ),
                tpopber_changed: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].tpopberChanged',
                  '',
                ),
                tpopber_changed_by: get(
                  n,
                  'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].tpopberChangedBy',
                  '',
                ),
              }))
              removeNotification(notif)
              closeSnackbar(notif)
              if (rows.length === 0) {
                return enqueNotification({
                  message: 'Die Abfrage retournierte 0 Datensätze',
                  options: {
                    variant: 'warning',
                  },
                })
              }
              exportModule({
                data: sortBy(rows, ['artname', 'pop_nr', 'nr']),
                fileName:
                  'TeilpopulationenAnzKontrInklusiveLetzteKontrUndLetztenTPopBericht',
                store,
              })
            }}
            disabled={false /*isRemoteHost*/}
            title={
              isRemoteHost
                ? 'nur aktiv, wenn apflora lokal installiert wird'
                : ''
            }
          >
            <div>Teilpopulationen mit:</div>
            <ul
              style={{
                paddingLeft: '18px',
                marginTop: '5px',
                marginBottom: '10px',
              }}
            >
              <Li>Anzahl Kontrollen</Li>
              <Li>erste Kontrolle</Li>
              <Li>erste Zählung</Li>
              <Li>letzte Kontrolle</Li>
              <Li>letzte Zählung</Li>
              <Li>letzter Teilpopulationsbericht</Li>
            </ul>
            <EwmDiv>
              {
                '= "Eier legende Wollmilchsau". Vorsicht: kann > 2 Minuten dauern!'
              }
            </EwmDiv>
          </DownloadCardButton>
          <AutocompleteContainer>
            <SelectLoadingOptions
              row={{}}
              field="ewm"
              valueLabelPath="aeTaxonomyByArtId.artname"
              label={`"Eier legende Wollmilchsau" für einzelne AP's: AP wählen`}
              labelSize={14}
              saveToDb={async (e) => {
                const aeId = e.target.value
                if (aeId === null) return
                setEwmMessage(
                  'Export "anzkontrinklletzterundletztertpopber" wird vorbereitet...',
                )
                let result
                try {
                  result = await client.query({
                    query: await import('./queryApByArtId').then(
                      (m) => m.default,
                    ),
                    variables: { aeId },
                  })
                } catch (error) {
                  enqueNotification({
                    message: error.message,
                    options: { variant: 'error' },
                  })
                }
                const apId = get(result.data, 'apByArtId.id')
                const { data } = await client.query({
                  query: await import(
                    './queryTpopErsteUndLetzteKontrolleUndLetzterTpopberFiltered'
                  ).then((m) => m.default),
                  variables: { apId },
                })
                const rows = get(data, 'allTpops.nodes', []).map((n) => ({
                  ap_id: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].apId',
                    '',
                  ),
                  familie: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].familie',
                    '',
                  ),
                  artname: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].artname',
                    '',
                  ),
                  ap_bearbeitung: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].apBearbeitung',
                    '',
                  ),
                  ap_start_jahr: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].apStartJahr',
                    '',
                  ),
                  ap_umsetzung: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].apUmsetzung',
                    '',
                  ),
                  pop_id: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].popId',
                    '',
                  ),
                  pop_nr: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].popNr',
                    '',
                  ),
                  pop_name: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].popName',
                    '',
                  ),
                  pop_status: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].popStatus',
                    '',
                  ),
                  pop_bekannt_seit: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].popBekanntSeit',
                    '',
                  ),
                  pop_status_unklar: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].popStatusUnklar',
                    '',
                  ),
                  pop_status_unklar_begruendung: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].popStatusUnklarBegruendung',
                    '',
                  ),
                  pop_x: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].popX',
                    '',
                  ),
                  pop_y: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].popY',
                    '',
                  ),
                  id: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].id',
                    '',
                  ),
                  nr: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].nr',
                    '',
                  ),
                  gemeinde: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].gemeinde',
                    '',
                  ),
                  flurname: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].flurname',
                    '',
                  ),
                  status: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].status',
                    '',
                  ),
                  bekannt_seit: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].bekanntSeit',
                    '',
                  ),
                  status_unklar: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].statusUnklar',
                    '',
                  ),
                  status_unklar_grund: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].statusUnklarGrund',
                    '',
                  ),
                  lv95X: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].x',
                    '',
                  ),
                  lv95Y: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].y',
                    '',
                  ),
                  radius: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].radius',
                    '',
                  ),
                  hoehe: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].hoehe',
                    '',
                  ),
                  exposition: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].exposition',
                    '',
                  ),
                  klima: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].klima',
                    '',
                  ),
                  neigung: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].neigung',
                    '',
                  ),
                  beschreibung: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].beschreibung',
                    '',
                  ),
                  kataster_nr: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].katasterNr',
                    '',
                  ),
                  apber_relevant: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].apberRelevant',
                    '',
                  ),
                  apber_relevant_grund: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].apberRelevantGrund',
                    '',
                  ),
                  eigentuemer: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].eigentuemer',
                    '',
                  ),
                  kontakt: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].kontakt',
                    '',
                  ),
                  nutzungszone: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].nutzungszone',
                    '',
                  ),
                  bewirtschafter: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].bewirtschafter',
                    '',
                  ),
                  bewirtschaftung: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].bewirtschaftung',
                    '',
                  ),
                  ekfrequenz: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ekfrequenz',
                    '',
                  ),
                  ekfrequenz_abweichend: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ekfrequenzAbweichend',
                    '',
                  ),
                  changed: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].changed',
                    '',
                  ),
                  changed_by: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].changedBy',
                    '',
                  ),
                  anzahl_kontrollen: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].anzahlKontrollen',
                    '',
                  ),
                  erste_kontrolle_id: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleId',
                    '',
                  ),
                  erste_kontrolle_jahr: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleJahr',
                    '',
                  ),
                  erste_kontrolle_datum: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleDatum',
                    '',
                  ),
                  erste_kontrolle_typ: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleTyp',
                    '',
                  ),
                  erste_kontrolle_bearbeiter: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleBearbeiter',
                    '',
                  ),
                  erste_kontrolle_ueberlebensrate: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleUeberlebensrate',
                    '',
                  ),
                  erste_kontrolle_vitalitaet: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleVitalitaet',
                    '',
                  ),
                  erste_kontrolle_entwicklung: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleEntwicklung',
                    '',
                  ),
                  erste_kontrolle_ursachen: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleUrsachen',
                    '',
                  ),
                  erste_kontrolle_erfolgsbeurteilung: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleErfolgsbeurteilung',
                    '',
                  ),
                  erste_kontrolle_umsetzung_aendern: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleUmsetzungAendern',
                    '',
                  ),
                  erste_kontrolle_kontrolle_aendern: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleKontrolleAendern',
                    '',
                  ),
                  erste_kontrolle_bemerkungen: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleBemerkungen',
                    '',
                  ),
                  erste_kontrolle_lr_delarze: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleLrDelarze',
                    '',
                  ),
                  erste_kontrolle_lr_umgebung_delarze: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleLrUmgebungDelarze',
                    '',
                  ),
                  erste_kontrolle_vegetationstyp: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleVegetationstyp',
                    '',
                  ),
                  erste_kontrolle_konkurrenz: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleKonkurrenz',
                    '',
                  ),
                  erste_kontrolle_moosschicht: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleMoosschicht',
                    '',
                  ),
                  erste_kontrolle_krautschicht: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleKrautschicht',
                    '',
                  ),
                  erste_kontrolle_strauchschicht: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleStrauchschicht',
                    '',
                  ),
                  erste_kontrolle_baumschicht: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleBaumschicht',
                    '',
                  ),
                  erste_kontrolle_boden_typ: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleBodenTyp',
                    '',
                  ),
                  erste_kontrolle_boden_kalkgehalt: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleBodenKalkgehalt',
                    '',
                  ),
                  erste_kontrolle_boden_durchlaessigkeit: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleBodenDurchlaessigkeit',
                    '',
                  ),
                  erste_kontrolle_boden_humus: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleBodenHumus',
                    '',
                  ),
                  erste_kontrolle_boden_naehrstoffgehalt: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleBodenNaehrstoffgehalt',
                    '',
                  ),
                  erste_kontrolle_boden_abtrag: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleBodenAbtrag',
                    '',
                  ),
                  erste_kontrolle_wasserhaushalt: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleWasserhaushalt',
                    '',
                  ),
                  erste_kontrolle_idealbiotop_uebereinstimmung: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleIdealbiotopUebereinstimmung',
                    '',
                  ),
                  erste_kontrolle_handlungsbedarf: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleHandlungsbedarf',
                    '',
                  ),
                  erste_kontrolle_flaeche_ueberprueft: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleFlaecheUeberprueft',
                    '',
                  ),
                  erste_kontrolle_flaeche: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleFlaeche',
                    '',
                  ),
                  erste_kontrolle_plan_vorhanden: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrollePlanVorhanden',
                    '',
                  ),
                  erste_kontrolle_deckung_vegetation: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleDeckungVegetation',
                    '',
                  ),
                  erste_kontrolle_deckung_nackter_boden: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleDeckungNackterBoden',
                    '',
                  ),
                  erste_kontrolle_deckung_ap_art: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleDeckungApArt',
                    '',
                  ),
                  erste_kontrolle_jungpflanzen_vorhanden: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleJungpflanzenVorhanden',
                    '',
                  ),
                  erste_kontrolle_vegetationshoehe_maximum: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleVegetationshoeheMaximum',
                    '',
                  ),
                  erste_kontrolle_vegetationshoehe_mittel: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleVegetationshoeheMittel',
                    '',
                  ),
                  erste_kontrolle_gefaehrdung: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleGefaehrdung',
                    '',
                  ),
                  erste_kontrolle_changed: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleChanged',
                    '',
                  ),
                  erste_kontrolle_changed_by: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleChangedBy',
                    '',
                  ),
                  erste_kontrolle_apber_nicht_relevant: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleApberNichtRelevant',
                    '',
                  ),
                  erste_kontrolle_apber_nicht_relevant_grund: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleApberNichtRelevantGrund',
                    '',
                  ),
                  erste_kontrolle_ekf_bemerkungen: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleEkfBemerkungen',
                    '',
                  ),
                  erste_kontrolle_zaehlung_anzahlen: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleZaehlungAnzahlen',
                    '',
                  ),
                  erste_kontrolle_zaehlung_einheiten: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleZaehlungEinheiten',
                    '',
                  ),
                  erste_kontrolle_zaehlung_methoden: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].ersteKontrolleZaehlungMethoden',
                    '',
                  ),
                  letzte_kontrolle_id: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleId',
                    '',
                  ),
                  letzte_kontrolle_jahr: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleJahr',
                    '',
                  ),
                  letzte_kontrolle_datum: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleDatum',
                    '',
                  ),
                  letzte_kontrolle_typ: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleTyp',
                    '',
                  ),
                  letzte_kontrolle_bearbeiter: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleBearbeiter',
                    '',
                  ),
                  letzte_kontrolle_ueberlebensrate: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleUeberlebensrate',
                    '',
                  ),
                  letzte_kontrolle_vitalitaet: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleVitalitaet',
                    '',
                  ),
                  letzte_kontrolle_entwicklung: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleEntwicklung',
                    '',
                  ),
                  letzte_kontrolle_ursachen: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleUrsachen',
                    '',
                  ),
                  letzte_kontrolle_erfolgsbeurteilung: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleErfolgsbeurteilung',
                    '',
                  ),
                  letzte_kontrolle_umsetzung_aendern: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleUmsetzungAendern',
                    '',
                  ),
                  letzte_kontrolle_kontrolle_aendern: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleKontrolleAendern',
                    '',
                  ),
                  letzte_kontrolle_bemerkungen: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleBemerkungen',
                    '',
                  ),
                  letzte_kontrolle_lr_delarze: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleLrDelarze',
                    '',
                  ),
                  letzte_kontrolle_lr_umgebung_delarze: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleLrUmgebungDelarze',
                    '',
                  ),
                  letzte_kontrolle_vegetationstyp: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleVegetationstyp',
                    '',
                  ),
                  letzte_kontrolle_konkurrenz: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleKonkurrenz',
                    '',
                  ),
                  letzte_kontrolle_moosschicht: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleMoosschicht',
                    '',
                  ),
                  letzte_kontrolle_krautschicht: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleKrautschicht',
                    '',
                  ),
                  letzte_kontrolle_strauchschicht: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleStrauchschicht',
                    '',
                  ),
                  letzte_kontrolle_baumschicht: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleBaumschicht',
                    '',
                  ),
                  letzte_kontrolle_boden_typ: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleBodenTyp',
                    '',
                  ),
                  letzte_kontrolle_boden_kalkgehalt: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleBodenKalkgehalt',
                    '',
                  ),
                  letzte_kontrolle_boden_durchlaessigkeit: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleBodenDurchlaessigkeit',
                    '',
                  ),
                  letzte_kontrolle_boden_humus: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleBodenHumus',
                    '',
                  ),
                  letzte_kontrolle_boden_naehrstoffgehalt: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleBodenNaehrstoffgehalt',
                    '',
                  ),
                  letzte_kontrolle_boden_abtrag: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleBodenAbtrag',
                    '',
                  ),
                  letzte_kontrolle_wasserhaushalt: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleWasserhaushalt',
                    '',
                  ),
                  letzte_kontrolle_idealbiotop_uebereinstimmung: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleIdealbiotopUebereinstimmung',
                    '',
                  ),
                  letzte_kontrolle_handlungsbedarf: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleHandlungsbedarf',
                    '',
                  ),
                  letzte_kontrolle_flaeche_ueberprueft: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleFlaecheUeberprueft',
                    '',
                  ),
                  letzte_kontrolle_flaeche: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleFlaeche',
                    '',
                  ),
                  letzte_kontrolle_plan_vorhanden: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrollePlanVorhanden',
                    '',
                  ),
                  letzte_kontrolle_deckung_vegetation: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleDeckungVegetation',
                    '',
                  ),
                  letzte_kontrolle_deckung_nackter_boden: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleDeckungNackterBoden',
                    '',
                  ),
                  letzte_kontrolle_deckung_ap_art: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleDeckungApArt',
                    '',
                  ),
                  letzte_kontrolle_jungpflanzen_vorhanden: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleJungpflanzenVorhanden',
                    '',
                  ),
                  letzte_kontrolle_vegetationshoehe_maximum: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleVegetationshoeheMaximum',
                    '',
                  ),
                  letzte_kontrolle_vegetationshoehe_mittel: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleVegetationshoeheMittel',
                    '',
                  ),
                  letzte_kontrolle_gefaehrdung: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleGefaehrdung',
                    '',
                  ),
                  letzte_kontrolle_changed: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleChanged',
                    '',
                  ),
                  letzte_kontrolle_changed_by: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleChangedBy',
                    '',
                  ),
                  letzte_kontrolle_apber_nicht_relevant: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleApberNichtRelevant',
                    '',
                  ),
                  letzte_kontrolle_apber_nicht_relevant_grund: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleApberNichtRelevantGrund',
                    '',
                  ),
                  letzte_kontrolle_ekf_bemerkungen: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleEkfBemerkungen',
                    '',
                  ),
                  letzte_kontrolle_zaehlung_anzahlen: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleZaehlungAnzahlen',
                    '',
                  ),
                  letzte_kontrolle_zaehlung_einheiten: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleZaehlungEinheiten',
                    '',
                  ),
                  letzte_kontrolle_zaehlung_methoden: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].letzteKontrolleZaehlungMethoden',
                    '',
                  ),
                  tpopber_anz: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].tpopberAnz',
                    '',
                  ),
                  tpopber_id: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].tpopberId',
                    '',
                  ),
                  tpopber_jahr: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].tpopberJahr',
                    '',
                  ),
                  tpopber_entwicklung: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].tpopberEntwicklung',
                    '',
                  ),
                  tpopber_bemerkungen: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].tpopberBemerkungen',
                    '',
                  ),
                  tpopber_changed: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].tpopberChanged',
                    '',
                  ),
                  tpopber_changed_by: get(
                    n,
                    'vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById.nodes[0].tpopberChangedBy',
                    '',
                  ),
                }))
                setEwmMessage('')
                if (rows.length === 0) {
                  return enqueNotification({
                    message: 'Die Abfrage retournierte 0 Datensätze',
                    options: {
                      variant: 'warning',
                    },
                  })
                }
                exportModule({
                  data: sortBy(rows, ['artname', 'pop_nr', 'nr']),
                  fileName: 'anzkontrinklletzterundletztertpopber',
                  store,
                })
              }}
              query={queryAeTaxonomies}
              filter={aeTaxonomiesfilter}
              queryNodesName="allAeTaxonomies"
              error={ewmMessage}
            />
          </AutocompleteContainer>
          <DownloadCardButton
            onClick={async () => {
              const notif = enqueNotification({
                message: `Export "TeilpopulationenTPopUndMassnBerichte" wird vorbereitet...`,
                options: {
                  variant: 'info',
                  persist: true,
                },
              })
              let result
              try {
                result = await client.query({
                  query: await import('./allVTpopPopberundmassnbers').then(
                    (m) => m.default,
                  ),
                })
              } catch (error) {
                enqueNotification({
                  message: error.message,
                  options: { variant: 'error' },
                })
              }
              const rows = get(
                result.data,
                'allVTpopPopberundmassnbers.nodes',
                [],
              )
              removeNotification(notif)
              closeSnackbar(notif)
              if (rows.length === 0) {
                return enqueNotification({
                  message: 'Die Abfrage retournierte 0 Datensätze',
                  options: {
                    variant: 'warning',
                  },
                })
              }
              exportModule({
                data: rows,
                fileName: 'TeilpopulationenTPopUndMassnBerichte',
                idKey: 'tpop_id',
                xKey: 'tpop_wgs84lat',
                yKey: 'tpop_wgs84long',
                store,
              })
            }}
          >
            Teilpopulationen inklusive Teilpopulations- und Massnahmen-Berichten
          </DownloadCardButton>
          <DownloadCardButton
            onClick={async () => {
              const notif = enqueNotification({
                message: `Export "TeilpopulationenLetzteZaehlungen" wird vorbereitet...`,
                options: {
                  variant: 'info',
                  persist: true,
                },
              })
              let result
              try {
                result = await client.query({
                  query: await import('./queryTpopLastCount').then(
                    (m) => m.default,
                  ),
                })
              } catch (error) {
                enqueNotification({
                  message: error.message,
                  options: {
                    variant: 'error',
                  },
                })
              }
              const rows = get(result.data, 'allTpops.nodes', []).map((z) => ({
                artname: get(z, 'vTpopLastCountsByTpopId.nodes[0].artname', ''),
                ap_id: get(z, 'vTpopLastCountsByTpopId.nodes[0].apId', ''),
                pop_id: get(z, 'vTpopLastCountsByTpopId.nodes[0].popId', ''),
                pop_nr: get(z, 'vTpopLastCountsByTpopId.nodes[0].popNr', ''),
                pop_name: get(
                  z,
                  'vTpopLastCountsByTpopId.nodes[0].popName',
                  '',
                ),
                pop_status: get(
                  z,
                  'vTpopLastCountsByTpopId.nodes[0].popStatus',
                  '',
                ),
                tpop_id: get(z, 'vTpopLastCountsByTpopId.nodes[0].tpopId', ''),
                tpop_nr: get(z, 'vTpopLastCountsByTpopId.nodes[0].tpopNr', ''),
                tpop_gemeinde: get(
                  z,
                  'vTpopLastCountsByTpopId.nodes[0].tpopGemeinde',
                  '',
                ),
                tpop_flurname: get(
                  z,
                  'vTpopLastCountsByTpopId.nodes[0].tpopFlurname',
                  '',
                ),
                tpop_status: get(
                  z,
                  'vTpopLastCountsByTpopId.nodes[0].tpopStatus',
                  '',
                ),
                jahr: get(z, 'vTpopLastCountsByTpopId.nodes[0].jahr', ''),
                pflanzen: get(
                  z,
                  'vTpopLastCountsByTpopId.nodes[0].pflanzen',
                  '',
                ),
                pflanzen_ohne_jungpflanzen: get(
                  z,
                  'vTpopLastCountsByTpopId.nodes[0].pflanzenOhneJungpflanzen',
                  '',
                ),
                triebe: get(z, 'vTpopLastCountsByTpopId.nodes[0].triebe', ''),
                triebe_beweidung: get(
                  z,
                  'vTpopLastCountsByTpopId.nodes[0].triebeBeweidung',
                  '',
                ),
                keimlinge: get(
                  z,
                  'vTpopLastCountsByTpopId.nodes[0].keimlinge',
                  '',
                ),
                rosetten: get(
                  z,
                  'vTpopLastCountsByTpopId.nodes[0].rosetten',
                  '',
                ),
                jungpflanzen: get(
                  z,
                  'vTpopLastCountsByTpopId.nodes[0].jungpflanzen',
                  '',
                ),
                blaetter: get(
                  z,
                  'vTpopLastCountsByTpopId.nodes[0].blatter',
                  '',
                ),
                bluehende_pflanzen: get(
                  z,
                  'vTpopLastCountsByTpopId.nodes[0].bluhendePflanzen',
                  '',
                ),
                bluehende_triebe: get(
                  z,
                  'vTpopLastCountsByTpopId.nodes[0].bluhendeTriebe',
                  '',
                ),
                blueten: get(z, 'vTpopLastCountsByTpopId.nodes[0].bluten', ''),
                fertile_pflanzen: get(
                  z,
                  'vTpopLastCountsByTpopId.nodes[0].fertilePflanzen',
                  '',
                ),
                fruchtende_triebe: get(
                  z,
                  'vTpopLastCountsByTpopId.nodes[0].fruchtendeTriebe',
                  '',
                ),
                bluetenstaende: get(
                  z,
                  'vTpopLastCountsByTpopId.nodes[0].blutenstande',
                  '',
                ),
                fruchtstaende: get(
                  z,
                  'vTpopLastCountsByTpopId.nodes[0].fruchtstande',
                  '',
                ),
                gruppen: get(z, 'vTpopLastCountsByTpopId.nodes[0].gruppen', ''),
                deckung: get(z, 'vTpopLastCountsByTpopId.nodes[0].deckung', ''),
                pflanzen_5m2: get(
                  z,
                  'vTpopLastCountsByTpopId.nodes[0].pflanzen5M2',
                  '',
                ),
                triebe_in_30m2: get(
                  z,
                  'vTpopLastCountsByTpopId.nodes[0].triebeIn30M2',
                  '',
                ),
                triebe_50m2: get(
                  z,
                  'vTpopLastCountsByTpopId.nodes[0].triebe50M2',
                  '',
                ),
                triebe_maehflaeche: get(
                  z,
                  'vTpopLastCountsByTpopId.nodes[0].triebeMahflache',
                  '',
                ),
                flaeche_m2: get(
                  z,
                  'vTpopLastCountsByTpopId.nodes[0].flacheM2',
                  '',
                ),
                pflanzstellen: get(
                  z,
                  'vTpopLastCountsByTpopId.nodes[0].pflanzstellen',
                  '',
                ),
                stellen: get(z, 'vTpopLastCountsByTpopId.nodes[0].stellen', ''),
                andere_zaehleinheit: get(
                  z,
                  'vTpopLastCountsByTpopId.nodes[0].andereZaehleinheit',
                  '',
                ),
                art_ist_vorhanden: get(
                  z,
                  'vTpopLastCountsByTpopId.nodes[0].artIstVorhanden',
                  '',
                ),
              }))
              removeNotification(notif)
              closeSnackbar(notif)
              if (rows.length === 0) {
                return enqueNotification({
                  message: 'Die Abfrage retournierte 0 Datensätze',
                  options: {
                    variant: 'warning',
                  },
                })
              }
              exportModule({
                data: sortBy(rows, ['artname', 'pop_nr', 'tpop_nr', 'jahr']),
                fileName: 'TPopLetzteZaehlungen',
                idKey: 'pop_id',
                store,
              })
            }}
          >
            Letzte Zählungen
          </DownloadCardButton>
          <DownloadCardButton
            onClick={async () => {
              const notif = enqueNotification({
                message: `Export "TPopLetzteZaehlungenInklMassn" wird vorbereitet...`,
                options: {
                  variant: 'info',
                  persist: true,
                },
              })
              let result
              try {
                result = await client.query({
                  query: await import('./allVTpopLastCountWithMassns').then(
                    (m) => m.default,
                  ),
                })
              } catch (error) {
                enqueNotification({
                  message: error.message,
                  options: {
                    variant: 'error',
                  },
                })
              }
              const rows = get(
                result.data,
                'allVTpopLastCountWithMassns.nodes',
                [],
              )
              removeNotification(notif)
              closeSnackbar(notif)
              if (rows.length === 0) {
                return enqueNotification({
                  message: 'Die Abfrage retournierte 0 Datensätze',
                  options: {
                    variant: 'warning',
                  },
                })
              }
              exportModule({
                data: rows,
                fileName: 'TPopLetzteZaehlungenInklMassn',
                idKey: 'pop_id',
                store,
              })
            }}
          >
            Letzte Zählungen inklusive noch nicht kontrollierter Anpflanzungen
          </DownloadCardButton>
        </StyledCardContent>
      </Collapse>
    </StyledCard>
  )
}

export default observer(Teilpopulationen)
