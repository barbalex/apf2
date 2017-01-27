/*
 *
 * Daten
 *
 */

import React, { PropTypes } from 'react'
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
import Exporte from './Exporte'
import Qk from './Qk'
import Beobzuordnung from './Beobzuordnung'

const Container = styled.div`
  border-color: #424242;
  border-width: 1px;
  border-style: solid;
  flex-basis: 600px;
  flex-grow: 4;
  flex-shrink: 1;
`

const enhance = compose(
  inject(`store`),
  observer
)

const Daten = ({
  store,
}) => {
  const { activeDataset, activeUrlElements } = store
  if (!activeDataset || !activeDataset.table || !activeDataset.row) {
    return <div />
  }
  const formObject = {
    projekt: <Projekt />,
    apberuebersicht: <Apberuebersicht />,
    ap: <Ap />,
    assozart: <Assozart />,
    idealbiotop: <Idealbiotop />,
    erfkrit: <Erfkrit />,
    apber: <Apber />,
    ber: <Ber />,
    ziel: <Ziel />,
    zielber: <Zielber />,
    pop: <Pop />,
    popmassnber: <Popmassnber />,
    popber: <Popber />,
    tpop: <Tpop />,
    tpopber: <Tpopber />,
    tpopmassn: <Tpopmassn />,
    tpopmassnber: <Tpopmassnber />,
    tpopfeldkontr: <Tpopfeldkontr />,
    tpopfreiwkontr: <Tpopfreiwkontr />,
    tpopkontrzaehl: <Tpopkontrzaehl />,
    exporte: <Exporte />,
    qk: <Qk />,
    beobNichtZuzuordnen: <Beobzuordnung typ="beobNichtZuzuordnen" />,
    beobzuordnung: <Beobzuordnung typ="beobzuordnung" />,
    tpopbeob: <Beobzuordnung typ="tpopbeob" />,
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
  if (activeUrlElements.exporte) {
    key = `exporte`
  } else if (activeUrlElements.qk) {
    key = `qk`
  } else if (activeUrlElements.beobNichtZuzuordnen) {
    key = `beobNichtZuzuordnen`
  } else if (activeUrlElements.beobzuordnung) {
    key = `beobzuordnung`
  } else if (activeUrlElements.tpopbeob) {
    key = `tpopbeob`
  } else {
    key = activeDataset.table
  }
  const form = formObject[key] || standardForm

  return (
    <Container>
      {form}
    </Container>
  )
}

Daten.propTypes = {
  store: PropTypes.object.isRequired,
}

export default enhance(Daten)
