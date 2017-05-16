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
import DeleteDatasetModal from './DeleteDatasetModal'

const Container = styled.div`
  border-color: #424242;
  border-width: 1px;
  border-style: solid;
  /*
  flex-basis: 600px;
  flex-grow: 4;
  flex-shrink: 1;*/
  height: 100%;
  @media print {
    display: none !important;
  }
`

const enhance = compose(inject('store'), observer)

const Daten = ({ store, tree }: { store: Object, tree: Object }) => {
  const { activeNodes, activeDataset } = tree
  if (!activeDataset || !activeDataset.table || !activeDataset.row) {
    return <div />
  }
  const formObject = {
    projekt: <Projekt tree={tree} />,
    apberuebersicht: <Apberuebersicht tree={tree} />,
    ap: <Ap tree={tree} />,
    assozart: <Assozart tree={tree} />,
    idealbiotop: <Idealbiotop tree={tree} />,
    erfkrit: <Erfkrit tree={tree} />,
    apber: <Apber tree={tree} />,
    ber: <Ber tree={tree} />,
    ziel: <Ziel tree={tree} />,
    zielber: <Zielber tree={tree} />,
    pop: <Pop tree={tree} />,
    popmassnber: <Popmassnber tree={tree} />,
    popber: <Popber tree={tree} />,
    tpop: <Tpop tree={tree} />,
    tpopber: <Tpopber tree={tree} />,
    tpopmassn: <Tpopmassn tree={tree} />,
    tpopmassnber: <Tpopmassnber tree={tree} />,
    tpopfeldkontr: <Tpopfeldkontr tree={tree} />,
    tpopfreiwkontr: <Tpopfreiwkontr tree={tree} />,
    tpopkontrzaehl: <Tpopkontrzaehl tree={tree} />,
    exporte: <Exporte tree={tree} />,
    qk: <Qk tree={tree} />,
    beobNichtZuzuordnen: (
      <Beobzuordnung typ="beobNichtZuzuordnen" tree={tree} />
    ),
    beobzuordnung: <Beobzuordnung typ="beobzuordnung" tree={tree} />,
    tpopbeob: <Beobzuordnung typ="tpopbeob" tree={tree} />,
  }
  const standardForm = (
    <div>
      <p>Daten</p>
      <pre>
        {JSON.stringify(activeDataset.row, null, 2)}
      </pre>
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
  const deleteDatasetModalIsVisible = !!store.datasetToDelete.id

  return (
    <Container>
      {form}
      {deleteDatasetModalIsVisible && <DeleteDatasetModal tree={tree} />}
    </Container>
  )
}

export default enhance(Daten)
