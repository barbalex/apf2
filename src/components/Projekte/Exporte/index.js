import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import { Card, CardHeader, CardText } from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import fileDownload from 'react-file-download'
import format from 'date-fns/format'
import axios from 'axios'
import sortBy from 'lodash/sortBy'
import filter from 'lodash/filter'
import clone from 'lodash/clone'
import AutoComplete from 'material-ui/AutoComplete'
import { orange500 } from 'material-ui/styles/colors'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withProps from 'recompose/withProps'
import withHandlers from 'recompose/withHandlers'
import json2csv from 'json2csv'

import beziehungen from '../../../etc/beziehungen.png'
import FormTitle from '../../shared/FormTitle'
import apiBaseUrl from '../../../modules/apiBaseUrl'
import Tipps from './Tipps'
import Optionen from './Optionen'
import popIdsInsideFeatureCollection
  from '../../../modules/popIdsInsideFeatureCollection'
import tpopIdsInsideFeatureCollection
  from '../../../modules/tpopIdsInsideFeatureCollection'
import beobIdsFromServerInsideFeatureCollection
  from '../../../modules/beobIdsFromServerInsideFeatureCollection'

const Container = styled.div`
  height: 100%;
  flex-basis: 600px;
  flex-grow: 4;
  flex-shrink: 1;
  @media print {
    display: none !important;
  }
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow-x: auto;
  height: 100%;
  padding-bottom: 95px;
`
const FirstLevelCard = styled(Card)`
  margin-bottom: 10px;
`
const DownloadCardText = styled(CardText)`
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: stretch;
  align-content: stretch;
`
const DownloadCardButton = styled(FlatButton)`
  flex-basis: 410px;
  height: 100% !important;
  text-align: left !important;
  line-height: 18px !important;
  padding: 16px !important;
  > div {
    > span {
      text-transform: none !important;
      padding-left: 0 !important;
    }
    > div {
      font-weight: 500;
    }
  }
`
const AutocompleteContainer = styled.div`
  flex-basis: 410px;
  padding-left: 16px;
`
const StyledAutoComplete = styled(AutoComplete)`
  > input, > div, > label {
    font-size: 14px !important;
    font-color: red !important;
  }
`
const isRemoteHost = window.location.hostname !== `localhost`

const enhance = compose(
  inject('store'),
  withState(
    'artFuerEierlegendeWollmilchsau',
    'changeArtFuerEierlegendeWollmilchsau',
    ''
  ),
  withHandlers({
    downloadFromView: props => ({ view, fileName, apArtId }) => {
      const {
        store,
        changeArtFuerEierlegendeWollmilchsau,
        artFuerEierlegendeWollmilchsau
      } = props
      const url = `${apiBaseUrl}/exportView/json/view=${view}${apArtId ? `/${apArtId}` : ``}`

      axios
        .get(url)
        .then(({ data }) => {
          const { mapFilter } = store.map
          const { applyMapFilterToExport } = store.export
          const {
            // TODO: add this
            applyNodeLabelFilterToExport, // eslint-disable-line no-unused-vars
            applyActiveNodeFilterToExport // eslint-disable-line no-unused-vars
          } = store.tree
          let jsonData = clone(data)
          // now we could manipulate the data, for instance apply mapFilter
          const filterFeatures = mapFilter.filter.features
          if (filterFeatures.length > 0 && applyMapFilterToExport) {
            const keys = Object.keys(data[0])
            // filter data
            // beob can also have PopId and TPopId, so dont filter by TPopId if you filter by BeobId
            if (keys.includes('BeobId')) {
              const beobIds = beobIdsFromServerInsideFeatureCollection(
                store,
                data
              )
              jsonData = jsonData.filter(d => beobIds.includes(d.BeobId))
            } else if (keys.includes('TPopId')) {
              // data sets with TPopId usually also deliver PopId,
              // so only filter by TPopid then
              const tpopIds = tpopIdsInsideFeatureCollection(store, data)
              jsonData = jsonData.filter(d => tpopIds.includes(d.TPopId))
            } else if (keys.includes('PopId')) {
              const popIds = popIdsInsideFeatureCollection(store, data)
              jsonData = jsonData.filter(d => popIds.includes(d.PopId))
            }
          }
          if (jsonData.length === 0) {
            throw new Error(
              'Es gibt offenbar keine Daten, welche exportiert werden können'
            )
          }
          try {
            const csvData = json2csv({ data: jsonData })
            const file = `${fileName}_${format(new Date(), `YYYY-MM-DD_HH-mm-ss`)}`
            fileDownload(csvData, `${file}.csv`)
            if (artFuerEierlegendeWollmilchsau) {
              changeArtFuerEierlegendeWollmilchsau('')
            }
          } catch (err) {
            throw err
          }
        })
        .catch(error => {
          if (artFuerEierlegendeWollmilchsau) {
            changeArtFuerEierlegendeWollmilchsau('')
          }
          store.listError(error)
        })
    }
  }),
  observer,
  withProps(props => {
    const { store } = props
    const { adb_eigenschaften } = store.table
    const apIds = Array.from(store.table.ap.keys()).map(n => Number(n))
    let artList = Array.from(adb_eigenschaften.values())
    artList = filter(artList, r => apIds.includes(r.TaxonomieId))
    artList = sortBy(artList, 'Artname')
    return { artList }
  })
)

