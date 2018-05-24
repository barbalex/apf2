// @flow
import gql from 'graphql-tag'
import get from 'lodash/get'

import copyTo from './copyTo'

export default async ({
  store,
  popIdFrom,
  popIdTo,
  client,
}: {
  store: Object,
  popIdFrom: String,
  popIdTo: String,
  client: Object
}) => {
  // 1. fetch all tpops
  const { data } = await client.query({
    query: gql`
      query myquery($popId: UUID!) {
        allTpops(filter: {popId: {equalTo: $popId}}) {
          nodes {
            id
            popId
            nr
            gemeinde
            flurname
            x
            y
            radius
            hoehe
            exposition
            klima
            neigung
            beschreibung
            katasterNr
            status
            statusUnklarGrund
            apberRelevant
            bekanntSeit
            eigentuemer
            kontakt
            nutzungszone
            bewirtschafter
            bewirtschaftung
            bemerkungen
            statusUnklar
          }
        }
      }
    `,
    variables: { popId: popIdFrom }
  })
  const tpops = get(data, 'allTpops.nodes')

  // 2. add tpops to new pop
  tpops.forEach(tpop =>
    copyTo({
      store,
      parentId: popIdTo,
      table: 'tpop',
      id: tpop.id,
      client
    })
  )
}
