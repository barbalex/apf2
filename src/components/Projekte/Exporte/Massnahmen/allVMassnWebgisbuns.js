import gql from 'graphql-tag'

export default gql`
  query viewMassnWebgisbuns {
    allVMassnWebgisbuns {
      nodes {
        APARTID: apartid
        APART: apart
        POPGUID: popguid
        POPNR: popnr
        TPOPGUID: tpopguid
        TPOPNR: tpopnr
        TPOP_X: tpopX
        TPOP_Y: tpopY
        TPOPSTATUS: tpopstatus
        tpopapberrelevant: tPopApberRelevant
        tpopapberrelevantgrund: tPopApberRelevantGrund
        MASSNGUID: massnguid
        MASSNJAHR: massnjahr
        MASSNDAT: massndat
        MASSTYP: masstyp
        MASSNMASSNAHME: massnmassnahme
        MASSNBEARBEITER: massnbearbeiter
        MASSNBEMERKUNG: massnbemerkung
        MASSNPLAN: massnplan
        MASSPLANBEZ: massplanbez
        MASSNFLAECHE: massnflaeche
        MASSNFORMANSIEDL: massnformansiedl
        MASSNPFLANZANORDNUNG: massnpflanzanordnung
        MASSNMARKIERUNG: massnmarkierung
        MASSNANZTRIEBE: massnanztriebe
        MASSNANZPFLANZEN: massnanzpflanzen
        MASSNANZPFLANZSTELLEN: massnanzpflanzstellen
        MASSNWIRTSPFLANZEN: massnwirtspflanzen
        MASSNHERKUNFTSPOP: massnherkunftspop
        MASSNSAMMELDAT: massnsammeldat
        MASSNCHANGEDAT: massnchangedat
        MASSNCHANGEBY: massnchangeby
      }
    }
  }
`
