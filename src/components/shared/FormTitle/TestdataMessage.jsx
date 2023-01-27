import styled from '@emotion/styled'
import { useParams } from 'react-router-dom'

import constants from '../../../modules/constants'

const Div = styled.div`
  color: #c8e6c9;
  padding: 0 10px 10px 10px;
  margin-top: -5px;
`

const TestdataMessage = () => {
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

export default TestdataMessage
