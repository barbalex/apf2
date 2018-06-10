//@flow
/**
 * similar to AutocompleteFromArray
 * but receives an array of objects
 * with keys id and value
 * presents value and saves id
 */
import React, {Fragment} from 'react'
import Autosuggest from 'react-autosuggest'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import { withStyles } from '@material-ui/core/styles'
import styled from 'styled-components'
import compose from 'recompose/compose'
import trimStart from 'lodash/trimStart'
import { ApolloConsumer } from 'react-apollo'
import gql from "graphql-tag"
import get from 'lodash/get'
import { Subscribe } from 'unstated'

import exportModule from '../../../modules/export'
import Message from './Message'
import ErrorState from '../../../state/Error'

const StyledPaper = styled(Paper)`
  z-index: 1;
  /* need this so text is visible when overflowing */
  > ul > li > div {
    overflow: inherit;
  }
`
const StyledAutosuggest = styled(Autosuggest)`
  height: auto;
  .react-autosuggest__suggestions-container--open {
    bottom: ${props => (props.openabove ? '27px !important' : 'unset')};
  }
  .react-autosuggest__suggestions-container {
    bottom: 27px !important;
  }
`
const StyledTextField = styled(TextField)`
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  width: 100%;
  > div:before {
    border-bottom-color: rgba(0, 0, 0, 0.1);
  }
`

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion, query)
  const parts = parse(suggestion, matches)

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </strong>
          )
        })}
      </div>
    </MenuItem>
  )
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options

  return (
    <StyledPaper {...containerProps} square>
      {children}
    </StyledPaper>
  )
}

function getSuggestionValue(suggestion) {
  return suggestion
}

function shouldRenderSuggestions(value) {
  return true
}

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
    paddingTop: '12px',
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    maxHeight: '400px',
    overflow: 'auto',
  },
})

const enhance = compose(withStyles(styles))

type Props = {
  label: String,
  value: String,
  objects: Array<Object>,
  classes: Object,
  mapFilter: Object,
}

type State = {
  suggestions: Array<string>,
  value: string,
  message: String,
}

