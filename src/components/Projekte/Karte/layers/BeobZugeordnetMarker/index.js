import React from 'react'
import { inject } from 'mobx-react'
import compose from 'recompose/compose'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import format from 'date-fns/format'

import dataGql from './data.graphql'
import buildMarkers from './buildMarkers'
import Marker from './Marker'

const enhance = compose(inject('store'))

const BeobNichtZuzuordnenMarker = ({ store }:{ store: Object }) => {
  const { tree } = store
  const { activeNodes, nodeLabelFilter } = tree
  const { ap, projekt, pop, tpop } = activeNodes

  return (
    <Query query={dataGql}
      variables={{
        apId: ap,
        projId: projekt,
        popId: pop,
        tpopId: tpop
      }}
    >
      {({ loading, error, data }) => {
        if (error) return `Fehler: ${error.message}`

        const beobZugeordnetFilterString = nodeLabelFilter.get('beobZugeordnet')
        const beobs = get(data, 'projektById.apsByProjId.nodes[0].popsByApId.nodes[0].tpopsByPopId.nodes[0].beobsByTpopId.nodes', [])
          // filter them by nodeLabelFilter
          .filter(el => {
            if (!beobZugeordnetFilterString) return true
            return `${
              el.datum ? format(el.datum, 'YYYY.MM.DD') : '(kein Datum)'
            }: ${el.autor || '(kein Autor)'} (${get(el, 'beobQuelleWerteByQuelleId.name', '')})`.toLowerCase().includes(beobZugeordnetFilterString.toLowerCase())
          })

        return <Marker markers={buildMarkers({ beobs, store })} />
      
    }}
  </Query>
  )
}


export default enhance(BeobNichtZuzuordnenMarker)
