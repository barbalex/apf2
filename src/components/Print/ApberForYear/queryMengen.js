import { gql } from '@apollo/client'

export default gql`
  query apByIdForApberForYear($jahr: Int!) {
    jberAbc(jahr: $jahr) {
      nodes {
        artname
        id
        startJahr
        a3LPop
        a3LTpop
        a4LPop
        a4LTpop
        a5LPop
        a5LTpop
        a7LPop
        a7LTpop
        a8LPop
        a8LTpop
        a9LPop
        a9LTpop
        a10LPop
        a10LTpop
        b1LPop
        b1LTpop
        b1FirstYear
        b1RPop
        b1RTpop
        c1LPop
        c1LTpop
        c1RPop
        c1RTpop
        c1FirstYear
        firstMassn
        c2RPop
        c2RTpop
        c3RPop
        c3RTpop
        c4RPop
        c4RTpop
        c5RPop
        c5RTpop
        c6RPop
        c6RTpop
        c7RPop
        c7RTpop
      }
    }
  }
`
