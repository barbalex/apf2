import React, { useContext, useCallback } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import uniqBy from 'lodash/uniqBy'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/DeleteForever'
import AddIcon from '@material-ui/icons/AddCircleOutline'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/react-hooks'

import Einheit from './Einheit'
import Gezaehlt from './Gezaehlt'
import Geschaetzt from './Geschaetzt'
import query from './query'
import queryLists from './queryLists'
import createTpopkontrzaehl from './createTpopkontrzaehl'
import storeContext from '../../../../../storeContext'

const Container = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 10px;
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
        : `'einheitLabel einheitLabel einheitLabel einheitVal einheitVal einheitVal einheitVal einheitVal'
           'gezaehltLabel gezaehltLabel gezaehltLabel gezaehltLabel geschaetztLabel geschaetztLabel geschaetztLabel geschaetztLabel'
           'gezaehltVal gezaehltVal gezaehltVal gezaehltVal geschaetztVal geschaetztVal geschaetztVal geschaetztVal'`};
  }
`
const StyledForm = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 0;
  grid-area: ${props => `count${props.nr}`};
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-areas: ${props =>
    props.showdelete === 'true'
      ? `'einheitLabel einheitLabel einheitLabel einheitVal einheitVal einheitVal einheitVal einheitVal'
             'gezaehltLabel gezaehltLabel gezaehltLabel gezaehltLabel geschaetztLabel geschaetztLabel geschaetztLabel .'
             'gezaehltVal gezaehltVal gezaehltVal gezaehltVal geschaetztVal geschaetztVal geschaetztVal delete'`
      : `'einheitLabel einheitLabel einheitLabel einheitVal einheitVal einheitVal einheitVal einheitVal'
             'gezaehltLabel gezaehltLabel gezaehltLabel gezaehltLabel geschaetztLabel geschaetztLabel geschaetztLabel geschaetztLabel'
             'gezaehltVal gezaehltVal gezaehltVal gezaehltVal geschaetztVal geschaetztVal geschaetztVal geschaetztVal'`};
  grid-column-gap: 10px;
  break-inside: avoid;
  @media print {
    grid-template-areas:
      'einheitLabel einheitLabel einheitLabel einheitVal einheitVal einheitVal einheitVal einheitVal'
      'gezaehltLabel gezaehltLabel gezaehltLabel gezaehltLabel geschaetztLabel geschaetztLabel geschaetztLabel geschaetztLabel'
      'gezaehltVal gezaehltVal gezaehltVal gezaehltVal geschaetztVal geschaetztVal geschaetztVal geschaetztVal';
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
  id,
  tpopkontrId,
  nr,
  showEmpty,
  showNew,
  refetch,
  einheitsUsed = [],
  ekzaehleinheits = [],
  treeName,
}) => {
  const store = useContext(storeContext)
  const client = useApolloClient()
  const { setToDelete } = useContext(storeContext)

  const { activeNodeArray } = store[treeName]

  const { data, loading, error, refetch: refetchMe } = useQuery(query, {
    variables: {
      id: id || '99999999-9999-9999-9999-999999999999',
    },
  })

  const { data: dataLists, error: errorLists } = useQuery(queryLists)

  const row = get(data, 'tpopkontrzaehlById', {}) || {}

  const createNew = useCallback(() => {
    client
      .mutate({
        mutation: createTpopkontrzaehl,
        variables: { tpopkontrId },
      })
      .then(() => refetch())
  }, [client, refetch, tpopkontrId])

  const allEinheits = get(dataLists, 'allTpopkontrzaehlEinheitWertes.nodes', [])
  // do list this count's einheit
  const einheitsNotToList = einheitsUsed.filter(e => e !== row.einheit)
  console.log('Count', { ekzaehleinheits, einheitsNotToList, allEinheits })
  let zaehleinheitWerte = ekzaehleinheits
    //.map(e => e.tpopkontrzaehlEinheitWerteByZaehleinheitId)
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

  const remove = useCallback(
    ({ row }) => {
      const afterDeletionHook = () => {
        refetch()
        store.refetch.tpopkontrzaehls()
      }
      setToDelete({
        table: 'tpopkontrzaehl',
        id: row.id,
        label: null,
        url: activeNodeArray,
        afterDeletionHook,
      })
    },
    [setToDelete, activeNodeArray, refetch, store.refetch],
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
  console.log('Count, row:', { row, zaehleinheitWerte })
  return (
    <StyledForm nr={nr} data-id={`count${nr}`}>
      <Einheit
        row={row}
        refetch={refetch}
        zaehleinheitWerte={zaehleinheitWerte}
        nr={nr}
      />
      <GezaehltLabel>gezählt</GezaehltLabel>
      <GeschaetztLabel>geschätzt</GeschaetztLabel>
      <GezaehltVal>
        <Gezaehlt row={row} refetch={refetchMe} />
      </GezaehltVal>
      <GeschaetztVal>
        <Geschaetzt row={row} refetch={refetchMe} />
      </GeschaetztVal>
      {showDelete && (
        <Delete>
          <StyledDeleteButton title="löschen" onClick={() => remove({ row })}>
            <DeleteIcon />
          </StyledDeleteButton>
        </Delete>
      )}
    </StyledForm>
  )
}

export default observer(Count)
