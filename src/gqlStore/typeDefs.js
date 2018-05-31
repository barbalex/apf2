//@flow
/**
 * nested field resolvers do not work yet in apollo-link-state
 * see: https://github.com/apollographql/apollo-link-state/issues/226
 * so data is not a TableRow but rather a string created by JSON.stringify :-(
 */

export default `
  type DatasetToDelete {
    table: String!
    id: String!
    label: String
    url: String
  }

  type DatasetDeleted {
    table: String!
    id: UUID!
    label: String!
    url: [String]!
    data: String! #should be TableRow
    time: Date!
  }

  type Error {
    message: String!
    name: String
  }

  type Query {
    datasetToDelete: DatasetToDelete
    datasetsDeleted: [DatasetDeleted]
    errors: [Error]
  }

  union TableRow = Adresse | AeEigenschaften | Ap  | Apart | Apber | Apberuebersicht | Assozart | Beob | Ber | Erfkrit | Gemeinde | Idealbiotop | Message | Pop | Popber | Popmassnber | Projekt | Tpop | Tpopber | Tpopkontr | Tpopkontrzaehl | Tpopmassn | Tpopmassnber | User | Usermessage | Ziel | Zielber
`