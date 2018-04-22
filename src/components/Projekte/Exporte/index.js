import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import { Card, CardHeader, CardText } from 'material-ui/Card'
import Button from 'material-ui-next/Button'
import sortBy from 'lodash/sortBy'
import AutoComplete from './Autocomplete'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withProps from 'recompose/withProps'
import withHandlers from 'recompose/withHandlers'
import withLifecycle from '@hocs/with-lifecycle'

import beziehungen from '../../../etc/beziehungen.png'
import FormTitle from '../../shared/FormTitle'
import Tipps from './Tipps'
import Optionen from './Optionen'
import exportModule from '../../../modules/export'
import ErrorBoundary from '../../shared/ErrorBoundary'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  @media print {
    display: none !important;
  }
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow-x: auto;
  height: 100%;
  padding-bottom: 10px;
  overflow: auto !important;
`
const FirstLevelCard = styled(Card)`
  margin-bottom: 10px;
  background-color: #fff8e1 !important;
`
const DownloadCardText = styled(CardText)`
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: stretch;
  align-content: stretch;
`
const DownloadCardButtonNew = styled(Button)`
  flex-basis: 450px;
  > span:first-of-type {
    text-transform: none !important;
    font-weight: 500;
    display: block;
    text-align: left;
    justify-content: flex-start !important;
  }
`
const AutocompleteContainer = styled.div`
  flex-basis: 450px;
  padding-left: 16px;
