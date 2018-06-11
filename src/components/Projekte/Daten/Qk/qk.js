// @flow
export default (berichtjahr) => [
  // 1. Art

  // Ziel ohne Jahr/Zieltyp/Ziel
  {
    query: 'allVQZielOhnejahrs',
    title: 'Ziel ohne Jahr:',
    url: (o) => ['Projekte', o.projId, 'Aktionspläne', o.apId, 'Ziele', o.id],
    text: (o) => `Ziel (id): ${o.id}`
  },
  {
    query: 'allVQZielOhnetyps',
    title: 'Ziel ohne Typ:',
    url: (o) => ['Projekte', o.projId, 'Aktionspläne', o.apId, 'Ziele', o.id],
    text: (o) => `Ziel (Jahr): ${o.jahr}`
  },
  {
    query: 'allVQZielOhneziels',
    title: 'Ziel ohne Ziel:',
    url: (o) => ['Projekte', o.projId, 'Aktionspläne', o.apId, 'Ziele', o.id],
    text: (o) => `Ziel (Jahr): ${o.jahr}`
  },
  // Ziel-Bericht ohne Jahr/Entwicklung
  {
    type: 'view',
    name: 'v_qk_zielber_ohnejahr'
  },
  {
    type: 'view',
    name: 'v_qk_zielber_ohneentwicklung',
    berichtjahr
  },
  // AP-Erfolgskriterium ohne Beurteilung/Kriterien
  {
    query: 'allVQErfkritOhnebeurteilungs',
    title: 'Erfolgskriterium ohne Beurteilung:',
    url: (o) => ['Projekte', o.projId, 'Aktionspläne', o.apId, 'Erfolgskriterien', o.id],
    text: (o) => `Erfolgskriterium (id): ${o.jahr}`
  },
  {
    type: 'view',
    name: 'v_qk_erfkrit_ohnekriterien'
  },
  // AP-Bericht ohne Jahr/Vergleich Vorjahr-Gesamtziel/Beurteilung
  {
    type: 'view',
    name: 'v_qk_apber_ohnejahr'
  },
  {
    type: 'view',
    name: 'v_qk_apber_ohnevergleichvorjahrgesamtziel',
    berichtjahr,
  },
  {
    type: 'view',
    name: 'v_qk_apber_ohnebeurteilung',
    berichtjahr
  },
  // assoziierte Art ohne Art
  {
    type: 'view',
    name: 'v_qk_assozart_ohneart'
  },

  // 2. Population

  // Population: ohne Nr/Name/Status/bekannt seit/Koordinaten/tpop
  {
    type: 'view',
    name: 'v_qk_pop_ohnepopnr'
  },
  {
    type: 'view',
    name: 'v_qk_pop_ohnepopname'
  },
  {
    type: 'view',
    name: 'v_qk_pop_ohnepopstatus'
  },
  {
    type: 'view',
    name: 'v_qk_pop_ohnebekanntseit'
  },
  {
    type: 'view',
    name: 'v_qk_pop_ohnekoord'
  },
  {
    type: 'view',
    name: 'v_qk_pop_ohnetpop'
  },
  // Population: mit Status unklar, ohne Begründung
  {
    type: 'view',
    name: 'v_qk_pop_mitstatusunklarohnebegruendung'
  },
  // Population: mit mehrdeutiger Nr
  {
    type: 'view',
    name: 'v_qk_pop_popnrmehrdeutig'
  },
  // Population: ohne verlangten Pop-Bericht im Berichtjahr
  {
    type: 'function',
    name: 'qk_pop_ohne_popber',
    berichtjahr
  },

  // Bericht-Stati kontrollieren
  {
    type: 'view',
    name: 'v_qk_pop_mit_ber_zunehmend_ohne_tpopber_zunehmend',
    berichtjahr,
  },
  {
    type: 'view',
    name: 'v_qk_pop_mit_ber_abnehmend_ohne_tpopber_abnehmend',
    berichtjahr,
  },
  {
    type: 'view',
    name: 'v_qk_pop_mit_ber_erloschen_ohne_tpopber_erloschen',
    berichtjahr,
  },
  {
    type: 'view',
    name: 'v_qk_pop_mit_ber_erloschen_und_tpopber_nicht_erloschen',
    berichtjahr,
  },

  // Stati der Population mit den Stati der Teil-Populationen vergleichen
  // Keine Teil-Population hat den Status der Population:
  {
    type: 'view',
    name: 'v_qk_pop_ohnetpopmitgleichemstatus',
  },
  // Status ist "potentieller Wuchs-/Ansiedlungsort".
  // Es gibt aber Teil-Populationen mit abweichendem Status:
  {
    type: 'view',
    name: 'v_qk_pop_status300tpopstatusanders',
  },
  // Status ist "Ansaatversuch".
  // Es gibt Teil-Populationen mit nicht zulässigen Stati
  // ("ursprünglich" oder "angesiedelt, aktuell"):
  {
    type: 'view',
    name: 'v_qk_pop_status201tpopstatusunzulaessig',
  },
  // Status ist "angesiedelt nach Beginn AP, erloschen/nicht etabliert".
  // Es gibt Teil-Populationen mit abweichendem Status:
  {
    type: 'view',
    name: 'v_qk_pop_status202tpopstatusanders',
  },
  // Status ist "angesiedelt vor Beginn AP, erloschen/nicht etabliert".
  // Es gibt Teil-Populationen mit nicht zulässigen Stati
  // ("ursprünglich", "angesiedelt, aktuell", "Ansaatversuch", "potentieller Wuchsort"):
  {
    type: 'view',
    name: 'v_qk_pop_status211tpopstatusunzulaessig',
  },
  // Status ist "angesiedelt nach Beginn AP, aktuell".
  // Es gibt Teil-Populationen mit nicht zulässigen Stati
  // ("ursprünglich", "angesiedelt vor Beginn AP, aktuell"):
  {
    type: 'view',
    name: 'v_qk_pop_status200tpopstatusunzulaessig',
  },
  // Status ist "angesiedelt vor Beginn AP, aktuell".
  // Es gibt Teil-Populationen mit nicht zulässigen Stati ("ursprünglich"):
  {
    type: 'view',
    name: 'v_qk_pop_status210tpopstatusunzulaessig',
  },
  // Status ist "ursprünglich, erloschen".
  // Es gibt Teil-Populationen mit abweichendem Status:
  {
    type: 'view',
    name: 'v_qk_pop_status101tpopstatusanders',
  },

  // Stati mit letztem Bericht vergleichen
  // Status ist "erloschen" (ursprünglich oder angesiedelt),
  // Ansaatversuch oder potentieller Wuchsort;
  // der letzte Populations-Bericht meldet aber "zunehmend"
  // und es gab seither keine Ansiedlung:
  {
    type: 'view',
    name: 'v_qk_pop_statuserloschenletzterpopberzunehmend'
  },
  // Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "stabil" und es gab seither keine Ansiedlung:
  {
    type: 'view',
    name: 'v_qk_pop_statuserloschenletzterpopberstabil'
  },
  // Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "abnehmend" und es gab seither keine Ansiedlung:
  {
    type: 'view',
    name: 'v_qk_pop_statuserloschenletzterpopberabnehmend'
  },
  // Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "unsicher" und es gab seither keine Ansiedlung:
  {
    type: 'view',
    name: 'v_qk_pop_statuserloschenletzterpopberunsicher'
  },

  // Stati kontrollieren
  // Population: ohne verlangten Pop-Massn-Bericht im Berichtjahr
  {
    type: 'function',
    name: 'qk_pop_ohne_popmassnber',
    berichtjahr
  },
  // Population: Entsprechen Koordinaten der Pop einer der TPops?
  {
    type: 'view',
    name: 'v_qk_pop_koordentsprechenkeinertpop'
  },
  // Population: Status ist ansaatversuch,
  // es gibt tpop mit status aktuell oder erloschene, die vor Beginn AP bestanden
  {
    type: 'view',
    name: 'v_qk_pop_statusansaatversuchmitaktuellentpop'
  },
  // Population: Status ist ansaatversuch, alle tpop sind gemäss Status erloschen
  {
    type: 'view',
    name: 'v_qk_pop_statusansaatversuchalletpoperloschen'
  },
  // Population: Status ist ansaatversuch, es gibt tpop mit status ursprünglich erloschen
  {
    type: 'view',
    name: 'v_qk_pop_statusansaatversuchmittpopursprerloschen',
  },
  // Population: Status ist "erloschen" (ursprünglich oder angesiedelt),
  // es gibt aber eine Teilpopulation mit Status "aktuell" (ursprünglich oder angesiedelt)
  {
    type: 'view',
    name: 'v_qk_pop_statuserloschenmittpopaktuell'
  },
  // Population: Status ist "erloschen" (ursprünglich oder angesiedelt),
  // es gibt aber eine Teilpopulation mit Status "angesiedelt, Ansaatversuch":
  {
    type: 'view',
    name: 'v_qk_pop_statuserloschenmittpopansaatversuch'
  },
  // Population: Status ist "angesiedelt", es gibt aber eine Teilpopulation mit Status "ursprünglich":
  {
    type: 'view',
    name: 'v_qk_pop_statusangesiedeltmittpopurspruenglich'
  },
  // Status ist "aktuell" (ursprünglich oder angesiedelt) oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "erloschen" und es gab seither keine Ansiedlung:
  {
    type: 'view',
    name: 'v_qk_pop_statusaktuellletzterpopbererloschen'
  },
  // Population: Status ist "erloschen", der letzte Populations-Bericht meldet aber "aktuell"
  {
    type: 'view',
    name: 'v_qk_pop_statuserloschenletzterpopberaktuell'
  },
  // Status ist "erloschen" (ursprünglich oder angesiedelt); der letzte Populations-Bericht meldet "erloschen". Seither gab es aber eine Ansiedlung
  {
    type: 'view',
    name: 'v_qk_pop_statuserloschenletzterpopbererloschenmitansiedlung',
  },
  // Pop-Bericht/Pop-Massn.-Bericht ohne Jahr/Entwicklung
  {
    type: 'view',
    name: 'v_qk_popber_ohnejahr'
  },
  {
    type: 'view',
    name: 'v_qk_popber_ohneentwicklung',
    berichtjahr
  },
  {
    type: 'view',
    name: 'v_qk_popmassnber_ohnejahr'
  },
  {
    type: 'view',
    name: 'v_qk_popmassnber_ohneentwicklung',
    berichtjahr
  },

  // 3. Teilpopulation

  // Stati mit letztem Bericht vergleichen
  // Status ist "aktuell" (ursprünglich oder angesiedelt) oder potentieller Wuchsort, der letzte Teilpopulations-Bericht meldet aber "erloschen" und es gab seither keine Ansiedlung
  {
    type: 'view',
    name: 'v_qk_tpop_statusaktuellletztertpopbererloschen'
  },
  // Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "stabil" und es gab seither keine Ansiedlung:
  {
    type: 'view',
    name: 'v_qk_tpop_statuserloschenletztertpopberstabil'
  },
  // Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "abnehmend" und es gab seither keine Ansiedlung:
  {
    type: 'view',
    name: 'v_qk_tpop_statuserloschenletztertpopberabnehmend'
  },
  // Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "unsicher" und es gab seither keine Ansiedlung:
  {
    type: 'view',
    name: 'v_qk_tpop_statuserloschenletztertpopberunsicher'
  },
  // Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "zunehmend" und es gab seither keine Ansiedlung:
  {
    type: 'view',
    name: 'v_qk_tpop_statuserloschenletztertpopberzunehmend'
  },
  // Teilpopulation: Status ist "erloschen", der letzte Teilpopulations-Bericht meldet aber "aktuell"
  // ????? popber aktuell????
  {
    type: 'view',
    name: 'v_qk_tpop_statuserloschenletzterpopberaktuell'
  },
  // Status ist "erloschen" (ursprünglich oder angesiedelt); der letzte Teilpopulations-Bericht meldet "erloschen". Seither gab es aber eine Ansiedlung:
  {
    type: 'view',
    name: 'v_qk_tpop_statuserloschenletztertpopbererloschenmitansiedlung',
  },
  // tpop ohne Nr/Flurname/Status/bekannt seit/Koordinaten
  {
    type: 'view',
    name: 'v_qk_tpop_ohnenr'
  },
  {
    type: 'view',
    name: 'v_qk_tpop_ohneflurname'
  },
  {
    type: 'view',
    name: 'v_qk_tpop_ohnestatus'
  },
  {
    type: 'view',
    name: 'v_qk_tpop_ohnebekanntseit'
  },
  {
    type: 'view',
    name: 'v_qk_tpop_ohneapberrelevant'
  },
  {
    type: 'view',
    name: 'v_qk_tpop_ohnekoordinaten'
  },
  // tpop relevant, die nicht relevant sein sollten
  {
    type: 'view',
    name: 'v_qk_tpop_statuspotentiellfuerapberrelevant'
  },
  {
    type: 'view',
    name: 'v_qk_tpop_erloschenundrelevantaberletztebeobvor1950',
  },
  // tpop mit Status unklar ohne Begründung
  {
    type: 'view',
    name: 'v_qk_tpop_mitstatusunklarohnebegruendung'
  },
  // tpop mit mehrdeutiger Kombination von pop_nr und tpop_nr
  {
    type: 'view',
    name: 'v_qk_tpop_popnrtpopnrmehrdeutig'
  },
  // TPop ohne verlangten TPop-Bericht im Berichtjahr
  {
    type: 'function',
    name: 'qk_tpop_ohne_tpopber',
    berichtjahr
  },
  // TPop ohne verlangten TPop-Massn.-Bericht im Berichtjahr
  {
    type: 'function',
    name: 'qk_tpop_ohne_massnber',
    berichtjahr
  },
  // Teilpopulation mit Status "Ansaatversuch", bei denen in einer Kontrolle eine Anzahl festgestellt wurde:
  {
    type: 'view',
    name: 'v_qk_tpop_mitstatusansaatversuchundzaehlungmitanzahl',
  },
  // Teilpopulation mit Status "potentieller Wuchs-/Ansiedlungsort",
  // bei der eine Massnahme des Typs "Ansiedlung" existiert:
  {
    type: 'view',
    name: 'v_qk_tpop_mitstatuspotentiellundmassnansiedlung'
  },
  // TPop-Bericht ohne Jahr/Entwicklung
  {
    type: 'view',
    name: 'v_qk_tpopber_ohnejahr'
  },
  {
    type: 'view',
    name: 'v_qk_tpopber_ohneentwicklung',
    berichtjahr
  },

  // 4. Massnahmen

  // Massn ohne Jahr/Typ
  {
    type: 'view',
    name: 'v_qk_massn_ohnejahr'
  },
  {
    type: 'view',
    name: 'v_qk_massn_ohnebearb'
  },
  {
    type: 'view',
    name: 'v_qk_massn_ohnetyp',
    berichtjahr
  },
  // Massn.-Bericht ohne Jahr/Entwicklung
  {
    type: 'view',
    name: 'v_qk_massnber_ohnejahr'
  },
  {
    type: 'view',
    name: 'v_qk_massnber_ohneerfbeurt',
    berichtjahr
  },

  // 5. Kontrollen

  // Kontrolle ohne Jahr/Zählung/Kontrolltyp
  {
    type: 'view',
    name: 'v_qk_feldkontr_ohnejahr'
  },
  {
    type: 'view',
    name: 'v_qk_freiwkontr_ohnejahr'
  },
  {
    type: 'view',
    name: 'v_qk_feldkontr_ohnebearb'
  },
  {
    type: 'view',
    name: 'v_qk_freiwkontr_ohnebearb'
  },
  {
    type: 'view',
    name: 'v_qk_feldkontr_ohnezaehlung',
    berichtjahr
  },
  {
    type: 'view',
    name: 'v_qk_freiwkontr_ohnezaehlung',
    berichtjahr
  },
  {
    type: 'view',
    name: 'v_qk_feldkontr_ohnetyp',
    berichtjahr
  },
  // Zählung ohne Einheit/Methode/Anzahl
  {
    type: 'view',
    name: 'v_qk_feldkontrzaehlung_ohneeinheit',
    berichtjahr
  },
  {
    type: 'view',
    name: 'v_qk_freiwkontrzaehlung_ohneeinheit',
    berichtjahr
  },
  {
    type: 'view',
    name: 'v_qk_feldkontrzaehlung_ohnemethode',
    berichtjahr
  },
  {
    type: 'view',
    name: 'v_qk_freiwkontrzaehlung_ohnemethode',
    berichtjahr
  },
  {
    type: 'view',
    name: 'v_qk_feldkontrzaehlung_ohneanzahl',
    berichtjahr
  },
  {
    type: 'view',
    name: 'v_qk_freiwkontrzaehlung_ohneanzahl',
    berichtjahr
  },
]