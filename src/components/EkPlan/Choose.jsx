import { useContext, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import styled from '@emotion/styled'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'

import { Fields } from './Fields.jsx'
import { MobxContext } from '../../mobxContext.js'
import { allFields } from '../../store/EkPlan/index.js'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'

const Container = styled.div`
  display: flex;
`
const ChooseContainer = styled.div`
  position: relative;
  flex-basis: 430px;
  flex-shrink: 0;
  flex-grow: 0;
  align-self: flex-start;
  justify-self: end;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 88px;
  margin-bottom: -7px;
`
const Title = styled.h5`
  top: 3px;
  margin: 0 8px 0 0;
  hyphens: none;
`
const Label = styled(FormControlLabel)`
  float: right;
  span {
    font-size: 0.75rem;
  }
`
const StyledDialog = styled(Dialog)`
  overflow-y: hidden;
  .MuiDialog-paper {
    overflow-y: hidden;
  }
`
const FelderButton = styled(Button)`
  text-transform: none !important;
  font-size: 0.75rem !important;
  width: 150px;
`
const PastYearsContainer = styled.div`
  padding-top: 5px;
  padding-bottom: 5px;
  width: 150px;
`
const StyledTextField = styled(TextField)`
  input {
    font-size: 13px;
  }
`
const CheckboxDensifier = styled.div`
  margin: -8px 2px -8px -4px;
`

// placing material-ui checkboxes denser
// see: https://github.com/mui-org/material-ui/issues/6098#issuecomment-380451242
// but styling with styled-components
const DenserCheckbox = (props) => (
  <CheckboxDensifier>{props.children}</CheckboxDensifier>
)

export const Choose = observer(() => {
  const store = useContext(MobxContext)
  const {
    fields,
    showEk,
    setShowEk,
    showEkf,
    setShowEkf,
    showCount,
    setShowCount,
    showEkCount,
    setShowEkCount,
    showMassn,
    setShowMassn,
    pastYears,
    setPastYears,
  } = store.ekPlan

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onChangeShowEk = () => setShowEk(!showEk)
  const onChangeShowEkf = () => setShowEkf(!showEkf)
  const onChangeShowCount = () => setShowCount(!showCount)
  const onChangeShowEkCount = () => setShowEkCount(!showEkCount)
  const onChangeShowMassn = () => setShowMassn(!showMassn)
  const [fieldsDialogOpen, setFieldsDialogOpen] = useState(false)
  const onClickChooseFields = () => setFieldsDialogOpen(true)
  const closeFieldsDialog = () => setFieldsDialogOpen(false)
  const felderButtonTitle = `Felder wählen (${fields.length}/${allFields.length})`

  const [pastYearsLocal, setPastYearsLocal] = useState(pastYears)
  useEffect(() => {
    setPastYearsLocal(pastYears)
  }, [pastYears])

  const onChangePastYears = (event) => {
    const value =
      event.target.value || event.target.value === 0 ? +event.target.value : ''
    setPastYearsLocal(value)
  }

  const onBlurPastYears = () => {
    let value = pastYearsLocal
    if (pastYearsLocal === '') value = 5
    setPastYears(value)
  }

  return (
    <ErrorBoundary>
      <Container>
        <Title>anzeigen:</Title>
      </Container>
      <ChooseContainer>
        <PastYearsContainer>
          <StyledTextField
            label="vergangene Jahre"
            variant="outlined"
            value={pastYearsLocal}
            onChange={onChangePastYears}
            onBlur={onBlurPastYears}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onBlurPastYears(e)
              }
            }}
            size="small"
            type="number"
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </PastYearsContainer>
        <FelderButton
          variant="outlined"
          size="small"
          onClick={onClickChooseFields}
          color="inherit"
        >
          {felderButtonTitle}
        </FelderButton>
        <Label
          control={
            <DenserCheckbox>
              <Checkbox
                checked={showEk}
                onChange={onChangeShowEk}
                color="primary"
              />
            </DenserCheckbox>
          }
          label="EK"
          labelPlacement="start"
        />
        <Label
          control={
            <DenserCheckbox>
              <Checkbox
                checked={showEkf}
                onChange={onChangeShowEkf}
                color="primary"
              />
            </DenserCheckbox>
          }
          label="EKF"
          labelPlacement="start"
        />
        <Label
          control={
            <DenserCheckbox>
              <Checkbox
                checked={showMassn}
                onChange={onChangeShowMassn}
                color="primary"
              />
            </DenserCheckbox>
          }
          label="Ansiedlungen"
          labelPlacement="start"
        />
        <Label
          control={
            <DenserCheckbox>
              <Checkbox
                checked={showCount}
                onChange={onChangeShowCount}
                color="primary"
              />
            </DenserCheckbox>
          }
          label="Zählungen"
          labelPlacement="start"
        />
        <Label
          control={
            <DenserCheckbox>
              <Checkbox
                checked={showEkCount}
                onChange={onChangeShowEkCount}
                color="primary"
              />
            </DenserCheckbox>
          }
          label="mehrmals ausgeführt"
          labelPlacement="start"
        />
      </ChooseContainer>
      <StyledDialog
        open={fieldsDialogOpen}
        onClose={closeFieldsDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Felder wählen:'}</DialogTitle>
        <Fields />
        <DialogActions>
          <Button
            onClick={closeFieldsDialog}
            color="inherit"
          >
            schliessen
          </Button>
        </DialogActions>
      </StyledDialog>
    </ErrorBoundary>
  )
})
