import { gql } from '@apollo/client'

// query: v_pop_last_count_with_massn
export default gql`
  query popLastCountsWithMassnQuery {
    allPops(filter: { vPopLastCountWithMassnsByPopIdExist: true }) {
      nodes {
        id
        vPopLastCountWithMassnsByPopId {
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
