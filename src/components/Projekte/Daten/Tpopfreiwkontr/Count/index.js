// @flow
import React from 'react'
import { Query, Mutation } from 'react-apollo'
import styled from 'styled-components'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/DeleteForever'
import AddIcon from '@material-ui/icons/AddCircleOutline'
import app from 'ampersand-app'
import { Subscribe } from 'unstated'

import Select from '../../../../shared/Select'
import TextField from '../../../../shared/TextField'
import updateTpopkontrzaehlByIdGql from './updateTpopkontrzaehlById.graphql'
import dataGql from './data.graphql'
import createTpopkontrzaehl from './createTpopkontrzaehl.graphql'
import DeleteState from '../../../../../state/Delete'

const Area = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 10px;
`
const Container = styled(Area)`
  grid-area: ${props => `count${props.nr}`};
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-areas: ${props =>
    props.showempty
      ? `'einheitLabel einheitLabel einheitLabel einheitLabel einheitLabel einheitLabel einheitLabel einheitLabel'
         'gezaehltLabel gezaehltLabel gezaehltLabel gezaehltLabel geschaetztLabel geschaetztLabel geschaetztLabel geschaetztLabel'
         'gezaehltVal gezaehltVal gezaehltVal gezaehltVal geschaetztVal geschaetztVal geschaetztVal geschaetztVal'`
      : props.shownew
        ? `'einheitLabel einheitLabel einheitLabel einheitLabel einheitLabel einheitLabel einheitLabel einheitLabel'
           'showNew showNew showNew showNew showNew showNew showNew showNew'`
        : props.showdelete
          ? `'einheitLabel einheitLabel einheitLabel einheitVal einheitVal einheitVal einheitVal einheitVal'
             'gezaehltLabel gezaehltLabel gezaehltLabel gezaehltLabel geschaetztLabel geschaetztLabel geschaetztLabel .'
             'gezaehltVal gezaehltVal gezaehltVal gezaehltVal geschaetztVal geschaetztVal geschaetztVal delete'`
          : `'einheitLabel einheitLabel einheitLabel einheitVal einheitVal einheitVal einheitVal einheitVal'
             'gezaehltLabel gezaehltLabel gezaehltLabel gezaehltLabel geschaetztLabel geschaetztLabel geschaetztLabel geschaetztLabel'
             'gezaehltVal gezaehltVal gezaehltVal gezaehltVal geschaetztVal geschaetztVal geschaetztVal geschaetztVal'`};
  grid-column-gap: 10px;
  break-inside: avoid;
  @media print {
    grid-template-areas: ${props =>
      props.showempty
        ? `'einheitLabel einheitLabel einheitLabel einheitLabel einheitLabel einheitLabel einheitLabel einheitLabel'
         'gezaehltLabel gezaehltLabel gezaehltLabel gezaehltLabel geschaetztLabel geschaetztLabel geschaetztLabel geschaetztLabel'
         'gezaehltVal gezaehltVal gezaehltVal gezaehltVal geschaetztVal geschaetztVal geschaetztVal geschaetztVal'`
        : props.shownew
          ? `'einheitLabel einheitLabel einheitLabel einheitLabel einheitLabel einheitLabel einheitLabel einheitLabel'
           'showNew showNew showNew showNew showNew showNew showNew showNew'`
          : props.showdelete
            ? `'einheitLabel einheitLabel einheitLabel einheitVal einheitVal einheitVal einheitVal einheitVal'
             'gezaehltLabel gezaehltLabel gezaehltLabel gezaehltLabel geschaetztLabel geschaetztLabel geschaetztLabel geschaetztLabel'
             'gezaehltVal gezaehltVal gezaehltVal gezaehltVal geschaetztVal geschaetztVal geschaetztVal geschaetztVal'`
            : `'einheitLabel einheitLabel einheitLabel einheitVal einheitVal einheitVal einheitVal einheitVal'
             'gezaehltLabel gezaehltLabel gezaehltLabel gezaehltLabel geschaetztLabel geschaetztLabel geschaetztLabel geschaetztLabel'
             'gezaehltVal gezaehltVal gezaehltVal gezaehltVal geschaetztVal geschaetztVal geschaetztVal geschaetztVal'`};
  }
