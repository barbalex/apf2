import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import DialogContent from '@mui/material/DialogContent'

import storeContext from '../../storeContext'
import ErrorBoundary from '../shared/ErrorBoundary'

const StyledDialogContent = styled(DialogContent)`
  display: flex;
  flex-direction: column;
`

const Fields = () => {
  const store = useContext(storeContext)
  const { fields, toggleField } = store.ekPlan

  return (
    <ErrorBoundary>
      <StyledDialogContent>
        <FormControlLabel
          value={fields.includes('ap').toString()}
          control={
            <Radio
              color="primary"
              checked={fields.includes('ap')}
              onClick={() => toggleField('ap')}
            />
          }
          label="AP"
          labelPlacement="end"
        />
        <FormControlLabel
          value={fields.includes('popNr').toString()}
          control={
            <Radio
              color="primary"
              checked={fields.includes('popNr')}
              onClick={() => toggleField('popNr')}
            />
          }
          label="Pop Nr"
          labelPlacement="end"
        />
        <FormControlLabel
          value={fields.includes('popName').toString()}
          control={
            <Radio
              color="primary"
              checked={fields.includes('popName')}
              onClick={() => toggleField('popName')}
            />
          }
          label="Pop Name"
          labelPlacement="end"
        />
        <FormControlLabel
          value={fields.includes('popStatus').toString()}
          control={
            <Radio
              color="primary"
              checked={fields.includes('popStatus')}
              onClick={() => toggleField('popStatus')}
            />
          }
          label="Pop Status"
          labelPlacement="end"
        />
        <FormControlLabel
          value={fields.includes('nr').toString()}
          control={
            <Radio
              color="primary"
              checked={fields.includes('nr')}
              onClick={() => toggleField('nr')}
            />
          }
          label="TPop Nr"
          labelPlacement="end"
        />
        <FormControlLabel
          value={fields.includes('gemeinde').toString()}
          control={
            <Radio
              color="primary"
              checked={fields.includes('gemeinde')}
              onClick={() => toggleField('gemeinde')}
            />
          }
          label="TPop Gemeinde"
          labelPlacement="end"
        />
        <FormControlLabel
          value={fields.includes('flurname').toString()}
          control={
            <Radio
              color="primary"
              checked={fields.includes('flurname')}
              onClick={() => toggleField('flurname')}
            />
          }
          label="TPop Flurname"
          labelPlacement="end"
        />
        <FormControlLabel
          value={fields.includes('status').toString()}
          control={
            <Radio
              color="primary"
              checked={fields.includes('status')}
              onClick={() => toggleField('status')}
            />
          }
          label="TPop Status"
          labelPlacement="end"
        />
        <FormControlLabel
          value={fields.includes('bekanntSeit').toString()}
          control={
            <Radio
              color="primary"
              checked={fields.includes('bekanntSeit')}
              onClick={() => toggleField('bekanntSeit')}
            />
          }
          label="TPop bekannt seit"
          labelPlacement="end"
        />
        <FormControlLabel
          value={fields.includes('lv95X').toString()}
          control={
            <Radio
              color="primary"
              checked={fields.includes('lv95X')}
              onClick={() => toggleField('lv95X')}
            />
          }
          label="X-Koordinate"
          labelPlacement="end"
        />
        <FormControlLabel
          value={fields.includes('lv95Y').toString()}
          control={
            <Radio
              color="primary"
              checked={fields.includes('lv95Y')}
              onClick={() => toggleField('lv95Y')}
            />
          }
          label="Y-Koordinate"
          labelPlacement="end"
        />
        <FormControlLabel
          value={fields.includes('link').toString()}
          control={
            <Radio
              color="primary"
              checked={fields.includes('link')}
              onClick={() => toggleField('link')}
            />
          }
          label="TPop Link"
          labelPlacement="end"
        />
        <FormControlLabel
          value={fields.includes('ekfKontrolleur').toString()}
          control={
            <Radio
              color="primary"
              checked={fields.includes('ekfKontrolleur')}
              onClick={() => toggleField('ekfKontrolleur')}
            />
          }
          label="EKF-KontrolleurIn"
          labelPlacement="end"
        />
        <FormControlLabel
          value={fields.includes('ekAbrechnungstyp').toString()}
          control={
            <Radio
              color="primary"
              checked={fields.includes('ekAbrechnungstyp')}
              onClick={() => toggleField('ekAbrechnungstyp')}
            />
          }
          label="EK Abrechnung Typ"
          labelPlacement="end"
        />
        <FormControlLabel
          value={fields.includes('ekfrequenz').toString()}
          control={
            <Radio
              color="primary"
              checked={fields.includes('ekfrequenz')}
              onClick={() => toggleField('ekfrequenz')}
            />
          }
          label="EK Frequenz"
          labelPlacement="end"
        />
        <FormControlLabel
          value={fields.includes('ekfrequenzStartjahr').toString()}
          control={
            <Radio
              color="primary"
              checked={fields.includes('ekfrequenzStartjahr')}
              onClick={() => toggleField('ekfrequenzStartjahr')}
            />
          }
          label="EK Frequenz Startjahr"
          labelPlacement="end"
        />
        <FormControlLabel
          value={fields.includes('ekfrequenzAbweichend').toString()}
          control={
            <Radio
              color="primary"
              checked={fields.includes('ekfrequenzAbweichend')}
              onClick={() => toggleField('ekfrequenzAbweichend')}
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
