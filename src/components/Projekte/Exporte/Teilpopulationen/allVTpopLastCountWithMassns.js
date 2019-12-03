import gql from 'graphql-tag'

export default gql`
  query viewTpopLastCountWithMassns {
    allVTpopLastCountWithMassns {
      nodes {
        artname
        apId
        popNr
        popId
        tpopNr
        tpopId
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
`
