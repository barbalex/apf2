import { gql } from '@apollo/client'
import get from 'lodash/get'

import copyTo from './copyTo'

const copyTpopsOfPop = async ({ popIdFrom, popIdTo, client, store }) => {
  // 1. fetch all tpops
  const { data } = await client.query({
    query: gql`
      query tpopsForCopyTpopsOfPopQuery($popId: UUID!) {
        allTpops(filter: { popId: { equalTo: $popId } }) {
          nodes {
            id
          }
        }
      }
    `,
    variables: { popId: popIdFrom },
  })
  const tpops = get(data, 'allTpops.nodes', [])

  // 2. add tpops to new pop
  tpops.forEach((tpop) =>
    copyTo({
      parentId: popIdTo,
      table: 'tpop',
      id: tpop.id,
      client,
      store,
    }),
  )
}

export default copyTpopsOfPop
