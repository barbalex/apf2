//@flow
/**
 * similar to AutocompleteFromArray
 * but receives an array of objects
 * with keys id and value
 * presents value and saves id
 */
import React from 'react'
import Autosuggest from 'react-autosuggest'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import TextField from 'material-ui-next/TextField'
import Paper from 'material-ui-next/Paper'
import { MenuItem } from 'material-ui-next/Menu'
import { withStyles } from 'material-ui-next/styles'
import styled from 'styled-components'
import compose from 'recompose/compose'
import trimStart from 'lodash/trimStart'

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
    background-color: rgba(0, 0, 0, 0.1);
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
    paddingBottom: '18px',
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
  tree: Object,
  label: String,
  fieldName: String,
  value: String,
  objects: Array<Object>,
  updatePropertyInDb: () => void,
  classes: Object,
  openabove: Boolean,
}

type State = {
  suggestions: Array<string>,
  value: string,
}

class IntegrationAutosuggest extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      suggestions: [],
      value: props.value || '',
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

  handleBlur = event => {
    const { value } = this.state
    const { objects, updatePropertyInDb, tree, fieldName } = this.props
    const object = objects.find(o => o.value === value)
    // check if value is in values
    if (object) {
      return updatePropertyInDb(tree, fieldName, object.id)
    }
    if (!value) return updatePropertyInDb(tree, fieldName, null)
    this.setState({ value: '' })
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
        onBlur={this.handleBlur}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
    )
  }

  render() {
    const { classes, openabove } = this.props
    const { suggestions } = this.state

    return (
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
        inputProps={{
          value: this.state.value,
          autoFocus: true,
          placeholder: 'Für Auswahlliste: Leerschlag tippen',
          onChange: this.handleChange,
          onBlur: this.handleBlur,
        }}
      />
    )
  }
}

export default enhance(IntegrationAutosuggest)
