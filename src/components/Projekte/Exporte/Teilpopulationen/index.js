import React, { useContext, useState, useCallback } from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import styled from 'styled-components'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/react-hooks'
import { useSnackbar } from 'notistack'
import gql from 'graphql-tag'

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
            /*apByArtIdExists: true,*/
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
                  query: await import('./allVTpopKmls').then((m) => m.default),
                })
              } catch (error) {
                enqueNotification({
                  message: error.message,
                  options: { variant: 'error' },
                })
              }
              const rows = get(result.data, 'allVTpopKmls.nodes', [])
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
                  query: await import('./allVTpopKmlnamen').then(
                    (m) => m.default,
                  ),
                })
              } catch (error) {
                enqueNotification({
                  message: error.message,
                  options: { variant: 'error' },
                })
              }
              const rows = get(result.data, 'allVTpopKmlnamen.nodes', [])
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
                    './allVTpopErsteUndLetzteKontrolleUndLetzterTpopbers'
                  ).then((m) => m.default),
                })
              } catch (error) {
                console.log('Teilpopulationen Export, onClickEwm', { error })
                enqueNotification({
                  message: error.message,
                  options: { variant: 'error' },
                })
              }
              const rows = get(
                result.data,
                'allVTpopErsteUndLetzteKontrolleUndLetzterTpopbers.nodes',
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
              {'= "Eier legende Wollmilchsau". Vorsicht: Dauert > 2 Minuten!'}
            </EwmDiv>
          </DownloadCardButton>
          <AutocompleteContainer>
            <SelectLoadingOptions
              row={{}}
              field="ewm"
              valueLabelPath="aeTaxonomyByArtId.artname"
              label={`"Eier legende Wollmilchsau" für einzelne Arten: Art wählen`}
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
                    './allVTpopErsteUndLetzteKontrolleUndLetzterTpopbersFiltered'
                  ).then((m) => m.default),
                  variables: { apId },
                })
                const rows = get(
                  data,
                  'allVTpopErsteUndLetzteKontrolleUndLetzterTpopbers.nodes',
                  [],
                )
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
                  data: rows,
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
                  query: await import('./allVTpopLastCounts').then(
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
              const rows = get(result.data, 'allVTpopLastCounts.nodes', [])
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
