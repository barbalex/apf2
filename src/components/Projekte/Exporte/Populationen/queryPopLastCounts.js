import { gql } from '@apollo/client'

export default gql`
  query popLastCountsQuery {
    allPops(filter: { vPopLastCountsByPopIdExist: true }) {
      nodes {
        id
        vPopLastCountsByPopId {
          nodes {
            artname
            apId
            popId
            popNr
            popName
            popStatus
            jahre
            pflanzenTotal
            pflanzenOhneJungpflanzen
            triebeTotal
            triebeBeweidung
            keimlinge
            davonRosetten
            jungpflanzen
            blatter
            davonBluhendePflanzen
            davonBluhendeTriebe
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