`
const Label = styled.div`
  font-weight: 700;
`
const EinheitLabel = styled(Label)`
  grid-area: einheitLabel;
  hyphens: auto;
  margin-top: 5px;
`
const EinheitVal = styled.div`
  grid-area: einheitVal;
  > div {
    margin-top: -5px;
    padding-bottom: 0;
  }
  @media print {
    input {
      font-size: 11px;
    }
  }
`
const GezaehltLabel = styled.div`
  grid-area: gezaehltLabel;
  justify-self: center;
  align-self: end;
  padding-top: 8px;
`
const GezaehltVal = styled.div`
  grid-area: gezaehltVal;
  > div {
    margin-top: -15px;
    padding-bottom: 0 !important;
  }
  > div > div > input {
    text-align: center;
  }
`
const GeschaetztLabel = styled.div`
  grid-area: geschaetztLabel;
  justify-self: center;
  align-self: end;
  padding-top: 8px;
`
const GeschaetztVal = styled.div`
  grid-area: geschaetztVal;
  > div {
    margin-top: -15px;
    padding-bottom: 0 !important;
  }
  > div > div > input {
    text-align: center;
  }
`
const Delete = styled.div`
  grid-area: delete;
  justify-self: end;
  align-self: end;
  @media print {
    grid-area: geschaetztVal;
    button {
      display: none;
    }
  }
`
const StyledDeleteButton = styled(Button)`
  padding-left: 0 !important;
  padding-right: 0 !important;
  min-width: 40px !important;
`
const StyledAddIcon = styled(AddIcon)`
  padding-right: 8px;
`
const ShowNew = styled.div`
  grid-area: showNew;
  @media print {
    button {
      display: none;
    }
  }
