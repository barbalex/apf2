import { gql } from '@apollo/client'

export default gql`
  query ekPlanungNachAbrechnungstyps {
    allVEkPlanungNachAbrechnungstyps {
      nodes {
        apId
        artname
        artverantwortlich
        jahr
        a
        b
        d
        ekf
      }
    }
  }
`
