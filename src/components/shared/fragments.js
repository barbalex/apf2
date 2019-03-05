import gql from 'graphql-tag'

export const tpopber = gql`
  fragment TpopberFields on Tpopber {
    id
    tpopId
    jahr
    entwicklung
    tpopEntwicklungWerteByEntwicklung {
      id
      text
    }
  }
`
