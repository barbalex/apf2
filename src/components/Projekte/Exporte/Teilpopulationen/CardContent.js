import React from 'react'

import TPop from './TPop' 
import Wollmilchsau from './Wollmilchsau'
import WollmilchsauSingle from './WollmilchsauSingle'
import LetzteZaehlungen from './LetzteZaehlungen'
import LetzteZaehlungenInklAnpflanzungen from './LetzteZaehlungenInklAnpflanzungen'
import TPopInklBerichte from './TPopInklBerichte'
import AnzMassnahmen from './AnzMassnahmen'
import TPopOhneApberRelevant from './TPopOhneApberRelevant'
import TPopOhneBekanntSeit from './TPopOhneBekanntSeit'
import TPopFuerGEArtname from './TPopFuerGEArtname'
import TPopFuerGoogleEarth from './TPopFuerGoogleEarth'
import TPopFuerWebgisBun from './TPopFuerWebgisBun'
import { StyledCardContent } from '../index'

const Teilpopulationen = ({ treeName }) => (
  <StyledCardContent>
    <TPop treeName={treeName} />
    <TPop treeName={treeName} filtered={true} />
    <TPopFuerWebgisBun />
    <TPopFuerGoogleEarth />
    <TPopFuerGEArtname />
    <TPopOhneBekanntSeit />
    <TPopOhneApberRelevant />
    <AnzMassnahmen />
    <Wollmilchsau />
    <WollmilchsauSingle />
    <TPopInklBerichte />
    <LetzteZaehlungen />
    <LetzteZaehlungenInklAnpflanzungen />
  </StyledCardContent>
)

export default Teilpopulationen
