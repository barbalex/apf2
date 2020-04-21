import gql from 'graphql-tag'

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
