import { gql } from '@apollo/client'

export default gql`
  query tpopLastCountQuery {
    allTpops(filter: { vTpopLastCountsByTpopIdExist: true }) {
      nodes {
        id
        vTpopLastCountsByTpopId {
          nodes {
            artname
            apId
            popId
            popNr
            popName
            popStatus
            tpopId
            tpopNr
            tpopGemeinde
            tpopFlurname
            tpopStatus
            jahr
            pflanzen
            pflanzenOhneJungpflanzen
            triebe
            triebeBeweidung
            keimlinge
            rosetten
            jungpflanzen
            blatter
            bluhendePflanzen
            bluhendeTriebe
            bluten
            fertilePflanzen
            fruchtendeTriebe
            blutenstande
            fruchtstande
            gruppen
            deckung
            pflanzen5M2
            triebeIn30M2
            triebe50M2
            triebeMahflache
            flacheM2
            pflanzstellen
            stellen
            andereZaehleinheit
            artIstVorhanden
          }
        }
      }
    }
  }
`
