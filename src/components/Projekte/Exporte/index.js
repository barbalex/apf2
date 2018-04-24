import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import { Card, CardHeader, CardText } from 'material-ui/Card'
import Button from 'material-ui-next/Button'
import sortBy from 'lodash/sortBy'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withProps from 'recompose/withProps'
import withHandlers from 'recompose/withHandlers'
import withLifecycle from '@hocs/with-lifecycle'

import beziehungen from '../../../etc/beziehungen.png'
import FormTitle from '../../shared/FormTitle'
import Tipps from './Tipps'
import Art from './Art'
import Populationen from './Populationen'
import Teilpopulationen from './Teilpopulationen'
import Kontrollen from './Kontrollen'
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
const DownloadCardButton = styled(Button)`
  flex-basis: 450px;
  > span:first-of-type {
    text-transform: none !important;
    font-weight: 500;
    display: block;
    text-align: left;
    justify-content: flex-start !important;
  }
`

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
  artFuerEierlegendeWollmilchsau: String,
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
        <Art downloadFromView={downloadFromView} />
        <Populationen downloadFromView={downloadFromView} />
        <Teilpopulationen
          downloadFromView={downloadFromView}
          artFuerEierlegendeWollmilchsau={artFuerEierlegendeWollmilchsau}
          changeArtFuerEierlegendeWollmilchsau={
            changeArtFuerEierlegendeWollmilchsau
          }
        />
        <Kontrollen downloadFromView={downloadFromView} />
        <FirstLevelCard>
          <CardHeader title="Massnahmen" actAsExpander showExpandableButton />
          <DownloadCardText expandable>
            <DownloadCardButton
              onClick={() =>
                downloadFromView({
                  view: 'v_massn',
                  fileName: 'Massnahmen',
                })
              }
            >
              Massnahmen
            </DownloadCardButton>
            <DownloadCardButton
              onClick={() =>
                downloadFromView({
                  view: 'v_massn_webgisbun',
                  fileName: 'MassnahmenWebGisBun',
                })
              }
            >
              Massnahmen für WebGIS BUN
            </DownloadCardButton>
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
                  fileName: 'Beobachtungen',
                })
              }
            >
              <div>Alle Beobachtungen von Arten aus apflora.ch</div>
              <div>Nutzungsbedingungen der FNS beachten</div>
            </DownloadCardButton>
          </DownloadCardText>
          <DownloadCardText expandable>
            <DownloadCardButton
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
            </DownloadCardButton>
          </DownloadCardText>
        </FirstLevelCard>
        <FirstLevelCard>
          <CardHeader title="Anwendung" actAsExpander showExpandableButton />
          <DownloadCardText expandable>
            <DownloadCardButton
              onClick={() =>
                downloadFromView({
                  view: 'v_datenstruktur',
                  fileName: 'Datenstruktur',
                })
              }
            >
              Tabellen und Felder
            </DownloadCardButton>
            <DownloadCardButton
              onClick={() => {
                window.open(beziehungen)
              }}
            >
              Datenstruktur grafisch dargestellt
            </DownloadCardButton>
          </DownloadCardText>
        </FirstLevelCard>
      </FieldsContainer>
    </Container>
  </ErrorBoundary>
)

export default enhance(Exporte)
