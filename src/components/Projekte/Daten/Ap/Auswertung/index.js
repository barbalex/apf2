import React from 'react'

import ApErfolg from './ApErfolg'
import PopStatus from './PopStatus'
import PopMenge from './PopMenge'

const ApAuswertung = ({ id }) => {
  return (
    <>
      <ApErfolg id={id} />
      <PopStatus id={id} />
      <PopMenge id={id} />
    </>
  )
}

export default ApAuswertung
