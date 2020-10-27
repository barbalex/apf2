import React, { useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import getActiveForm from '../../../modules/getActiveForm'

/**
 * ReactDOMServer does not yet support Suspense
 */

//import Fallback from '../../shared/Fallback'
import storeContext from '../../../storeContext'
import Adresse from './Adresse'
import Ap from './Ap'
import Apart from './Apart'
import Apber from './Apber'
import Apberuebersicht from './Apberuebersicht'
import Assozart from './Assozart'
import Beobzuordnung from './Beobzuordnung'
import CurrentIssue from './CurrentIssue'
import Messages from './Messages'
import Ekzaehleinheit from './Ekzaehleinheit'
import Ekfrequenz from './Ekfrequenz'
import Erfkrit from './Erfkrit'
import Exporte from '../Exporte'
import Idealbiotop from './Idealbiotop'
import Pop from './Pop'
import Popber from './Popber'
import Popmassnber from './Popmassnber'
import Projekt from './Projekt'
import Qk from './Qk'
import Tpop from './Tpop'
import Tpopber from './Tpopber'
import Tpopfeldkontr from './Tpopfeldkontr'
import Tpopfreiwkontr from './Tpopfreiwkontr'
import Tpopkontrzaehl from './Tpopkontrzaehl'
import Tpopmassn from './Tpopmassn'
import Tpopmassnber from './Tpopmassnber'
import User from './User'
import Werte from './Werte'
import Ziel from './Ziel'
import Zielber from './Zielber'

const Container = styled.div`
  height: 100%;
  width: 100%;

  @media print {
    height: auto;
    border: none;
    overflow: hidden;
  }
`

const Daten = ({ treeName, nodes }) => {
  const store = useContext(storeContext)
  const activeForm = getActiveForm({ store, treeName, nodes })

  let form
  switch (activeForm.form) {
    case 'adresse': {
      form = <Adresse treeName={treeName} />
      break
    }
    case 'werte': {
      form = <Werte treeName={treeName} table={activeForm.type} />
      break
    }
    case 'ap': {
      form = <Ap treeName={treeName} />
      break
    }
    case 'apberuebersicht': {
      form = <Apberuebersicht treeName={treeName} />
      break
    }
    case 'apart': {
      form = <Apart treeName={treeName} />
      break
    }
    case 'apber': {
      form = <Apber treeName={treeName} />
      break
    }
    case 'assozart': {
      form = <Assozart treeName={treeName} />
      break
    }
    case 'beobzuordnung': {
      form = <Beobzuordnung treeName={treeName} type={activeForm.type} />
      break
    }
    case 'currentIssue': {
      form = <CurrentIssue treeName={treeName} />
      break
    }
    case 'message': {
      form = <Messages />
      break
    }
    case 'ekzaehleinheit': {
      form = <Ekzaehleinheit treeName={treeName} />
      break
    }
    case 'ekfrequenz': {
      form = <Ekfrequenz treeName={treeName} />
      break
    }
    case 'erfkrit': {
      form = <Erfkrit treeName={treeName} />
      break
    }
    case 'exporte': {
      form = <Exporte />
      break
    }
    case 'idealbiotop': {
      form = <Idealbiotop treeName={treeName} />
      break
    }
    case 'pop': {
      form = <Pop treeName={treeName} />
      break
    }
    case 'popber': {
      form = <Popber treeName={treeName} />
      break
    }
    case 'popmassnber': {
      form = <Popmassnber treeName={treeName} />
      break
    }
    case 'projekt': {
      form = <Projekt treeName={treeName} />
      break
    }
    case 'qk': {
      form = <Qk treeName={treeName} />
      break
    }
    case 'tpop': {
      form = <Tpop treeName={treeName} />
      break
    }
    case 'tpopber': {
      form = <Tpopber treeName={treeName} />
      break
    }
    case 'tpopfeldkontr': {
      form = <Tpopfeldkontr treeName={treeName} />
      break
    }
    case 'tpopfreiwkontr': {
      form = <Tpopfreiwkontr treeName={treeName} />
      break
    }
    case 'tpopkontrzaehl': {
      form = <Tpopkontrzaehl treeName={treeName} />
      break
    }
    case 'tpopmassn': {
      form = <Tpopmassn treeName={treeName} />
      break
    }
    case 'tpopmassnber': {
      form = <Tpopmassnber treeName={treeName} />
      break
    }
    case 'user': {
      form = <User treeName={treeName} />
      break
    }
    case 'ziel': {
      form = <Ziel treeName={treeName} />
      break
    }
    case 'zielber': {
      form = <Zielber treeName={treeName} />
      break
    }
    default:
      form = null
  }

  if (!form) return null

  /**
   * ReactDOMServer does not yet support Suspense
   */

  return (
    <Container data-id={`daten-container${treeName === 'tree' ? 1 : 2}`}>
      {form}
    </Container>
  )
}

export default observer(Daten)