`
const isRemoteHost = window.location.hostname !== 'localhost'

const enhance = compose(
  inject('store'),
  withState(
    'artFuerEierlegendeWollmilchsau',
    'changeArtFuerEierlegendeWollmilchsau',
    ''
  ),
  withHandlers({
    downloadFromView: ({
      store,
      changeArtFuerEierlegendeWollmilchsau,
      artFuerEierlegendeWollmilchsau,
    }) => ({ view, fileName, apIdName, apId, kml }) =>
      exportModule({
        store,
        changeArtFuerEierlegendeWollmilchsau,
        artFuerEierlegendeWollmilchsau,
        view,
        fileName,
        apIdName,
        apId,
        kml,
      }),
  }),
  withLifecycle({
    onDidMount({ store }) {
      if (store.table.ae_eigenschaften.size === 0) {
        store.fetchTable('ae_eigenschaften')
      }
      if (store.table.ap.size === 0) {
        store.fetchTableByParentId('ap', store.tree.activeNodes.projekt)
      }
    },
  }),
  observer,
  withProps(props => {
    const { store } = props
    const { ae_eigenschaften } = store.table
    const aps = Array.from(store.table.ap.values()).filter(ap => !!ap.art_id)
    const aes = Array.from(ae_eigenschaften.values())
    let artList = aps.map(ap => {
      const ae = aes.find(a => a.id === ap.art_id)
      return {
        id: ap.id,
        value: ae && ae.artname ? ae.artname : '',
      }
    })
    artList = sortBy(artList, 'value')
    return { artList }
  })
)

const Exporte = ({
  store,
  artFuerEierlegendeWollmilchsau,
  changeArtFuerEierlegendeWollmilchsau,
  artList,
  downloadFromView,
}: {
  store: Object,
  artFuerEierlegendeWollmilchsau: string,
  changeArtFuerEierlegendeWollmilchsau: () => void,
  artList: Array<Object>,
  downloadFromView: () => void,
}) => (
  <ErrorBoundary>
    <Container>
      <FormTitle tree={store.tree} title="Exporte" />
      <FieldsContainer>
        <Optionen />
        <Tipps />
        <FirstLevelCard>
          <CardHeader title="Art" actAsExpander showExpandableButton />
          <DownloadCardText expandable>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_ap',
                  apIdName: 'id',
                  fileName: 'Arten',
                })
              }
            >
              Arten
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_ap_ohnepop',
                  fileName: 'ArtenOhnePopulationen',
                })
              }
            >
              Arten ohne Populationen
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_ap_anzmassn',
                  fileName: 'ArtenAnzahlMassnahmen',
                })
              }
            >
              Anzahl Massnahmen pro Art
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_ap_anzkontr',
                  fileName: 'ArtenAnzahlKontrollen',
                })
              }
            >
              Anzahl Kontrollen pro Art
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_apber',
                  fileName: 'Jahresberichte',
                })
              }
            >
              AP-Berichte (Jahresberichte)
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_ap_apberundmassn',
                  fileName: 'ApJahresberichteUndMassnahmen',
                })
              }
            >
              AP-Berichte und Massnahmen
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_ziel',
                  fileName: 'ApZiele',
                })
              }
            >
              Ziele
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_zielber',
                  fileName: 'Zielberichte',
                })
              }
            >
              Ziel-Berichte
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_ber',
                  fileName: 'Berichte',
                })
              }
            >
              Berichte
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_erfkrit',
                  fileName: 'Erfolgskriterien',
                })
              }
            >
              Erfolgskriterien
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_idealbiotop',
                  fileName: 'Idealbiotope',
                })
              }
            >
              Idealbiotope
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_assozart',
                  fileName: 'AssoziierteArten',
                })
              }
            >
              Assoziierte Arten
            </DownloadCardButtonNew>
          </DownloadCardText>
        </FirstLevelCard>
        <FirstLevelCard>
          <CardHeader title="Populationen" actAsExpander showExpandableButton />
          <DownloadCardText expandable>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_pop',
                  fileName: 'Populationen',
                })
              }
            >
              Populationen
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_pop_kml',
                  fileName: 'Populationen',
                })
              }
            >
              <div>Populationen für Google Earth (beschriftet mit PopNr)</div>
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_pop_kmlnamen',
                  fileName: 'PopulationenNachNamen',
                })
              }
            >
              <div>
                Populationen für Google Earth (beschriftet mit Artname, PopNr)
              </div>
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_pop_vonapohnestatus',
                  fileName: 'PopulationenVonApArtenOhneStatus',
                })
              }
            >
              Populationen von AP-Arten ohne Status
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_pop_ohnekoord',
                  fileName: 'PopulationenOhneKoordinaten',
                })
              }
            >
              Populationen ohne Koordinaten
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_popmassnber_anzmassn',
                  fileName: 'PopulationenAnzMassnProMassnber',
                })
              }
            >
              Populationen mit Massnahmen-Berichten: Anzahl Massnahmen im
              Berichtsjahr
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_pop_anzmassn',
                  fileName: 'PopulationenAnzahlMassnahmen',
                })
              }
            >
              Anzahl Massnahmen pro Population
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_pop_anzkontr',
                  fileName: 'PopulationenAnzahlKontrollen',
                })
              }
            >
              Anzahl Kontrollen pro Population
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_pop_popberundmassnber',
                  fileName: 'PopulationenPopUndMassnBerichte',
                })
              }
            >
              Populationen inkl. Populations- und Massnahmen-Berichte
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_pop_mit_letzter_popber',
                  fileName: 'PopulationenMitLetzemPopBericht',
                })
              }
            >
              Populationen mit dem letzten Populations-Bericht
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_pop_mit_letzter_popmassnber',
                  fileName: 'PopulationenMitLetztemMassnBericht',
                })
              }
            >
              Populationen mit dem letzten Massnahmen-Bericht
            </DownloadCardButtonNew>
          </DownloadCardText>
        </FirstLevelCard>
        <FirstLevelCard>
          <CardHeader
            title="Teilpopulationen"
            actAsExpander
            showExpandableButton
          />
          <DownloadCardText expandable>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_tpop',
                  fileName: 'Teilpopulationen',
                })
              }
            >
              Teilpopulationen
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_tpop_webgisbun',
                  fileName: 'TeilpopulationenWebGisBun',
                })
              }
            >
              Teilpopulationen für WebGIS BUN
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_tpop_kml',
                  fileName: 'Teilpopulationen',
                  kml: true,
                })
              }
            >
              <div>Teilpopulationen für Google Earth</div>
              <div>(beschriftet mit PopNr/TPopNr)</div>
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_tpop_kmlnamen',
                  fileName: 'TeilpopulationenNachNamen',
                  kml: true,
                })
              }
            >
              <div>Teilpopulationen für Google Earth</div>
              <div>(beschriftet mit Artname, PopNr/TPopNr)</div>
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_tpop_ohnebekanntseit',
                  fileName: 'TeilpopulationenVonApArtenOhneBekanntSeit',
                })
              }
            >
              <div>Teilpopulationen von AP-Arten</div>
              <div>{'ohne "Bekannt seit"'}</div>
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_tpop_ohneapberichtrelevant',
                  fileName: 'TeilpopulationenOhneApBerichtRelevant',
                })
              }
            >
              <div>Teilpopulationen ohne Eintrag</div>
              <div>{'im Feld "Für AP-Bericht relevant"'}</div>
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_tpop_popnrtpopnrmehrdeutig',
                  fileName: 'TeilpopulationenPopnrTpopnrMehrdeutig',
                })
              }
            >
              <div>Teilpopulationen mit mehrdeutiger</div>
              <div>Kombination von PopNr und TPopNr</div>
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_tpop_anzmassn',
                  fileName: 'TeilpopulationenAnzahlMassnahmen',
                })
              }
            >
              Anzahl Massnahmen pro Teilpopulation
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_tpop_anzkontrinklletzterundletztertpopber',
                  fileName:
                    'TeilpopulationenAnzKontrInklusiveLetzteKontrUndLetztenTPopBericht',
                })
              }
              disabled={isRemoteHost}
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
                <li>Anzahl Kontrollen</li>
                <li>letzte Kontrolle</li>
                <li>letzter Teilpopulationsbericht</li>
                <li>letzte Zählung</li>
              </ul>
              <div>{'= "Eier legende Wollmilchsau"'}</div>
            </DownloadCardButtonNew>
            <AutocompleteContainer>
              <AutoComplete
                label={`"Eier legende Wollmilchsau" für eine Art`}
                value={artFuerEierlegendeWollmilchsau}
                objects={artList}
                changeArtFuerEierlegendeWollmilchsau={
                  changeArtFuerEierlegendeWollmilchsau
                }
                downloadFromView={downloadFromView}
              />
            </AutocompleteContainer>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_tpop_popberundmassnber',
                  fileName: 'TeilpopulationenTPopUndMassnBerichte',
                })
              }
            >
              Teilpopulationen inklusive Teilpopulations- und
              Massnahmen-Berichten
            </DownloadCardButtonNew>
          </DownloadCardText>
        </FirstLevelCard>
        <FirstLevelCard>
          <CardHeader title="Kontrollen" actAsExpander showExpandableButton />
          <DownloadCardText expandable>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_tpopkontr',
                  fileName: 'Kontrollen',
                })
              }
            >
              Kontrollen
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_tpopkontr_webgisbun',
                  fileName: 'KontrollenWebGisBun',
                })
              }
            >
              Kontrollen für WebGIS BUN
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_kontrzaehl_anzproeinheit',
                  fileName: 'KontrollenAnzahlProZaehleinheit',
                })
              }
            >
              Kontrollen: Anzahl pro Zähleinheit
            </DownloadCardButtonNew>
          </DownloadCardText>
        </FirstLevelCard>
        <FirstLevelCard>
          <CardHeader title="Massnahmen" actAsExpander showExpandableButton />
          <DownloadCardText expandable>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_massn',
                  fileName: 'Massnahmen',
                })
              }
            >
              Massnahmen
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_massn_webgisbun',
                  fileName: 'MassnahmenWebGisBun',
                })
              }
            >
              Massnahmen für WebGIS BUN
            </DownloadCardButtonNew>
          </DownloadCardText>
        </FirstLevelCard>
        <FirstLevelCard>
          <CardHeader
            title="Beobachtungen"
            actAsExpander
            showExpandableButton
          />
          <DownloadCardText expandable>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_beob',
                  fileName: 'Beobachtungen',
                })
              }
            >
              <div>Alle Beobachtungen von Arten aus apflora.ch</div>
              <div>Nutzungsbedingungen der FNS beachten</div>
            </DownloadCardButtonNew>
          </DownloadCardText>
          <DownloadCardText expandable>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_beob__mit_data',
                  fileName: 'Beobachtungen',
                })
              }
            >
              <div>Alle Beobachtungen von Arten aus apflora.ch...</div>
              <div>...inklusive Original-Beobachtungsdaten (JSON)</div>
              <div>Dauert Minuten und umfasst hunderte Megabytes!</div>
              <div>Nutzungsbedingungen der FNS beachten</div>
            </DownloadCardButtonNew>
          </DownloadCardText>
        </FirstLevelCard>
        <FirstLevelCard>
          <CardHeader title="Anwendung" actAsExpander showExpandableButton />
          <DownloadCardText expandable>
            <DownloadCardButtonNew
              onClick={() =>
                downloadFromView({
                  view: 'v_datenstruktur',
                  fileName: 'Datenstruktur',
                })
              }
            >
              Tabellen und Felder
            </DownloadCardButtonNew>
            <DownloadCardButtonNew
              onClick={() => {
                window.open(beziehungen)
              }}
            >
              Datenstruktur grafisch dargestellt
            </DownloadCardButtonNew>
          </DownloadCardText>
        </FirstLevelCard>
      </FieldsContainer>
    </Container>
  </ErrorBoundary>
)

export default enhance(Exporte)
