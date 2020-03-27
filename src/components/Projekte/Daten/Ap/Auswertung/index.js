import React from 'react'

import ApErfolg from './ApErfolg'
import PopStatus from './PopStatus'
import PopMenge from './PopMenge'
import TpopKontrolliert from './TpopKontrolliert'

const ApAuswertung = ({ id }) => {
  return (
    <>
      <ApErfolg id={id} />
      <PopStatus id={id} />
      <PopMenge id={id} />
      <TpopKontrolliert id={id} />
    </>
  )
}

export default ApAuswertung
