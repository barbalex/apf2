//@flow

export default `
  type DatasetToDelete {
    table: String!
    id: String!
    label: String
    url: String
  }

  type DatasetDeleted {
    table: String!
    id: String!
    label: String
    url: String
    data: TableRow
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