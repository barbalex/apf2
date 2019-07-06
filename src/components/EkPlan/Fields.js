import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import DialogContent from '@material-ui/core/DialogContent'
import ErrorBoundary from 'react-error-boundary'

import storeContext from '../../storeContext'

const StyledDialogContent = styled(DialogContent)`
  display: flex;
  flex-direction: column;
`

const Fields = () => {
  const store = useContext(storeContext)
  const {
    showAp,
    setShowAp,
    showPopNr,
    setShowPopNr,
    showPopName,
    setShowPopName,
    showTpopNr,
    setShowTpopNr,
    showTpopGemeinde,
    setShowTpopGemeinde,
    showTpopFlurname,
    setShowTpopFlurname,
    showTpopStatus,
    setShowTpopStatus,
    showTpopBekanntSeit,
    setShowTpopBekanntSeit,
    showLink,
    setShowLink,
    showEkAbrechnungstyp,
    setShowEkAbrechnungstyp,
    showEkfrequenz,
    setShowEkfrequenz,
    showEkfrequenzAbweichend,
    setShowEkfrequenzAbweichend,
  } = store.ekPlan

  return (
    <ErrorBoundary>
      <StyledDialogContent>
        <FormControlLabel
          value={showAp.toString()}
          control={
            <Radio
              color="primary"
              checked={showAp}
              onClick={() => setShowAp(!showAp)}
            />
          }
          label="AP"
          labelPlacement="end"
        />
        <FormControlLabel
          value={showPopNr.toString()}
          control={
            <Radio
              color="primary"
              checked={showPopNr}
              onClick={() => setShowPopNr(!showPopNr)}
            />
          }
          label="Pop Nr"
          labelPlacement="end"
        />
        <FormControlLabel
          value={showPopName.toString()}
          control={
            <Radio
              color="primary"
              checked={showPopName}
              onClick={() => setShowPopName(!showPopName)}
            />
          }
          label="Pop Name"
          labelPlacement="end"
        />
        <FormControlLabel
          value={showTpopNr.toString()}
          control={
            <Radio
              color="primary"
              checked={showTpopNr}
              onClick={() => setShowTpopNr(!showTpopNr)}
            />
          }
          label="Nr"
          labelPlacement="end"
        />
        <FormControlLabel
          value={showTpopGemeinde.toString()}
          control={
            <Radio
              color="primary"
              checked={showTpopGemeinde}
              onClick={() => setShowTpopGemeinde(!showTpopGemeinde)}
            />
          }
          label="Gemeinde"
          labelPlacement="end"
        />
        <FormControlLabel
          value={showTpopFlurname.toString()}
          control={
            <Radio
              color="primary"
              checked={showTpopFlurname}
              onClick={() => setShowTpopFlurname(!showTpopFlurname)}
            />
          }
          label="Flurname"
          labelPlacement="end"
        />
        <FormControlLabel
          value={showTpopStatus.toString()}
          control={
            <Radio
              color="primary"
              checked={showTpopStatus}
              onClick={() => setShowTpopStatus(!showTpopStatus)}
            />
          }
          label="Status"
          labelPlacement="end"
        />
        <FormControlLabel
          value={showTpopBekanntSeit.toString()}
          control={
            <Radio
              color="primary"
              checked={showTpopBekanntSeit}
              onClick={() => setShowTpopBekanntSeit(!showTpopBekanntSeit)}
            />
          }
          label="bekannt seit"
          labelPlacement="end"
        />
        <FormControlLabel
          value={showLink.toString()}
          control={
            <Radio
              color="primary"
              checked={showLink}
              onClick={() => setShowLink(!showLink)}
            />
          }
          label="Link"
          labelPlacement="end"
        />
        <FormControlLabel
          value={showEkAbrechnungstyp.toString()}
          control={
            <Radio
              color="primary"
              checked={showEkAbrechnungstyp}
              onClick={() => setShowEkAbrechnungstyp(!showEkAbrechnungstyp)}
            />
          }
          label="EK Abrechnung Typ"
          labelPlacement="end"
        />
        <FormControlLabel
          value={showEkfrequenz.toString()}
          control={
            <Radio
              color="primary"
              checked={showEkfrequenz}
              onClick={() => setShowEkfrequenz(!showEkfrequenz)}
            />
          }
          label="EK Frequenz"
          labelPlacement="end"
        />
        <FormControlLabel
          value={showEkfrequenzAbweichend.toString()}
          control={
            <Radio
              color="primary"
              checked={showEkfrequenzAbweichend}
              onClick={() =>
                setShowEkfrequenzAbweichend(!showEkfrequenzAbweichend)
              }
            />
          }
          label="EK Frequenz abweichend"
          labelPlacement="end"
        />
      </StyledDialogContent>
    </ErrorBoundary>
  )
}

export default observer(Fields)
