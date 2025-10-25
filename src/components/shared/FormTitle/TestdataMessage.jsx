import styled from '@emotion/styled'
import { useParams } from 'react-router'

import { constants } from '../../../modules/constants.js'

const Div = styled.div`
  color: #c8e6c9;
  padding: 3px 10px 5px 10px;
`

export const TestdataMessage = () => {
  const { apId } = useParams()
  const isTestAp = apId && constants.testAps.includes(apId)

  if (isTestAp) {
    return (
      <Div data-id="testdata-message">
        Das ist eine Test-Art. Sie können alles ausprobieren!
      </Div>
    )
  }
  return null
}
