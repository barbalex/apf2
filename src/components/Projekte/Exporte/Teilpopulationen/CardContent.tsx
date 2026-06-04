import MuiCardContent from '@mui/material/CardContent'

import { TPop } from './TPop.tsx'
import { TPopFuerWebgisBun } from './TPopFuerWebgisBun.tsx'
import { TPopFuerGoogleEarth } from './TPopFuerGoogleEarth.tsx'
import { TPopFuerGEArtname } from './TPopFuerGEArtname.tsx'
import { TPopOhneBekanntSeit } from './TPopOhneBekanntSeit.tsx'
import { TPopOhneApberRelevant } from './TPopOhneApberRelevant.tsx'
import { AnzMassnahmen } from './AnzMassnahmen.tsx'
import { Wollmilchsau } from './Wollmilchsau.tsx'
import { WollmilchsauSingle } from './WollmilchsauSingle.tsx'
import { TPopInklBerichte } from './TPopInklBerichte.tsx'
import { LetzteZaehlungen } from './LetzteZaehlungen.tsx'
import { LetzteZaehlungenInklAnpflanzungen } from './LetzteZaehlungenInklAnpflanzungen.tsx'

import styles from '../index.module.css'

export const CardContent = () => (
  <MuiCardContent className={styles.cardContent}>
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
  </MuiCardContent>
)
