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
import Loadable from 'react-loadable'

import ErrorBoundary from '../../shared/ErrorBoundarySingleChild'
import Loading from '../../shared/Loading'

const Projekt = Loadable({
  loader: () => import('./Projekt'),
  loading: Loading,
})
const Ap = Loadable({
  loader: () => import('./Ap'),
  loading: Loading,
})
const Apberuebersicht = Loadable({
  loader: () => import('./Apberuebersicht'),
  loading: Loading,
})
const Erfkrit = Loadable({
  loader: () => import('./Erfkrit'),
  loading: Loading,
})
const Apber = Loadable({
  loader: () => import('./Apber'),
  loading: Loading,
})
const Pop = Loadable({
  loader: () => import('./Pop'),
  loading: Loading,
})
const Assozart = Loadable({
  loader: () => import('./Assozart'),
  loading: Loading,
})
const Apart = Loadable({
  loader: () => import('./Apart'),
  loading: Loading,
})
const Idealbiotop = Loadable({
  loader: () => import('./Idealbiotop'),
  loading: Loading,
})
const Ber = Loadable({
  loader: () => import('./Ber'),
  loading: Loading,
})
const Ziel = Loadable({
  loader: () => import('./Ziel'),
  loading: Loading,
})
const Zielber = Loadable({
  loader: () => import('./Zielber'),
  loading: Loading,
})
const Popmassnber = Loadable({
  loader: () => import('./Popmassnber'),
  loading: Loading,
})
const Popber = Loadable({
  loader: () => import('./Popber'),
  loading: Loading,
})
const Tpop = Loadable({
  loader: () => import('./Tpop'),
  loading: Loading,
})
const Tpopber = Loadable({
  loader: () => import('./Tpopber'),
  loading: Loading,
})
const Tpopmassn = Loadable({
  loader: () => import('./Tpopmassn'),
  loading: Loading,
})
const Tpopmassnber = Loadable({
  loader: () => import('./Tpopmassnber'),
  loading: Loading,
})
const Tpopfeldkontr = Loadable({
  loader: () => import('./Tpopfeldkontr'),
  loading: Loading,
})
const Tpopfreiwkontr = Loadable({
  loader: () => import('./Tpopfreiwkontr'),
  loading: Loading,
})
const Tpopkontrzaehl = Loadable({
  loader: () => import('./Tpopkontrzaehl'),
  loading: Loading,
})
const Exporte = Loadable({
  loader: () => import('../Exporte'),
  loading: Loading,
})
const Qk = Loadable({
  loader: () => import('./Qk'),
  loading: Loading,
})
const Beobzuordnung = Loadable({
  loader: () => import('./Beobzuordnung'),
  loading: Loading,
})

const Container = styled.div`
  border-left-color: rgb(46, 125, 50);
  border-left-width: 1px;
  border-left-style: solid;
  border-right-color: rgb(46, 125, 50);
  border-right-width: 1px;
  border-right-style: solid;
  height: 100%;
  @media print {
    display: none !important;
  }
`

const enhance = compose(inject('store'), observer)

const Daten = ({
  store,
  tree,
  dimensions = { width: 380 },
}: {
  store: Object,
  tree: Object,
  dimensions: Object,
}) => {
  const { activeNodes, activeDataset } = tree
  if (!activeDataset || !activeDataset.table || !activeDataset.row) {
    return <div />
  }
  /**
   * For the time-being bass id from here
   * When store is moved to apollo:
   * Fetch id directly in components
   */
  const { id } = activeDataset.row
  const formObject = {
    projekt: <Projekt tree={tree} dimensions={dimensions} />,
    apberuebersicht: <Apberuebersicht tree={tree} dimensions={dimensions} />,
    ap: <Ap id={id} dimensions={dimensions} />,
    assozart: <Assozart tree={tree} dimensions={dimensions} />,
    apart: <Apart id={id} tree={tree} dimensions={dimensions} />,
    idealbiotop: <Idealbiotop tree={tree} dimensions={dimensions} />,
    erfkrit: <Erfkrit tree={tree} dimensions={dimensions} />,
    apber: <Apber tree={tree} dimensions={dimensions} />,
    ber: <Ber tree={tree} dimensions={dimensions} />,
    ziel: <Ziel tree={tree} dimensions={dimensions} />,
    zielber: <Zielber tree={tree} dimensions={dimensions} />,
    pop: <Pop id={id} dimensions={dimensions} />,
    popmassnber: <Popmassnber id={id} dimensions={dimensions} />,
    popber: <Popber id={id} dimensions={dimensions} />,
    tpop: <Tpop id={id} dimensions={dimensions} />,
    tpopber: <Tpopber id={id} dimensions={dimensions} />,
    tpopmassn: <Tpopmassn id={id} dimensions={dimensions} />,
    tpopmassnber: <Tpopmassnber id={id} dimensions={dimensions} />,
    tpopfeldkontr: <Tpopfeldkontr id={id} dimensions={dimensions} />,
    tpopfreiwkontr: <Tpopfreiwkontr id={id} dimensions={dimensions} />,
    tpopkontrzaehl: <Tpopkontrzaehl id={id} dimensions={dimensions} />,
    exporte: <Exporte tree={tree} dimensions={dimensions} />,
    qk: <Qk tree={tree} />,
    beobNichtZuzuordnen: <Beobzuordnung tree={tree} dimensions={dimensions} />,
    beobzuordnung: <Beobzuordnung tree={tree} dimensions={dimensions} />,
    beobZugeordnet: <Beobzuordnung tree={tree} dimensions={dimensions} />,
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
  } else if (activeNodes.beobZugeordnet) {
    key = 'beobZugeordnet'
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
