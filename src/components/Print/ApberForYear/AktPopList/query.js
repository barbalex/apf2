import { gql } from '@apollo/client'

export default gql`
  query AktPopListAps($jahr: Int!) {
    jberAktPop(jahr: $jahr) {
      nodes {
        artname
        id
        pop100
        pop200
        popTotal
        pop100Diff
        pop200Diff
        popTotalDiff
      }
    }
  }
`
