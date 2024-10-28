import React from 'react'

import { TPop } from './TPop.jsx'
import Wollmilchsau from './Wollmilchsau.jsx'
import WollmilchsauSingle from './WollmilchsauSingle.jsx'
import LetzteZaehlungen from './LetzteZaehlungen.jsx'
import LetzteZaehlungenInklAnpflanzungen from './LetzteZaehlungenInklAnpflanzungen.jsx'
import TPopInklBerichte from './TPopInklBerichte.jsx'
import AnzMassnahmen from './AnzMassnahmen.jsx'
import TPopOhneApberRelevant from './TPopOhneApberRelevant.jsx'
import TPopOhneBekanntSeit from './TPopOhneBekanntSeit.jsx'
import TPopFuerGEArtname from './TPopFuerGEArtname.jsx'
import TPopFuerGoogleEarth from './TPopFuerGoogleEarth.jsx'
import TPopFuerWebgisBun from './TPopFuerWebgisBun.jsx'
import { StyledCardContent } from '../index.jsx'

export const CardContent = () => (
  <StyledCardContent>
    <TPop />
    <TPop filtered={true} />
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
