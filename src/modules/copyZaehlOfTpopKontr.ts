import { graphql } from '../gql/index.ts'

import { copyTo } from './copyTo/index.ts'
import {
  getApolloClientFromStore,
} from '../store/index.ts'

export const copyZaehlOfTpopKontr = async ({
  tpopkontrIdFrom,
  tpopkontrIdTo,
}: {
  tpopkontrIdFrom: string
  tpopkontrIdTo: string | null | undefined
}) => {
  const apolloClient = getApolloClientFromStore()
  // 1. fetch all tpopkontrzaehl
  const { data } = await apolloClient.query({
    query: graphql(`
      query tpopkontrzaehlsForCopyZaehlOfTpopkontrQuery($tpopkontrId: UUID!) {
        allTpopkontrzaehls(filter: { tpopkontrId: { equalTo: $tpopkontrId } }) {
          nodes {
            id
            anzahl
            einheit
            methode
          }
        }
      }
    `),
    variables: { tpopkontrId: tpopkontrIdFrom },
  })
  const tpopkontrzaehl = data?.allTpopkontrzaehls?.nodes ?? []
  // 2. add tpopkontrzaehl to new tpopkontr
  tpopkontrzaehl.forEach((zaehl) =>
    void copyTo({
      parentId: tpopkontrIdTo ?? undefined,
      table: 'tpopkontrzaehl',
      id: zaehl?.id ?? '',
    }),
  )
}
