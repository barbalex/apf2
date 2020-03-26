import React from 'react'

import ApErfolg from './ApErfolg'
import PopStatus from './PopStatus'

const ApAuswertung = ({ id }) => {
  return (
    <>
      <ApErfolg id={id} />
      <PopStatus id={id} />
    </>
  )
}

export default ApAuswertung
