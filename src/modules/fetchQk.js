// @flow
import axios from 'axios'
import isFinite from 'lodash/isFinite'

import isPointInsidePolygon from './isPointInsidePolygon'
import staticFilesBaseUrl from './staticFilesBaseUrl'

const fetchQk = async ({
  store,
  berichtjahr,
  apArtId,
}: {
  store: Object,
  berichtjahr: number,
  apArtId: number,
}) => {
  const { addMessages, setLoading } = store.qk
  setLoading(true)
  const qualityControls = [
    // 1. Art

    // Ziel ohne Jahr/Zieltyp/Ziel
    { type: 'view', name: 'v_qk2_ziel_ohnejahr' },
    { type: 'view', name: 'v_qk2_ziel_ohnetyp' },
    { type: 'view', name: 'v_qk2_ziel_ohneziel' },
    // Ziel-Bericht ohne Jahr/Entwicklung
    { type: 'view', name: 'v_qk2_zielber_ohnejahr' },
    { type: 'view', name: 'v_qk2_zielber_ohneentwicklung', berichtjahr },
    // AP-Erfolgskriterium ohne Beurteilung/Kriterien
    { type: 'view', name: 'v_qk2_erfkrit_ohnebeurteilung' },
    { type: 'view', name: 'v_qk2_erfkrit_ohnekriterien' },
    // AP-Bericht ohne Jahr/Vergleich Vorjahr-Gesamtziel/Beurteilung
    { type: 'view', name: 'v_qk2_apber_ohnejahr' },
    {
      type: 'view',
      name: 'v_qk2_apber_ohnevergleichvorjahrgesamtziel',
      berichtjahr,
    },
    { type: 'view', name: 'v_qk2_apber_ohnebeurteilung', berichtjahr },
    // assoziierte Art ohne Art
    { type: 'view', name: 'v_qk2_assozart_ohneart' },

    // 2. Population

    // Population: ohne Nr/Name/Status/bekannt seit/Koordinaten/tpop
    { type: 'view', name: 'v_qk2_pop_ohnepopnr' },
    { type: 'view', name: 'v_qk2_pop_ohnepopname' },
    { type: 'view', name: 'v_qk2_pop_ohnepopstatus' },
    { type: 'view', name: 'v_qk2_pop_ohnebekanntseit' },
    { type: 'view', name: 'v_qk2_pop_ohnekoord' },
    { type: 'view', name: 'v_qk2_pop_ohnetpop' },
    // Population: mit Status unklar, ohne Begründung
    { type: 'view', name: 'v_qk2_pop_mitstatusunklarohnebegruendung' },
    // Population: mit mehrdeutiger Nr
    { type: 'view', name: 'v_qk2_pop_popnrmehrdeutig' },
    // Population: ohne verlangten Pop-Bericht im Berichtjahr
    { type: 'function', name: 'qk2_pop_ohne_popber', berichtjahr },
    // Population: ohne verlangten Pop-Massn-Bericht im Berichtjahr
    { type: 'function', name: 'qk2_pop_ohne_popmassnber', berichtjahr },
    // Population: Entsprechen Koordinaten der Pop einer der TPops?
    { type: 'view', name: 'v_qk2_pop_koordentsprechenkeinertpop' },
    // Population: Status ist ansaatversuch,
    // es gibt tpop mit status aktuell oder erloschene, die vor Beginn AP bestanden
    { type: 'view', name: 'v_qk2_pop_statusansaatversuchmitaktuellentpop' },
    // Population: Status ist ansaatversuch, alle tpop sind gemäss Status erloschen
    { type: 'view', name: 'v_qk2_pop_statusansaatversuchalletpoperloschen' },
    // Population: Status ist ansaatversuch, es gibt tpop mit status ursprünglich erloschen
    {
      type: 'view',
      name: 'v_qk2_pop_statusansaatversuchmittpopursprerloschen',
    },
    // Population: Status ist "erloschen" (ursprünglich oder angesiedelt),
    // es gibt aber eine Teilpopulation mit Status "aktuell" (ursprünglich oder angesiedelt)
    { type: 'view', name: 'v_qk2_pop_statuserloschenmittpopaktuell' },
    // Population: Status ist "erloschen" (ursprünglich oder angesiedelt),
    // es gibt aber eine Teilpopulation mit Status "angesiedelt, Ansaatversuch":
    { type: 'view', name: 'v_qk2_pop_statuserloschenmittpopansaatversuch' },
    // Population: Status ist "angesiedelt", es gibt aber eine Teilpopulation mit Status "ursprünglich":
    { type: 'view', name: 'v_qk2_pop_statusangesiedeltmittpopurspruenglich' },
    // Population: Status ist "aktuell", der letzte Populations-Bericht meldet aber "erloschen"
    { type: 'view', name: 'v_qk2_pop_statusaktuellletzterpopbererloschen' },
    // Population: Status ist "erloschen", der letzte Populations-Bericht meldet aber "aktuell"
    { type: 'view', name: 'v_qk2_pop_statuserloschenletzterpopberaktuell' },
    // Population: Status ist "potenzieller Wuchs-/Ansiedlungsort",
    // es gibt aber eine Teilpopulation mit Status "angesiedelt" oder "ursprünglich":
    { type: 'view', name: 'v_qk2_pop_statusaktuellletzterpopbererloschen' },
    // Pop-Bericht/Pop-Massn.-Bericht ohne Jahr/Entwicklung
    { type: 'view', name: 'v_qk2_popber_ohnejahr' },
    { type: 'view', name: 'v_qk2_popber_ohneentwicklung', berichtjahr },
    { type: 'view', name: 'v_qk2_popmassnber_ohnejahr' },
    { type: 'view', name: 'v_qk2_popmassnber_ohneentwicklung', berichtjahr },

    // 3. Teilpopulation

    // Teilpopulation: Status ist "aktuell", der letzte Teilpopulations-Bericht meldet aber "erloschen"
    { type: 'view', name: 'v_qk2_tpop_statusaktuellletzterpopbererloschen' },
    // Teilpopulation: Status ist "erloschen", der letzte Teilpopulations-Bericht meldet aber "aktuell"
    { type: 'view', name: 'v_qk2_tpop_statuserloschenletzterpopberaktuell' },
    // tpop ohne Nr/Flurname/Status/bekannt seit/Koordinaten
    { type: 'view', name: 'v_qk2_tpop_ohnenr' },
    { type: 'view', name: 'v_qk2_tpop_ohneflurname' },
    { type: 'view', name: 'v_qk2_tpop_ohnestatus' },
    { type: 'view', name: 'v_qk2_tpop_ohnebekanntseit' },
    { type: 'view', name: 'v_qk2_tpop_ohneapberrelevant' },
    { type: 'view', name: 'v_qk2_tpop_ohnekoordinaten' },
    // tpop relevant, die nicht relevant sein sollten
    { type: 'view', name: 'v_qk2_tpop_statuspotentiellfuerapberrelevant' },
    {
      type: 'view',
      name: 'v_qk2_tpop_erloschenundrelevantaberletztebeobvor1950',
    },
    // tpop mit Status unklar ohne Begründung
    { type: 'view', name: 'v_qk2_tpop_mitstatusunklarohnebegruendung' },
    // tpop mit mehrdeutiger Kombination von PopNr und TPopNr
    { type: 'view', name: 'v_qk2_tpop_popnrtpopnrmehrdeutig' },
    // TPop ohne verlangten TPop-Bericht im Berichtjahr
    { type: 'function', name: 'qk2_tpop_ohne_tpopber', berichtjahr },
    // TPop ohne verlangten TPop-Massn.-Bericht im Berichtjahr
    { type: 'function', name: 'qk2_tpop_ohne_massnber', berichtjahr },
    // Teilpopulation mit Status "Ansaatversuch", bei denen in einer Kontrolle eine Anzahl festgestellt wurde:
    {
      type: 'view',
      name: 'v_qk2_tpop_mitstatusansaatversuchundzaehlungmitanzahl',
    },
    // Teilpopulation mit Status "potentieller Wuchs-/Ansiedlungsort",
    // bei der eine Massnahme des Typs "Ansiedlung" existiert:
    { type: 'view', name: 'v_qk2_tpop_mitstatuspotentiellundmassnansiedlung' },
    // TPop-Bericht ohne Jahr/Entwicklung
    { type: 'view', name: 'v_qk2_tpopber_ohnejahr' },
    { type: 'view', name: 'v_qk2_tpopber_ohneentwicklung', berichtjahr },

    // 4. Massnahmen

    // Massn ohne Jahr/Typ
    { type: 'view', name: 'v_qk2_massn_ohnejahr' },
    { type: 'view', name: 'v_qk2_massn_ohnetyp', berichtjahr },
    // Massn.-Bericht ohne Jahr/Entwicklung
    { type: 'view', name: 'v_qk2_massnber_ohnejahr' },
    { type: 'view', name: 'v_qk2_massnber_ohneerfbeurt', berichtjahr },

    // 5. Kontrollen

    // Kontrolle ohne Jahr/Zählung/Kontrolltyp
    { type: 'view', name: 'v_qk2_feldkontr_ohnejahr' },
    { type: 'view', name: 'v_qk2_freiwkontr_ohnejahr' },
    { type: 'view', name: 'v_qk2_feldkontr_ohnezaehlung', berichtjahr },
    { type: 'view', name: 'v_qk2_freiwkontr_ohnezaehlung', berichtjahr },
    { type: 'view', name: 'v_qk2_feldkontr_ohnetyp', berichtjahr },
    // Zählung ohne Einheit/Methode/Anzahl
    { type: 'view', name: 'v_qk2_feldkontrzaehlung_ohneeinheit', berichtjahr },
    { type: 'view', name: 'v_qk2_freiwkontrzaehlung_ohneeinheit', berichtjahr },
    { type: 'view', name: 'v_qk2_feldkontrzaehlung_ohnemethode', berichtjahr },
    { type: 'view', name: 'v_qk2_freiwkontrzaehlung_ohnemethode', berichtjahr },
    { type: 'view', name: 'v_qk2_feldkontrzaehlung_ohneanzahl', berichtjahr },
    { type: 'view', name: 'v_qk2_freiwkontrzaehlung_ohneanzahl', berichtjahr },
  ]
  let nrOfMessages = 0

  const qualityControlsUsingView = qualityControls.filter(
    q => q.type === 'view'
  )
  const queryUrls = qualityControlsUsingView.map(t => {
    if (t.berichtjahr) {
      return `/${t.name}?ApArtId=eq.${apArtId}&Berichtjahr=eq.${t.berichtjahr}`
    } else {
      return `/${t.name}?ApArtId=eq.${apArtId}`
    }
  })
  const dataFetchingPromisesForQueries = queryUrls.map(dataUrl =>
    axios
      .get(dataUrl)
      .then(res => {
        if (res.data.length > 0) {
          const newMessages = res.data
          addMessages(newMessages)
          nrOfMessages += 1
        }
        return null
      })
      .catch(e => e)
  )

  const qualityControlsUsingFunction = qualityControls.filter(
    q => q.type === 'function'
  )
  const functionUrls = qualityControlsUsingFunction.map(t => `/rpc/${t.name}`)
  const dataFetchingPromisesForFunctions = functionUrls.map(dataUrl =>
    axios
      .post(dataUrl, { apid: apArtId, berichtjahr })
      .then(res => {
        if (res.data.length > 0) {
          const newMessages = res.data
          addMessages(newMessages)
          nrOfMessages += 1
        }
        return null
      })
      .catch(e => e)
  )

  try {
    await Promise.all([
      ...dataFetchingPromisesForQueries,
      ...dataFetchingPromisesForFunctions,
    ])
  } catch (error) {
    store.listError(error)
  }
  let resultTpopKoord: { data: Array<Object> }
  try {
    resultTpopKoord = await axios.get(`/v_tpopkoord?ApArtId=eq.${apArtId}`)
  } catch (error) {
    store.listError(error)
    setLoading(false)
  }
  let tpops = resultTpopKoord.data
  let resultKtZh: { data: Object }
  try {
    const baseURL = staticFilesBaseUrl
    resultKtZh = await axios.get('/ktZh.json', { baseURL })
  } catch (error) {
    store.listError(error)
    setLoading(false)
  }
  const ktZh = resultKtZh.data
  if (ktZh) {
    // kontrolliere die Relevanz ausserkantonaler Tpop
    tpops = tpops.filter(
      tpop =>
        tpop.TPopApBerichtRelevant === 1 &&
        tpop.TPopXKoord &&
        isFinite(tpop.TPopXKoord) &&
        tpop.TPopYKoord &&
        isFinite(tpop.TPopYKoord) &&
        !isPointInsidePolygon(ktZh, tpop.TPopXKoord, tpop.TPopYKoord)
    )
    if (tpops.length > 0) {
      const messages = tpops.map(tpop => ({
        hw: `Teilpopulation ist als 'Für AP-Bericht relevant' markiert, liegt aber ausserhalb des Kt. Zürich und sollte daher nicht relevant sein:`,
        url: [
          'Projekte',
          1,
          'Arten',
          tpop.ApArtId,
          'Populationen',
          tpop.PopId,
          'Teil-Populationen',
          tpop.TPopId,
        ],
        text: [
          `Projekt: ${store.table.projekt.get(store.tree.activeNodes.projekt)
            .ProjName}`,
          `Art: ${store.table.adb_eigenschaften.get(store.tree.activeNodes.ap)
            .Artname}`,
          `Population: ${store.table.pop.get(tpop.PopId).PopName}`,
          `Teil-Population: ${tpop.TPopFlurname}`,
        ],
      }))
      store.qk.addMessages(messages)
      nrOfMessages += tpops.length
    }
  }
  // if no messages: tell user
  if (nrOfMessages === 0) {
    const messages = {
      hw: 'Wow: Scheint alles i.O. zu sein!',
      url: [],
      text: '',
    }
    store.qk.addMessages(messages)
  }
  setLoading(false)
}

export default fetchQk
