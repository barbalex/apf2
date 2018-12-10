import gql from 'graphql-tag'

export default gql`
  query PopmassnbersQuery($pop: [UUID!], $isPop: Boolean!) {
    popmassnbers: allPopmassnbers(
      filter: { popId: { in: $pop } }
      orderBy: JAHR_ASC
    ) @include(if: $isPop) {
      nodes {
        id
        popId
        jahr
        tpopmassnErfbeurtWerteByBeurteilung {
          id
          text
        }
      }
    }
  }
`
