import { gql } from '@apollo/client'

import { copyTo } from './copyTo/index.js'

export const copyTpopsOfPop = async ({
  popIdFrom,
  popIdTo,
  apolloClient,
  store,
}) => {
  // 1. fetch all tpops
  const { data } = await apolloClient.query({
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
  const tpops = data?.allTpops?.nodes ?? []

  // 2. add tpops to new pop
  tpops.forEach((tpop) =>
    copyTo({
      parentId: popIdTo,
      table: 'tpop',
      id: tpop.id,
      apolloClient,
      store,
    }),
  )
}