`

const enhance = compose(
  withState('errors', 'setErrors', {}),
  withHandlers({
    saveToDb: ({ setErrors, errors }) => async ({
      row,
      field,
      field2,
      value,
      value2,
      updateTpopkontrzaehl,
    }) => {
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      // catch case when empty anzahl field blurs
      if (value === null && field2 && row[field2] !== value2) return
      try {
        const variables = {
          id: row.id,
          [field]: value,
        }
        if (field2) {
          variables[field2] = value2
        }
        await updateTpopkontrzaehl({
          variables,
          optimisticResponse: {
            __typename: 'Mutation',
            updateTpopkontrzaehlById: {
              tpopkontrzaehl: {
                id: row.id,
                anzahl: field === 'anzahl' ? value : row.anzahl,
                einheit: field === 'einheit' ? value : row.einheit,
                methode: field2 === 'methode' ? value2 : row.methode,
                tpopkontrzaehlEinheitWerteByEinheit:
                  row.tpopkontrzaehlEinheitWerteByEinheit,
                __typename: 'Tpopkontrzaehl',
              },
              __typename: 'Tpopkontrzaehl',
            },
          },
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
    },
    createNew: ({ tpopkontrId, refetch }) => () => {
      app.client
        .mutate({
          mutation: createTpopkontrzaehl,
          variables: { tpopkontrId },
        })
        .then(() => refetch())
    },
    remove: ({ id, refetch, activeNodeArray }) => ({ deleteState, row }) => {
      deleteState.setToDelete({
        table: 'tpopkontrzaehl',
        id,
        label: null,
        url: activeNodeArray,
        afterDeletionHook: refetch,
      })
    },
  }),
  withLifecycle({
    onDidUpdate(prevProps, props) {
      if (prevProps.id !== props.id) {
        props.setErrors({})
      }
    },
  }),
)

const Count = ({
  id,
  tpopkontrId,
  nr,
  saveToDb,
  errors,
  updateTpopkontr,
  showEmpty,
  showNew,
  refetch,
  createNew,
  remove,
  activeNodeArray,
  einheitsUsed,
  ekfzaehleinheits,
}: {
  id: String,
  tpopkontrId: String,
  nr: Number,
  saveToDb: () => void,
  errors: Object,
  updateTpopkontr: () => void,
  showEmpty: Boolean,
  showNew: Boolean,
  refetch: () => void,
  createNew: () => void,
  remove: () => void,
  activeNodeArray: Array<String>,
  einheitsUsed: Array<Number>,
  ekfzaehleinheits: Array<Object>,
}) => {
  if (showNew)
    return (
      <Container nr={nr} shownew={showNew}>
        <EinheitLabel>{`Zähleinheit ${nr}`}</EinheitLabel>
        <ShowNew>
          <Button color="primary" onClick={createNew}>
            <StyledAddIcon /> Neu
          </Button>
        </ShowNew>
      </Container>
    )
  if (showEmpty)
    return (
      <Container nr={nr} showempty={showEmpty}>
        <EinheitLabel>{`Zähleinheit ${nr}`}</EinheitLabel>
      </Container>
    )
  return (
    <Query query={dataGql} variables={{ id }}>
      {({ loading, error, data }) => {
        if (loading) return <Container>Lade...</Container>
        if (error) return `Fehler: ${error.message}`

        const row = get(data, 'tpopkontrzaehlById')
        // do list this count's einheit
        const einheitsNotToList = einheitsUsed.filter(e => e !== row.einheit)
        let zaehleinheitWerte = ekfzaehleinheits
          // remove already set values
          .filter(e => !einheitsNotToList.includes(e.code))
        zaehleinheitWerte = sortBy(zaehleinheitWerte, 'sort').map(el => ({
          value: el.code,
          label: el.text,
        }))
        const showDelete = nr > 1

        return (
          <Mutation mutation={updateTpopkontrzaehlByIdGql}>
            {updateTpopkontrzaehl => (
              <Container nr={nr} showdelete={showDelete}>
                <EinheitLabel>{`Zähleinheit ${nr}`}</EinheitLabel>
                <EinheitVal>
                  <Select
                    key={`${row.id}einheit`}
                    value={row.einheit}
                    field="einheit"
                    options={zaehleinheitWerte}
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'einheit',
                        value,
                        updateTpopkontrzaehl,
                      })
                    }
                    error={errors.einheit}
                  />
                </EinheitVal>
                <GezaehltLabel>gezählt</GezaehltLabel>
                <GeschaetztLabel>geschätzt</GeschaetztLabel>
                <GezaehltVal>
                  <TextField
                    key={`${row.id}anzahl`}
                    value={row.methode === 2 ? row.anzahl : null}
                    type="number"
                    saveToDb={value => {
                      // convert to number
                      const valueNr = !value && value !== 0 ? null : +value
                      saveToDb({
                        row,
                        field: 'anzahl',
                        value: valueNr,
                        field2: 'methode',
                        value2: 2,
                        updateTpopkontrzaehl,
                      })
                    }}
                    error={errors.anzahl}
                  />
                </GezaehltVal>
                <GeschaetztVal>
                  <TextField
                    key={`${row.id}anzahl`}
                    value={row.methode === 1 ? row.anzahl : null}
                    type="number"
                    saveToDb={value => {
                      // convert to number
                      const valueNr = !value && value !== 0 ? null : +value
                      saveToDb({
                        row,
                        field: 'anzahl',
                        value: valueNr,
                        field2: 'methode',
                        value2: 1,
                        updateTpopkontrzaehl,
                      })
                    }}
                    error={errors.anzahl}
                  />
                </GeschaetztVal>
                {showDelete && (
                  <Subscribe to={[DeleteState]}>
                    {deleteState => (
                      <Delete>
                        <StyledDeleteButton
                          title="löschen"
                          onClick={() => remove({ deleteState, row })}
                        >
                          <DeleteIcon />
                        </StyledDeleteButton>
                      </Delete>
                    )}
                  </Subscribe>
                )}
              </Container>
            )}
          </Mutation>
        )
      }}
    </Query>
  )
}

export default enhance(Count)
