// @flow
/*
 *
 * Daten
 *
 */

import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'

import Projekt from './Projekt'
import Ap from './Ap'
import Apberuebersicht from './Apberuebersicht'
import Erfkrit from './Erfkrit'
import Apber from './Apber'
import Pop from './Pop'
import Assozart from './Assozart'
import Beobart from './Beobart'
import Idealbiotop from './Idealbiotop'
import Ber from './Ber'
import Ziel from './Ziel'
import Zielber from './Zielber'
import Popmassnber from './Popmassnber'
import Popber from './Popber'
import Tpop from './Tpop'
import Tpopber from './Tpopber'
import Tpopmassn from './Tpopmassn'
import Tpopmassnber from './Tpopmassnber'
import Tpopfeldkontr from './Tpopfeldkontr'
import Tpopfreiwkontr from './Tpopfreiwkontr'
import Tpopkontrzaehl from './Tpopkontrzaehl'
import Exporte from '../Exporte'
import Qk from './Qk'
import Beobzuordnung from './Beobzuordnung'
import ErrorBoundary from '../../shared/ErrorBoundary'

const Container = styled.div`
  border-color: #424242;
  border-width: 1px;
  border-style: solid;
  height: 100%;
  @media print {
    display: none !important;
  }
`

const enhance = compose(inject('store'), observer)

const Daten = ({
  store,
  tree,
  dimensions,
}: {
  store: Object,
  tree: Object,
  dimensions: Object,
}) => {
  const { activeNodes, activeDataset } = tree
  if (!activeDataset || !activeDataset.table || !activeDataset.row) {
    return <div />
  }
  const formObject = {
    projekt: <Projekt tree={tree} dimensions={dimensions} />,
    apberuebersicht: <Apberuebersicht tree={tree} dimensions={dimensions} />,
    ap: <Ap tree={tree} dimensions={dimensions} />,
    assozart: <Assozart tree={tree} dimensions={dimensions} />,
    beobart: <Beobart tree={tree} dimensions={dimensions} />,
    idealbiotop: <Idealbiotop tree={tree} dimensions={dimensions} />,
    erfkrit: <Erfkrit tree={tree} dimensions={dimensions} />,
    apber: <Apber tree={tree} dimensions={dimensions} />,
    ber: <Ber tree={tree} dimensions={dimensions} />,
    ziel: <Ziel tree={tree} dimensions={dimensions} />,
    zielber: <Zielber tree={tree} dimensions={dimensions} />,
    pop: <Pop tree={tree} dimensions={dimensions} />,
    popmassnber: <Popmassnber tree={tree} dimensions={dimensions} />,
    popber: <Popber tree={tree} dimensions={dimensions} />,
    tpop: <Tpop tree={tree} dimensions={dimensions} />,
    tpopber: <Tpopber tree={tree} dimensions={dimensions} />,
    tpopmassn: <Tpopmassn tree={tree} dimensions={dimensions} />,
    tpopmassnber: <Tpopmassnber tree={tree} dimensions={dimensions} />,
    tpopfeldkontr: <Tpopfeldkontr tree={tree} dimensions={dimensions} />,
    tpopfreiwkontr: <Tpopfreiwkontr tree={tree} dimensions={dimensions} />,
    tpopkontrzaehl: <Tpopkontrzaehl tree={tree} dimensions={dimensions} />,
    exporte: <Exporte tree={tree} dimensions={dimensions} />,
    qk: <Qk tree={tree} />,
    beobNichtZuzuordnen: (
      <Beobzuordnung
        typ="beobNichtZuzuordnen"
        tree={tree}
        dimensions={dimensions}
      />
    ),
    beobzuordnung: (
      <Beobzuordnung typ="beobzuordnung" tree={tree} dimensions={dimensions} />
    ),
    tpopbeob: (
      <Beobzuordnung typ="tpopbeob" tree={tree} dimensions={dimensions} />
    ),
  }
  const standardForm = (
    <div>
      <p>Daten</p>
      <pre>{JSON.stringify(activeDataset.row, null, 2)}</pre>
    </div>
  )
  let key
  if (activeNodes.exporte) {
    key = 'exporte'
  } else if (activeNodes.qk) {
    key = 'qk'
  } else if (activeNodes.beobNichtZuzuordnen) {
    key = 'beobNichtZuzuordnen'
  } else if (activeNodes.beobzuordnung) {
    key = 'beobzuordnung'
  } else if (activeNodes.tpopbeob) {
    key = 'tpopbeob'
  } else {
    key = activeDataset.table
  }
  const form = formObject[key] || standardForm

  return (
    <ErrorBoundary>
      <Container>{form}</Container>
    </ErrorBoundary>
  )
}

export default enhance(Daten)
