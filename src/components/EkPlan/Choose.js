import React, {
  useContext,
  useCallback,
  useState,
  useMemo,
  useEffect,
} from 'react'
import styled from '@emotion/styled'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import { observer } from 'mobx-react-lite'

import Fields from './Fields'
import storeContext from '../../storeContext'
import { allFields } from '../../store/EkPlan'
import ErrorBoundary from '../shared/ErrorBoundary'

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

// placing mateiral-ui checkboxes denser
// see: https://github.com/mui-org/material-ui/issues/6098#issuecomment-380451242
// but styling with styled-components
const DenserCheckbox = (props) => (
  <CheckboxDensifier>{props.children}</CheckboxDensifier>
)

const EkPlanChoose = () => {
  const store = useContext(storeContext)
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
  const onChangeShowEk = useCallback(() => setShowEk(!showEk), [showEk])
  const onChangeShowEkf = useCallback(
    () => setShowEkf(!showEkf),
    [setShowEkf, showEkf],
  )
  const onChangeShowCount = useCallback(
    () => setShowCount(!showCount),
    [setShowCount, showCount],
  )
  const onChangeShowEkCount = useCallback(
    () => setShowEkCount(!showEkCount),
    [setShowEkCount, showEkCount],
  )
  const onChangeShowMassn = useCallback(
    () => setShowMassn(!showMassn),
    [setShowMassn, showMassn],
  )
  const [fieldsDialogOpen, setFieldsDialogOpen] = useState(false)
  const onClickChooseFields = useCallback(() => setFieldsDialogOpen(true), [])
  const closeFieldsDialog = useCallback(() => setFieldsDialogOpen(false), [])
  const felderButtonTitle = useMemo(
    () => `Felder wählen (${fields.length}/${allFields.length})`,
    [fields.length],
  )

  const [pastYearsLocal, setPastYearsLocal] = useState(pastYears)
  useEffect(() => {
    setPastYearsLocal(pastYears)
  }, [pastYears])
  const onChangePastYears = useCallback(
    (event) => {
      setPastYearsLocal(event.target.value ? +event.target.value : '')
    },
    [setPastYearsLocal],
  )
  const onBlurPastYears = useCallback(() => {
    let value = pastYearsLocal
    if (pastYearsLocal === '') value = 5
    setPastYears(value)
  }, [pastYearsLocal, setPastYears])

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
            size="small"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
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
          <Button onClick={closeFieldsDialog} color="inherit">
            schliessen
          </Button>
        </DialogActions>
      </StyledDialog>
    </ErrorBoundary>
  )
}

export default observer(EkPlanChoose)
