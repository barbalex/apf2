import { useParams } from 'react-router'

import { constants } from '../../../modules/constants.js'
import { div } from './TestdataMessage.module.css'

export const TestdataMessage = () => {
  const { apId } = useParams()
  const isTestAp = apId && constants.testAps.includes(apId)

  if (isTestAp) {
    return (
      <div
        className={div}
        data-id="testdata-message"
      >
        Das ist eine Test-Art. Sie können alles ausprobieren!
      </div>
    )
  }
  return null
}
