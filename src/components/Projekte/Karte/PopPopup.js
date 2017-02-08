// @flow
import React, { PropTypes } from 'react'
import { observer } from 'mobx-react'
import FlatButton from 'material-ui/FlatButton'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

import appBaseUrl from '../../../modules/appBaseUrl'

const Container = styled.div`
  color: red;
`
const enhance = compose(
  withHandlers({
    onClickOpenForm: props => (e) => {
      e.preventDefault()

    },
  }),
  observer
)

const PopPopup = ({ store, pop }:{store:Object,pop:Object}) => {
  const { activeUrlElements } = store
  const { ap, projekt } = activeUrlElements
  const popUrl = `${appBaseUrl}/Projekte/${projekt}/Arten/${ap}/Populationen/${pop.PopId}`

  return (
    <Container>
      <div>Population</div>
      <h3>{`${pop.PopNr ? `${pop.PopNr}: ` : ``}${pop.PopName}`}</h3>
      <div>{`Koordinaten: ${pop.PopKoordWgs84 ? `${pop.PopXKoord.toLocaleString(`de-ch`)} / ${pop.PopYKoord.toLocaleString(`de-ch`)}` : `(keine)`}`}</div>
      <a
        href={popUrl}
        target="_blank"
      >
        Formular in neuem Tab öffnen
      </a>
    </Container>
  )
}

PopPopup.propTypes = {
  store: PropTypes.object.isRequired,
  pop: PropTypes.object.isRequired,
}

export default PopPopup
