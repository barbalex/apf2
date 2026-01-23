import { gql } from '@apollo/client'

import { copyTo } from './copyTo/index.ts'
import { store as jotaiStore, apolloClientAtom } from '../store/index.ts'

export const copyZaehlOfTpopKontr = async ({
  tpopkontrIdFrom,
  tpopkontrIdTo,
}) => {
  const apolloClient = jotaiStore.get(apolloClientAtom)
  // 1. fetch all tpopkontrzaehl
  const { data } = await apolloClient.query({
    query: gql`
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
    `,
    variables: { tpopkontrId: tpopkontrIdFrom },
  })
  const tpopkontrzaehl = data?.allTpopkontrzaehls?.nodes ?? []
  // 2. add tpopkontrzaehl to new tpopkontr
  tpopkontrzaehl.forEach((zaehl) =>
    copyTo({
      parentId: tpopkontrIdTo,
      table: 'tpopkontrzaehl',
      id: zaehl.id,
    }),
  )
}
