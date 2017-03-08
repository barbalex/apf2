// @flow
import React, { PropTypes } from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'

import appBaseUrl from '../../../modules/appBaseUrl'

const StyledH3 = styled.h3`
  margin: 7px 0;
`

const enhance = compose(
  inject(`store`),
  observer
)

const TpopPopup = (
  { store, pop, tpop }:
  {store:Object,pop:Object,tpop:Object}
) => {
  const { activeUrlElements } = store
  const { ap, projekt } = activeUrlElements
  const popUrl = `${appBaseUrl}/Projekte/${projekt}/Arten/${ap}/Populationen/${tpop.PopId}/Teil-Populationen/${tpop.TPopId}`

  return (
    <div>
      <div>Teil-Population</div>
      <StyledH3>
        {`${tpop.TPopNr ? `${tpop.TPopNr}: ` : ``}${tpop.TPopFlurname}`}
      </StyledH3>
      <div>
        {`Population: ${pop.PopNr ? `${pop.PopNr}: ` : ``}${pop.PopName}`}
      </div>
      <div>
        {`Koordinaten: ${tpop.TPopKoordWgs84 ? `${tpop.TPopXKoord.toLocaleString(`de-ch`)} / ${tpop.TPopYKoord.toLocaleString(`de-ch`)}` : `(keine)`}`}
      </div>
      <a
        href={popUrl}
        target="_blank"
      >
        Formular in neuem Tab öffnen
      </a>
    </div>
  )
}

TpopPopup.propTypes = {
  store: PropTypes.object.isRequired,
  pop: PropTypes.object.isRequired,
  tpop: PropTypes.object.isRequired,
}

export default enhance(TpopPopup)
