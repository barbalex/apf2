import React, {
  useContext,
  useCallback,
  useState,
  useMemo,
  useEffect,
} from 'react'
import styled from 'styled-components'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import { observer } from 'mobx-react-lite'
import { withStyles } from '@material-ui/core/styles'

import Fields from './Fields'
import storeContext from '../../storeContext'
import { allFields } from '../../store/EkPlan'
import ErrorBoundary from '../shared/ErrorBoundary'

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
const ChooseTitle = styled.h5`
  position: absolute;
  left: -77px;
  top: 3px;
  margin-bottom: 0;
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

// placing mateiral-ui checkboxes denser
// see: https://github.com/mui-org/material-ui/issues/6098#issuecomment-380451242
const DenserPrimaryAction = withStyles((theme) => ({
  root: { margin: '-8px 2px -8px -4px' },
}))((props) => <div className={props.classes.root}>{props.children}</div>)

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
  const onChangeShowEkf = useCallback(() => setShowEkf(!showEkf), [
    setShowEkf,
    showEkf,
  ])
  const onChangeShowCount = useCallback(() => setShowCount(!showCount), [
    setShowCount,
    showCount,
  ])
  const onChangeShowEkCount = useCallback(() => setShowEkCount(!showEkCount), [
    setShowEkCount,
    showEkCount,
  ])
  const onChangeShowMassn = useCallback(() => setShowMassn(!showMassn), [
    setShowMassn,
    showMassn,
  ])
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
      <ChooseContainer>
        <ChooseTitle>anzeigen:</ChooseTitle>
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
        >
          {felderButtonTitle}
        </FelderButton>
        <Label
          control={
            <DenserPrimaryAction>
              <Checkbox
                checked={showEk}
                onChange={onChangeShowEk}
                color="primary"
              />
            </DenserPrimaryAction>
          }
          label="EK"
          labelPlacement="start"
        />
        <Label
          control={
            <DenserPrimaryAction>
              <Checkbox
                checked={showEkf}
                onChange={onChangeShowEkf}
                color="primary"
              />
            </DenserPrimaryAction>
          }
          label="EKF"
          labelPlacement="start"
        />
        <Label
          control={
            <DenserPrimaryAction>
              <Checkbox
                checked={showMassn}
                onChange={onChangeShowMassn}
                color="primary"
              />
            </DenserPrimaryAction>
          }
          label="Ansiedlungen"
          labelPlacement="start"
        />
        <Label
          control={
            <DenserPrimaryAction>
              <Checkbox
                checked={showCount}
                onChange={onChangeShowCount}
                color="primary"
              />
            </DenserPrimaryAction>
          }
          label="Zählungen"
          labelPlacement="start"
        />
        <Label
          control={
            <DenserPrimaryAction>
              <Checkbox
                checked={showEkCount}
                onChange={onChangeShowEkCount}
                color="primary"
              />
            </DenserPrimaryAction>
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
          <Button onClick={closeFieldsDialog}>schliessen</Button>
        </DialogActions>
      </StyledDialog>
    </ErrorBoundary>
  )
}

export default observer(EkPlanChoose)