const Exporte = ({
  store,
  artFuerEierlegendeWollmilchsau,
  changeArtFuerEierlegendeWollmilchsau,
  artList,
  downloadFromView
}: {
  store: Object,
  artFuerEierlegendeWollmilchsau: string,
  changeArtFuerEierlegendeWollmilchsau: () => void,
  artList: Array<Object>,
  downloadFromView: () => void
}) => {
  if (store.table.adb_eigenschaften.size === 0) {
    store.fetchTable('beob', 'adb_eigenschaften')
  }
  if (store.table.ap.size === 0) {
    store.fetchTableByParentId('apflora', 'ap', store.tree.activeNodes.projekt)
  }
  return (
    <Container>
      <FormTitle tree={store.tree} title="Exporte" />
      <FieldsContainer>
        <Optionen />
        <Tipps />
        <FirstLevelCard>
          <CardHeader title="Art" actAsExpander showExpandableButton />
          <DownloadCardText expandable>
            <DownloadCardButton
              label="Arten"
              onClick={() =>
                downloadFromView({
                  view: 'v_ap',
                  fileName: 'Arten'
                })}
            />
            <DownloadCardButton
              label="Arten ohne Populationen"
              onClick={() =>
                downloadFromView({
                  view: 'v_ap_ohnepop',
                  fileName: 'ArtenOhnePopulationen'
                })}
            />
            <DownloadCardButton
              label="Anzahl Massnahmen pro Art"
              onClick={() =>
                downloadFromView({
                  view: 'v_ap_anzmassn',
                  fileName: 'ArtenAnzahlMassnahmen'
                })}
            />
            <DownloadCardButton
              label="Anzahl Kontrollen pro Art"
              onClick={() =>
                downloadFromView({
                  view: 'v_ap_anzkontr',
                  fileName: 'ArtenAnzahlKontrollen'
                })}
            />
            <DownloadCardButton
              label="AP-Berichte (Jahresberichte)"
              onClick={() =>
                downloadFromView({
                  view: 'v_apber',
                  fileName: 'Jahresberichte'
                })}
            />
            <DownloadCardButton
              label="AP-Berichte und Massnahmen"
              onClick={() =>
                downloadFromView({
                  view: 'v_ap_apberundmassn',
                  fileName: 'ApJahresberichteUndMassnahmen'
                })}
            />
            <DownloadCardButton
              label="Ziele"
              onClick={() =>
                downloadFromView({
                  view: 'v_ziel',
                  fileName: 'ApZiele'
                })}
            />
            <DownloadCardButton
              label="Ziel-Berichte"
              onClick={() =>
                downloadFromView({
                  view: 'v_zielber',
                  fileName: 'Zielberichte'
                })}
            />
            <DownloadCardButton
              label="Berichte"
              onClick={() =>
                downloadFromView({
                  view: 'v_ber',
                  fileName: 'Berichte'
                })}
            />
            <DownloadCardButton
              label="Erfolgskriterien"
              onClick={() =>
                downloadFromView({
                  view: 'v_erfkrit',
                  fileName: 'Erfolgskriterien'
                })}
            />
            <DownloadCardButton
              label="Idealbiotope"
              onClick={() =>
                downloadFromView({
                  view: 'v_idealbiotop',
                  fileName: 'Idealbiotope'
                })}
            />
            <DownloadCardButton
              label="Assoziierte Arten"
              onClick={() =>
                downloadFromView({
                  view: 'v_assozart',
                  fileName: 'AssoziierteArten'
                })}
            />
          </DownloadCardText>
        </FirstLevelCard>
        <FirstLevelCard>
          <CardHeader title="Populationen" actAsExpander showExpandableButton />
          <DownloadCardText expandable>
            <DownloadCardButton
              label="Populationen"
              onClick={() =>
                downloadFromView({
                  view: 'v_pop',
                  fileName: 'Populationen'
                })}
            />
            <DownloadCardButton
              onClick={() =>
                downloadFromView({
                  view: 'v_pop_kml',
                  fileName: 'Populationen'
                })}
            >
              <div>Populationen für Google Earth</div>
              <div>(beschriftet mit PopNr)</div>
            </DownloadCardButton>
            <DownloadCardButton
              onClick={() =>
                downloadFromView({
                  view: 'v_pop_kmlnamen',
                  fileName: 'PopulationenNachNamen'
                })}
            >
              <div>Populationen für Google Earth</div>
              <div>(beschriftet mit Artname, PopNr)</div>
            </DownloadCardButton>
            <DownloadCardButton
              label="Populationen ohne Teilpopulationen"
              onClick={() =>
                downloadFromView({
                  view: 'v_pop_ohnetpop',
                  fileName: 'PopulationenOhneTeilpopulationen'
                })}
            />
            <DownloadCardButton
              label="Populationen von AP-Arten ohne Status"
              onClick={() =>
                downloadFromView({
                  view: 'v_pop_vonapohnestatus',
                  fileName: 'PopulationenVonApArtenOhneStatus'
                })}
            />
            <DownloadCardButton
              label="Populationen ohne Koordinaten"
              onClick={() =>
                downloadFromView({
                  view: 'v_pop_ohnekoord',
                  fileName: 'PopulationenOhneKoordinaten'
                })}
            />
            <DownloadCardButton
              label="Populationen mit Massnahmen-Berichten: Anzahl Massnahmen im Berichtsjahr"
              onClick={() =>
                downloadFromView({
                  view: 'v_popmassnber_anzmassn',
                  fileName: 'PopulationenAnzMassnProMassnber'
                })}
            />
            <DownloadCardButton
              label="Anzahl Massnahmen pro Population"
              onClick={() =>
                downloadFromView({
                  view: 'v_pop_anzmassn',
                  fileName: 'PopulationenAnzahlMassnahmen'
                })}
            />
            <DownloadCardButton
              label="Anzahl Kontrollen pro Population"
              onClick={() =>
                downloadFromView({
                  view: 'v_pop_anzkontr',
                  fileName: 'PopulationenAnzahlKontrollen'
                })}
            />
            <DownloadCardButton
              label="Populationen inkl. Populations- und Massnahmen-Berichte"
              onClick={() =>
                downloadFromView({
                  view: 'v_pop_popberundmassnber',
                  fileName: 'PopulationenPopUndMassnBerichte'
                })}
            />
            <DownloadCardButton
              label="Populationen mit dem letzten Populations-Bericht"
              onClick={() =>
                downloadFromView({
                  view: 'v_pop_mit_letzter_popber',
                  fileName: 'PopulationenMitLetzemPopBericht'
                })}
            />
            <DownloadCardButton
              label="Populationen mit dem letzten Massnahmen-Bericht"
              onClick={() =>
                downloadFromView({
                  view: 'v_pop_mit_letzter_popmassnber',
                  fileName: 'PopulationenMitLetztemMassnBericht'
                })}
            />
          </DownloadCardText>
        </FirstLevelCard>
        <FirstLevelCard>
          <CardHeader
            title="Teilpopulationen"
            actAsExpander
            showExpandableButton
          />
          <DownloadCardText expandable>
            <DownloadCardButton
              label="Teilpopulationen"
              onClick={() =>
                downloadFromView({
                  view: 'v_tpop',
                  fileName: 'Teilpopulationen'
                })}
            />
            <DownloadCardButton
              onClick={() =>
                downloadFromView({
                  view: 'v_tpop_kml',
                  fileName: 'Teilpopulationen'
                })}
            >
              <div>Teilpopulationen für Google Earth</div>
              <div>(beschriftet mit PopNr/TPopNr)</div>
            </DownloadCardButton>
            <DownloadCardButton
              onClick={() =>
                downloadFromView({
                  view: 'v_tpop_kmlnamen',
                  fileName: 'TeilpopulationenNachNamen'
                })}
            >
              <div>Teilpopulationen für Google Earth</div>
              <div>(beschriftet mit Artname, PopNr/TPopNr)</div>
            </DownloadCardButton>
            <DownloadCardButton
              onClick={() =>
                downloadFromView({
                  view: 'v_tpop_ohnebekanntseit',
                  fileName: 'TeilpopulationenVonApArtenOhneBekanntSeit'
                })}
            >
              <div>Teilpopulationen von AP-Arten</div>
              <div>{'ohne "Bekannt seit"'}</div>
            </DownloadCardButton>
            <DownloadCardButton
              onClick={() =>
                downloadFromView({
                  view: 'v_tpop_ohneapberichtrelevant',
                  fileName: 'TeilpopulationenOhneApBerichtRelevant'
                })}
            >
              <div>Teilpopulationen ohne Eintrag</div>
              <div>{'im Feld "Für AP-Bericht relevant"'}</div>
            </DownloadCardButton>
            <DownloadCardButton
              onClick={() =>
                downloadFromView({
                  view: 'v_tpop_popnrtpopnrmehrdeutig',
                  fileName: 'TeilpopulationenPopnrTpopnrMehrdeutig'
                })}
            >
              <div>Teilpopulationen mit mehrdeutiger</div>
              <div>Kombination von PopNr und TPopNr</div>
            </DownloadCardButton>
            <DownloadCardButton
              label="Anzahl Massnahmen pro Teilpopulation"
              onClick={() =>
                downloadFromView({
                  view: 'v_tpop_anzmassn',
                  fileName: 'TeilpopulationenAnzahlMassnahmen'
                })}
            />
            <DownloadCardButton
              onClick={() =>
                downloadFromView({
                  view: 'v_tpop_anzkontrinklletzterundletztertpopber',
                  fileName: 'TeilpopulationenAnzKontrInklusiveLetzteKontrUndLetztenTPopBericht'
                })}
              disabled={isRemoteHost}
              title={
                isRemoteHost
                  ? 'Funktioniert nur, wenn apflora lokal installiert wird'
                  : ''
              }
            >
              <div>Teilpopulationen mit:</div>
              <ul
                style={{
                  paddingLeft: '18px',
                  marginTop: '5px',
                  marginBottom: '10px'
                }}
              >
                <li>Anzahl Kontrollen</li>
                <li>letzte Kontrolle</li>
                <li>letzter Teilpopulationsbericht</li>
                <li>letzte Zählung</li>
              </ul>
              <div>{'= "Eier legende Wollmilchsau"'}</div>
            </DownloadCardButton>
            <AutocompleteContainer>
              <StyledAutoComplete
                hintText={artList.length === 0 ? 'lade Daten...' : 'Art wählen'}
                floatingLabelText={'"Eier legende Wollmilchsau" für eine Art'}
                openOnFocus
                searchText={artFuerEierlegendeWollmilchsau}
                errorText={
                  artFuerEierlegendeWollmilchsau ? 'hole Daten...' : ''
                }
                errorStyle={{ color: orange500 }}
                dataSource={artList}
                dataSourceConfig={{
                  value: 'TaxonomieId',
                  text: 'Artname'
                }}
                filter={AutoComplete.caseInsensitiveFilter}
                maxSearchResults={20}
                menuStyle={{
                  fontSize: '6px !important'
                }}
                onNewRequest={val => {
                  changeArtFuerEierlegendeWollmilchsau(val.Artname)
                  downloadFromView({
                    view: 'v_tpop_anzkontrinklletzterundletztertpopber',
                    fileName: 'anzkontrinklletzterundletztertpopber_2016',
                    apArtId: val.TaxonomieId
                  })
                }}
              />
            </AutocompleteContainer>
            <DownloadCardButton
              label="Teilpopulationen inklusive Teilpopulations- und Massnahmen-Berichten"
              onClick={() =>
                downloadFromView({
                  view: 'v_tpop_popberundmassnber',
                  fileName: 'TeilpopulationenTPopUndMassnBerichte'
                })}
            />
          </DownloadCardText>
        </FirstLevelCard>
        <FirstLevelCard>
          <CardHeader title="Kontrollen" actAsExpander showExpandableButton />
          <DownloadCardText expandable>
            <DownloadCardButton
              label="Kontrollen"
              onClick={() =>
                downloadFromView({
                  view: 'v_tpopkontr',
                  fileName: 'Kontrollen'
                })}
            />
            <DownloadCardButton
              label="Kontrollen: Anzahl pro Zähleinheit"
              onClick={() =>
                downloadFromView({
                  view: 'v_kontrzaehl_anzproeinheit',
                  fileName: 'KontrollenAnzahlProZaehleinheit'
                })}
            />
          </DownloadCardText>
        </FirstLevelCard>
        <FirstLevelCard>
          <CardHeader title="Massnahmen" actAsExpander showExpandableButton />
          <DownloadCardText expandable>
            <DownloadCardButton
              label="Massnahmen"
              onClick={() =>
                downloadFromView({
                  view: 'v_massn',
                  fileName: 'Massnahmen'
                })}
            />
          </DownloadCardText>
        </FirstLevelCard>
        <FirstLevelCard>
          <CardHeader
            title="Beobachtungen"
            actAsExpander
            showExpandableButton
          />
          <DownloadCardText expandable>
            <DownloadCardButton
              onClick={() =>
                downloadFromView({
                  view: 'v_beob',
                  fileName: 'Beobachtungen'
                })}
            >
              <div>Beobachtungen</div>
              <div>zugeordnet und nicht zuzuordnen</div>
              <div>von Infospezies und EvAB</div>
            </DownloadCardButton>
            <DownloadCardButton
              onClick={() =>
                downloadFromView({
                  view: 'v_beob_infospezies',
                  fileName: 'BeobachtungenInfospezies'
                })}
            >
              <div>Beobachtungen</div>
              <div>zugeordnet, nicht zuzuordnen</div>
              <div>und nicht zugeordnet</div>
              <div>nur von Infospezies</div>
            </DownloadCardButton>
          </DownloadCardText>
        </FirstLevelCard>
        <FirstLevelCard>
          <CardHeader title="Anwendung" actAsExpander showExpandableButton />
          <DownloadCardText expandable>
            <DownloadCardButton
              label="Tabellen und Felder"
              onClick={() =>
                downloadFromView({
                  view: 'v_datenstruktur',
                  fileName: 'Datenstruktur'
                })}
            />
            <DownloadCardButton
              label="Datenstruktur grafisch dargestellt"
              onClick={() => {
                // fileDownload(beziehungen, 'apfloraBeziehungen.png')
                window.open(beziehungen)
              }}
            />
          </DownloadCardText>
        </FirstLevelCard>
      </FieldsContainer>
    </Container>
  )
}

export default enhance(Exporte)
