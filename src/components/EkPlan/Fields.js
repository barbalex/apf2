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
          value={fields.includes('nr').toString()}
          control={
            <Radio
              color="primary"
              checked={fields.includes('nr')}
              onClick={() => toggleField('nr')}
            />
          }
          label="Nr"
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
          label="Gemeinde"
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
          label="Flurname"
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
          label="Status"
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
          label="bekannt seit"
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
          label="Link"
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
