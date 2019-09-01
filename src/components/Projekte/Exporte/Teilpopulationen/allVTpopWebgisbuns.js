import gql from 'graphql-tag'

export default gql`
  query viewTpopWebgisbuns {
    allVTpopWebgisbuns {
      nodes {
        APARTID: apartid
        APART: apart
        APSTATUS: apstatus
        APSTARTJAHR: apstartjahr
        APSTANDUMSETZUNG: apstandumsetzung
        POPGUID: popguid
        POPNR: popnr
        POPNAME: popname
        POPSTATUS: popstatus
        POPSTATUSUNKLAR: popstatusunklar
        POPUNKLARGRUND: popunklargrund
        POPBEKANNTSEIT: popbekanntseit
        POP_X: popX
        POP_Y: popY
        TPOPID: tpopid
        TPOPGUID: tpopguid
        TPOPNR: tpopnr
        TPOPGEMEINDE: tpopgemeinde
        TPOPFLURNAME: tpopflurname
        TPOPSTATUS: tpopstatus
        tpopapberrelevant: tPopApberRelevant
        tpopapberrelevantgrund: tPopApberRelevantGrund
        TPOPSTATUSUNKLAR: tpopstatusunklar
        TPOPUNKLARGRUND: tpopunklargrund
        TPOP_X: tpopX
        TPOP_Y: tpopY
        TPOPRADIUS: tpopradius
        TPOPHOEHE: tpophoehe
        TPOPEXPOSITION: tpopexposition
        TPOPKLIMA: tpopklima
        TPOPHANGNEIGUNG: tpophangneigung
        TPOPBESCHREIBUNG: tpopbeschreibung
        TPOPKATASTERNR: tpopkatasternr
        TPOPVERANTWORTLICH: tpopverantwortlich
        TPOPBERICHTSRELEVANZ: tpopberichtsrelevanz
        TPOPBEKANNTSEIT: tpopbekanntseit
        TPOPEIGENTUEMERIN: tpopeigentuemerin
        TPOPKONTAKTVO: tpopkontaktVo
        TPOPNUTZUNGSZONE: tpopNutzungszone
        TPOPBEWIRTSCHAFTER: tpopbewirtschafter
        TPOPBEWIRTSCHAFTUNG: tpopbewirtschaftung
        TPOPCHANGEDAT: tpopchangedat
        TPOPCHANGEBY: tpopchangeby
      }
    }
  }
`
