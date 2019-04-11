// @flow
import React, { useContext, useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import uniqBy from 'lodash/uniqBy'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/DeleteForever'
import AddIcon from '@material-ui/icons/AddCircleOutline'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'

import Select from '../../../../shared/Select'
import TextField from '../../../../shared/TextField'
import updateTpopkontrzaehlByIdGql from './updateTpopkontrzaehlById'
import query from './query'
import queryLists from './queryLists'
import createTpopkontrzaehl from './createTpopkontrzaehl'
import storeContext from '../../../../../storeContext'
import ifIsNumericAsNumber from '../../../../../modules/ifIsNumericAsNumber'

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
    @media print {
      margin-bottom: 0;
    }
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
    @media print {
      padding-top: 3px;
      padding-bottom: 2px;
      font-size: 11px;
    }
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
    @media print {
      padding-top: 3px;
      padding-bottom: 2px;
      font-size: 11px;
    }
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

const Count = ({
  id = '99999999-9999-9999-9999-999999999999',
  tpopkontrId,
  nr,
  updateTpopkontr,
  showEmpty,
  showNew,
  refetch,
  einheitsUsed = [],
  ekfzaehleinheits = [],
  treeName,
}: {
  id: String,
  tpopkontrId: String,
  nr: Number,
  updateTpopkontr: () => void,
  showEmpty: Boolean,
  showNew: Boolean,
  refetch: () => void,
  einheitsUsed: Array<Number>,
  ekfzaehleinheits: Array<Object>,
  treeName: string,
}) => {
  const mobxStore = useContext(storeContext)
  const client = useApolloClient()
  const { setToDelete } = useContext(storeContext)

  const [errors, setErrors] = useState({})
  const { activeNodeArray } = mobxStore[treeName]

  const { data, loading, error } = useQuery(query, {
    variables: {
      id,
    },
  })

  const { data: dataLists, error: errorLists } = useQuery(queryLists)

  const row = get(data, 'tpopkontrzaehlById', {})

  useEffect(() => setErrors({}), [row])

  const createNew = useCallback(() => {
    client
      .mutate({
        mutation: createTpopkontrzaehl,
        variables: { tpopkontrId },
      })
      .then(() => refetch())
  }, [tpopkontrId])

  const allEinheits = get(dataLists, 'allTpopkontrzaehlEinheitWertes.nodes', [])
  // do list this count's einheit
  const einheitsNotToList = einheitsUsed.filter(e => e !== row.einheit)
  let zaehleinheitWerte = ekfzaehleinheits
    // remove already set values
    .filter(e => !einheitsNotToList.includes(e.code))
  // add this zaehleineits value if missing
  // so as to show values input in earlier years that shall not be input any more
  const thisRowsEinheit = allEinheits.find(e => e.code === row.einheit)
  if (thisRowsEinheit) {
    zaehleinheitWerte = uniqBy([thisRowsEinheit, ...zaehleinheitWerte], 'id')
  }
  zaehleinheitWerte = sortBy(zaehleinheitWerte, 'sort').map(el => ({
    value: el.code,
    label: el.text,
  }))
  const showDelete = nr > 1

  const saveToDb = useCallback(
    async event => {
      const fieldPassed = event.target.name
      const field = ['anzahl1', 'anzahl2'].includes(fieldPassed)
        ? 'anzahl'
        : fieldPassed
      const value = ifIsNumericAsNumber(event.target.value)

      let field2
      if (['anzahl1', 'anzahl2'].includes(fieldPassed)) {
        field2 = 'methode'
      }
      let value2
      if (fieldPassed === 'anzahl1') value2 = 1
      if (fieldPassed === 'anzahl2') value2 = 2

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
        await client.mutate({
          mutation: updateTpopkontrzaehlByIdGql,
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
    [row],
  )
  const remove = useCallback(
    ({ row }) => {
      setToDelete({
        table: 'tpopkontrzaehl',
        id: row.id,
        label: null,
        url: activeNodeArray,
        afterDeletionHook: refetch,
      })
    },
    [row, activeNodeArray],
  )

  if (showNew) {
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
  }
  if (showEmpty) {
    return (
      <Container nr={nr} showempty={showEmpty}>
        <EinheitLabel>{`Zähleinheit ${nr}`}</EinheitLabel>
      </Container>
    )
  }
  if (loading) {
    return <Container>Lade...</Container>
  }
  if (error) return `Fehler: ${error.message}`
  if (errorLists) {
    return `Fehler: ${errorLists.message}`
  }
  return (
    <Container nr={nr} showdelete={showDelete} data-id={`count${nr}`}>
      <EinheitLabel>{`Zähleinheit ${nr}`}</EinheitLabel>
      <EinheitVal>
        <Select
          key={`${row.id}einheit`}
          name="einheit"
          value={row.einheit}
          field="einheit"
          options={zaehleinheitWerte}
          saveToDb={saveToDb}
          error={errors.einheit}
          noCaret
        />
      </EinheitVal>
      <GezaehltLabel>gezählt</GezaehltLabel>
      <GeschaetztLabel>geschätzt</GeschaetztLabel>
      <GezaehltVal>
        <TextField
          key={`${row.id}anzahl`}
          name="anzahl2"
          value={row.methode === 2 ? row.anzahl : null}
          type="number"
          saveToDb={saveToDb}
          error={errors.anzahl}
        />
      </GezaehltVal>
      <GeschaetztVal>
        <TextField
          key={`${row.id}anzahl`}
          name="anzahl1"
          value={row.methode === 1 ? row.anzahl : null}
          type="number"
          saveToDb={saveToDb}
          error={errors.anzahl}
        />
      </GeschaetztVal>
      {showDelete && (
        <Delete>
          <StyledDeleteButton title="löschen" onClick={() => remove({ row })}>
            <DeleteIcon />
          </StyledDeleteButton>
        </Delete>
      )}
    </Container>
  )
}

export default observer(Count)