class IntegrationAutosuggest extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      suggestions: [],
      value: props.value || '',
      message: null
    }
  }

  getSuggestions = value => {
    const { objects } = this.props
    const inputValue = value.toLowerCase()
    const values = objects.map(o => o.value)

    if (value === ' ') return values
    if (inputValue.length === 0) return []
    return values.filter(v => v.toLowerCase().includes(inputValue))
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value),
    })
  }

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: this.getSuggestions(' '),
    })
  }

  handleChange = (event, { newValue }) => {
    // trim the start to enable entering space
    // at start to open list
    const value = trimStart(newValue)
    this.setState({ value })
  }

  renderInput = inputProps => {
    const { label, value } = this.props
    const { autoFocus, ref, ...other } = inputProps

    return (
      <StyledTextField
        label={label}
        fullWidth
        value={value || ''}
        inputRef={ref}
        InputProps={{
          ...other,
        }}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
    )
  }

  render() {
    const { classes, openabove, objects, mapFilter } = this.props
    const { suggestions } = this.state

    return (
      <Subscribe to={[ErrorState]}>
        {errorState =>
          <ApolloConsumer>
            {client =>
              <Fragment>
                <StyledAutosuggest
                  theme={{
                    container: classes.container,
                    suggestionsContainerOpen: {
                      position: 'absolute',
                      marginTop: '8px',
                      marginBottom: '24px',
                      left: 0,
                      right: 0,
                      bottom: openabove ? '27px' : 'unset',
                    },
                    suggestionsList: classes.suggestionsList,
                    suggestion: classes.suggestion,
                  }}
                  renderInputComponent={this.renderInput}
                  suggestions={suggestions}
                  onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                  onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                  renderSuggestionsContainer={renderSuggestionsContainer}
                  getSuggestionValue={getSuggestionValue}
                  renderSuggestion={renderSuggestion}
                  shouldRenderSuggestions={shouldRenderSuggestions}
                  onSuggestionSelected={async (event, { suggestion }) => {
                    this.setState({ message: 'Export "anzkontrinklletzterundletztertpopber" wird vorbereitet...'})
                    try {
                      const { data } = await client.query({
                        query: gql`
                          query view($apId: UUID!) {
                            allVTpopAnzkontrinklletzterundletztertpopbers(filter: { apId: { equalTo: $apId } }) {
                              nodes {
                                ap_id: apId
                                familie
                                artname
                                ap_bearbeitung: apBearbeitung
                                ap_start_jahr: apStartJahr
                                ap_umsetzung: apUmsetzung
                                pop_id: popId
                                pop_nr: popNr
                                pop_name: popName
                                pop_status: popStatus
                                pop_bekannt_seit: popBekanntSeit
                                pop_status_unklar: popStatusUnklar
                                pop_status_unklar_begruendung: popStatusUnklarBegruendung
                                pop_x: popX
                                pop_y: popY
                                id
                                nr
                                gemeinde
                                flurname
                                status
                                bekannt_seit: bekanntSeit
                                status_unklar: statusUnklar
                                status_unklar_grund: statusUnklarGrund
                                x
                                y
                                radius
                                hoehe
                                exposition
                                klima
                                neigung
                                beschreibung
                                kataster_nr: katasterNr
                                apber_relevant: apberRelevant
                                eigentuemer
                                kontakt
                                nutzungszone
                                bewirtschafter
                                bewirtschaftung
                                changed
                                changed_by: changedBy
                                kontr_id: kontrId
                                kontr_jahr: kontrJahr
                                kontr_datum: kontrDatum
                                kontr_typ: kontrTyp
                                kontr_bearbeiter: kontrBearbeiter
                                kontr_ueberlebensrate: kontrUeberlebensrate
                                kontr_vitalitaet: kontrVitalitaet
                                kontr_entwicklung: kontrEntwicklung
                                kontr_ursachen: kontrUrsachen
                                kontr_erfolgsbeurteilung: kontrErfolgsbeurteilung
                                kontr_umsetzung_aendern: kontrUmsetzungAendern
                                kontr_kontrolle_aendern: kontrKontrolleAendern
                                kontr_bemerkungen: kontrBemerkungen
                                kontr_lr_delarze: kontrLrDelarze
                                kontr_lr_umgebung_delarze: kontrLrUmgebungDelarze
                                kontr_vegetationstyp: kontrVegetationstyp
                                kontr_konkurrenz: kontrKonkurrenz
                                kontr_moosschicht: kontrMoosschicht
                                kontr_krautschicht: kontrKrautschicht
                                kontr_strauchschicht: kontrStrauchschicht
                                kontr_baumschicht: kontrBaumschicht
                                kontr_boden_typ: kontrBodenTyp
                                kontr_boden_kalkgehalt: kontrBodenKalkgehalt
                                kontr_boden_durchlaessigkeit: kontrBodenDurchlaessigkeit
                                kontr_boden_humus: kontrBodenHumus
                                kontr_boden_naehrstoffgehalt: kontrBodenNaehrstoffgehalt
                                kontr_boden_abtrag: kontrBodenAbtrag
                                kontr_wasserhaushalt: kontrWasserhaushalt
                                kontr_idealbiotop_uebereinstimmung: kontrIdealbiotopUebereinstimmung
                                kontr_handlungsbedarf: kontrHandlungsbedarf
                                kontr_flaeche_ueberprueft: kontrFlaecheUeberprueft
                                kontr_flaeche: kontrFlaeche
                                kontr_plan_vorhanden: kontrPlanVorhanden
                                kontr_deckung_vegetation: kontrDeckungVegetation
                                kontr_deckung_nackter_boden: kontrDeckungNackterBoden
                                kontr_deckung_ap_art: kontrDeckungApArt
                                kontr_jungpflanzen_vorhanden: kontrJungpflanzenVorhanden
                                kontr_vegetationshoehe_maximum: kontrVegetationshoeheMaximum
                                kontr_vegetationshoehe_mittel: kontrVegetationshoeheMittel
                                kontr_gefaehrdung: kontrGefaehrdung
                                kontr_changed: kontrChanged
                                kontr_changed_by: kontrChangedBy
                                tpopber_anz: tpopberAnz
                                tpopber_id: tpopberId
                                tpopber_jahr: tpopberJahr
                                tpopber_entwicklung: tpopberEntwicklung
                                tpopber_bemerkungen: tpopberBemerkungen
                                tpopber_changed: tpopberChanged
                                tpopber_changed_by: tpopberChangedBy
                              }
                            }
                          }`,
                          variables: { apId: objects.find(o => o.value === suggestion).id }
                      })
                      exportModule({
                        data: get(data, 'allVTpopAnzkontrinklletzterundletztertpopbers.nodes', []),
                        fileName: 'anzkontrinklletzterundletztertpopber',
                        mapFilter,
                        errorState,
                      })
                    } catch(error) {
                      errorState.add(error)
                    }
                    this.setState({ message: null})
                    setTimeout(() => {
                      this.setState({ value: '', suggestions: [] })
                    }, 5000)
                  }}
                  inputProps={{
                    value: this.state.value,
                    autoFocus: true,
                    placeholder: 'Für Auswahlliste: Leerschlag tippen',
                    onChange: this.handleChange,
                  }}
                />
                {
                  !!this.state.message &&
                  <Message message={this.state.message} />
                }
              </Fragment>
            }
          </ApolloConsumer>
        }
      </Subscribe>
    )
  }
}

export default enhance(IntegrationAutosuggest)
