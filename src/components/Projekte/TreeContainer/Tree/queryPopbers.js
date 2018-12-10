import gql from 'graphql-tag'

export default gql`
  query PopbersQuery($pop: [UUID!], $isPop: Boolean!) {
    allPopbers(filter: { popId: { in: $pop } }, orderBy: JAHR_ASC)
      @include(if: $isPop) {
      nodes {
        id
        popId
        jahr
        tpopEntwicklungWerteByEntwicklung {
          id
          text
        }
      }
    }
  }
`
