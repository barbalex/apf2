// @flow
import React from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import styled from 'styled-components'
import { ApolloConsumer } from 'react-apollo'
import gql from "graphql-tag"
import get from 'lodash/get'
import { inject } from 'mobx-react'

import exportModule from '../../../modules/export'
import listError from '../../../modules/listError'
import Message from './Message'

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
  transform: ${props => (props['data-expanded'] ? 'rotate(180deg)' : 'none')};
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

const enhance = compose(
  withState('expanded', 'setExpanded', false),
  withState('message', 'setMessage', null),
  inject('store')
)

const Kontrollen = ({
  store,
  fileType,
  applyMapFilterToExport,
  mapFilter,
  client,
  expanded,
  setExpanded,
  message,
  setMessage,
}: {
  store: Object,
  fileType: String,
  applyMapFilterToExport: Boolean,
  mapFilter: Object,
  client: Object,
  expanded: Boolean,
  setExpanded: () => void,
  message: String,
  setMessage: () => void,
}) => (
  <ApolloConsumer>
    {client =>
      <StyledCard>
        <StyledCardActions
          disableActionSpacing
          onClick={() => setExpanded(!expanded)}
        >
          <CardActionTitle>Kontrollen</CardActionTitle>
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
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "Kontrollen" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVTpopkontrs {
                          nodes {
                            ap_id: apId
                            familie
                            artname
                            ap_bearbeitung: apBearbeitung
                            ap_start_jahr: apStartJahr
                            ap_umsetzung: apUmsetzung
                            ap_bearbeiter: apBearbeiter
                            pop_id: popId
                            pop_nr: popNr
                            pop_name: popName
                            pop_status: popStatus
                            pop_bekannt_seit: popBekanntSeit
                            tpop_id: tpopId
                            tpop_nr: tpopNr
                            tpop_gemeinde: tpopGemeinde
                            tpop_flurname: tpopFlurname
                            tpop_status: tpopStatus
                            tpop_bekannt_seit: tpopBekanntSeit
                            tpop_status_unklar: tpopStatusUnklar
                            tpop_status_unklar_grund: tpopStatusUnklarGrund
                            tpop_x: tpopX
                            tpop_y: tpopY
                            tpop_radius: tpopRadius
                            tpop_hoehe: tpopHoehe
                            tpop_exposition: tpopExposition
                            tpop_klima: tpopKlima
                            tpop_neigung: tpopNeigung
                            tpop_beschreibung: tpopBeschreibung
                            tpop_kataster_nr: tpopKatasterNr
                            tpop_apber_relevant: tpopApberRelevant
                            tpop_eigentuemer: tpopEigentuemer
                            tpop_kontakt: tpopKontakt
                            tpop_nutzungszone: tpopNutzungszone
                            tpop_bewirtschafter: tpopBewirtschafter
                            tpop_bewirtschaftung: tpopBewirtschaftung
                            id
                            jahr
                            datum
                            typ
                            bearbeiter
                            ueberlebensrate
                            vitalitaet
                            entwicklung
                            ursachen
                            erfolgsbeurteilung
                            umsetzung_aendern: umsetzungAendern
                            kontrolle_aendern: kontrolleAendern
                            bemerkungen
                            lr_delarze: lrDelarze
                            lr_umgebung_delarze: lrUmgebungDelarze
                            vegetationstyp
                            konkurrenz
                            moosschicht
                            krautschicht
                            strauchschicht
                            baumschicht
                            boden_typ: bodenTyp
                            boden_kalkgehalt: bodenKalkgehalt
                            boden_durchlaessigkeit: bodenDurchlaessigkeit
                            boden_humus: bodenHumus
                            boden_naehrstoffgehalt: bodenNaehrstoffgehalt
                            boden_abtrag: bodenAbtrag
                            wasserhaushalt
                            idealbiotop_uebereinstimmung: idealbiotopUebereinstimmung
                            handlungsbedarf
                            flaeche_ueberprueft: flaecheUeberprueft
                            flaeche
                            plan_vorhanden: planVorhanden
                            deckung_vegetation: deckungVegetation
                            deckung_nackter_boden: deckungNackterBoden
                            deckung_ap_art: deckungApArt
                            jungpflanzen_vorhanden: jungpflanzenVorhanden
                            vegetationshoehe_maximum: vegetationshoeheMaximum
                            vegetationshoehe_mittel: vegetationshoeheMittel
                            gefaehrdung
                            changed
                            changed_by: changedBy
                            zaehlung_anzahlen: zaehlungAnzahlen
                            zaehlung_einheiten: zaehlungEinheiten
                            zaehlung_methoden: zaehlungMethoden
                          }
                        }
                      }`
                  })
                  exportModule({
                    data: get(data, 'allVTpopkontrs.nodes', []),
                    fileName: 'Kontrollen',
                    fileType,
                    applyMapFilterToExport,
                    mapFilter,
                    idKey: 'tpop_id',
                    xKey: 'tpop_x',
                    yKey: 'tpop_y',
                  })
                } catch(error) {
                  listError(error)
                }
                setMessage(null)
              }}
            >
              Kontrollen
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "KontrollenWebGisBun" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVTpopkontrWebgisbuns {
                          nodes {
                            APARTID: apartid
                            APART: apart
                            POPGUID: popguid
                            POPNR: popnr
                            TPOPGUID: tpopguid
                            TPOPNR: tpopnr
                            KONTRGUID: kontrguid
                            KONTRJAHR: kontrjahr
                            KONTRDAT: kontrdat
                            KONTRTYP: kontrtyp
                            TPOPSTATUS: tpopstatus
                            KONTRBEARBEITER: kontrbearbeiter
                            KONTRUEBERLEBENSRATE: kontrueberlebensrate
                            KONTRVITALITAET: kontrvitalitaet
                            KONTRENTWICKLUNG: kontrentwicklung
                            KONTRURSACHEN: kontrursachen
                            KONTRERFOLGBEURTEIL: kontrerfolgbeurteil
                            KONTRAENDUMSETZUNG: kontraendumsetzung
                            KONTRAENDKONTROLLE: kontraendkontrolle
                            KONTR_X: kontrX
                            KONTR_Y: kontrY
                            KONTRBEMERKUNGEN: kontrbemerkungen
                            KONTRLRMDELARZE: kontrlrmdelarze
                            KONTRDELARZEANGRENZ: kontrdelarzeangrenz
                            KONTRVEGTYP: kontrvegtyp
                            KONTRKONKURRENZ: kontrkonkurrenz
                            KONTRMOOSE: kontrmoose
                            KONTRKRAUTSCHICHT: kontrkrautschicht
                            KONTRSTRAUCHSCHICHT: kontrstrauchschicht
                            KONTRBAUMSCHICHT: kontrbaumschicht
                            KONTRBODENTYP: kontrbodentyp
                            KONTRBODENKALK: kontrbodenkalk
                            KONTRBODENDURCHLAESSIGK: kontrbodendurchlaessigk
                            KONTRBODENHUMUS: kontrbodenhumus
                            KONTRBODENNAEHRSTOFF: kontrbodennaehrstoff
                            KONTROBERBODENABTRAG: kontroberbodenabtrag
                            KONTROBODENWASSERHAUSHALT: kontrobodenwasserhaushalt
                            KONTRUEBEREINSTIMMUNIDEAL: kontruebereinstimmunideal
                            KONTRHANDLUNGSBEDARF: kontrhandlungsbedarf
                            KONTRUEBERPRUFTFLAECHE: kontrueberpruftflaeche
                            KONTRFLAECHETPOP: kontrflaechetpop
                            KONTRAUFPLAN: kontraufplan
                            KONTRDECKUNGVEG: kontrdeckungveg
                            KONTRDECKUNGBODEN: kontrdeckungboden
                            KONTRDECKUNGART: kontrdeckungart
                            KONTRJUNGEPLANZEN: kontrjungeplanzen
                            KONTRMAXHOEHEVEG: kontrmaxhoeheveg
                            KONTRMITTELHOEHEVEG: kontrmittelhoeheveg
                            KONTRGEFAEHRDUNG: kontrgefaehrdung
                            KONTRCHANGEDAT: kontrchangedat
                            KONTRCHANGEBY: kontrchangeby
                            ZAEHLEINHEITEN: zaehleinheiten
                            ANZAHLEN: anzahlen
                            METHODEN: methoden
                          }
                        }
                      }`
                  })
                  exportModule({
                    data: get(data, 'allVTpopkontrWebgisbuns.nodes', []),
                    fileName: 'KontrollenWebGisBun',
                    fileType,
                    applyMapFilterToExport,
                    mapFilter,
                    idKey: 'KONTRGUID',
                    xKey: 'KONTR_X',
                    yKey: 'KONTR_Y',
                  })
                } catch(error) {
                  listError(error)
                }
                setMessage(null)
              }}
            >
              Kontrollen für WebGIS BUN
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "KontrollenAnzahlProZaehleinheit" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVKontrzaehlAnzproeinheits {
                          nodes {
                            id
                            artname
                            apBearbeitung
                            apStartJahr
                            apUmsetzung
                            apBearbeiter
                            popId
                            popNr
                            popName
                            popStatus
                            popBekanntSeit
                            tpopId
                            tpopNr
                            tpopGemeinde
                            tpopFlurname
                            tpopStatus
                            tpopBekanntSeit
                            tpopStatusUnklar
                            tpopStatusUnklarGrund
                            tpopX
                            tpopY
                            tpopRadiusM
                            tpopHoehe
                            tpopExposition
                            tpopKlima
                            tpopNeigung
                            tpopBeschreibung
                            tpopKatasterNr
                            tpopApberRelevant
                            tpopEigentuemer
                            tpopKontakt
                            tpopNutzungszone
                            tpopBewirtschafter
                            tpopBewirtschaftung
                            kontrId
                            kontrJahr
                            kontrDatum
                            kontrTyp
                            kontrBearbeiter
                            kontrUeberlebensrate
                            kontrVitalitaet
                            kontrEntwicklung
                            kontrUrsachen
                            kontrErfolgsbeurteilung
                            kontrUmsetzungAendern
                            kontrKontrolleAendern
                            kontrBemerkungen
                            kontrLrDelarze
                            kontrLrUmgebungDelarze
                            kontrVegetationstyp
                            kontrKonkurrenz
                            kontrMoosschicht
                            kontrStrauchschicht
                            kontrBaumschicht
                            kontrBodenTyp
                            kontrBodenKalkgehalt
                            kontrBodenDurchlaessigkeit
                            kontrBodenHumus
                            kontrBodenNaehrstoffgehalt
                            kontrBodenAbtrag
                            kontrWasserhaushalt
                            kontrIdealbiotopUebereinstimmung
                            kontrHandlungsbedarf
                            kontrFlaecheUeberprueft
                            kontrFlaeche
                            kontrPlanVorhanden
                            kontrDeckungVegetation
                            kontrDeckungNackterBoden
                            kontrDeckungApArt
                            kontrJungpflanzenVorhanden
                            kontrVegetationshoeheMaximum
                            kontrVegetationshoeheMittel
                            kontrGefaehrdung
                            kontrChanged
                            kontrChangedBy
                            id
                            einheit
                            methode
                            anzahl
                          }
                        }
                      }`
                  })
                  exportModule({
                    data: get(data, 'allVKontrzaehlAnzproeinheits.nodes', []),
                    fileName: 'KontrollenAnzahlProZaehleinheit',
                    fileType,
                    applyMapFilterToExport,
                    mapFilter,
                    idKey: 'id',
                    xKey: 'tpopX',
                    yKey: 'tpopY',
                  })
                } catch(error) {
                  listError(error)
                }
                setMessage(null)
              }}
            >
              Kontrollen: Anzahl pro Zähleinheit
            </DownloadCardButton>
          </StyledCardContent>
        </Collapse>
        {
          !!message &&
          <Message message={message} />
        }
      </StyledCard>
    }
  </ApolloConsumer>
)

export default enhance(Kontrollen)
