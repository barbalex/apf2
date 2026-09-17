import { useState } from 'react'
import { styled } from '@mui/material/styles'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Dialog, { type DialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import { useAtomValue, useAtom } from 'jotai'

import { Fields } from './Fields.tsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.tsx'
import {
  ekPlanFieldsAtom,
  ekPlanShowEkAtom,
  ekPlanShowEkfAtom,
  ekPlanShowCountAtom,
  ekPlanShowEkCountAtom,
  ekPlanShowMassnAtom,
  ekPlanPastYearsAtom,
} from '../../store/index.ts'

import styles from './Choose.module.css'

const allFields = [
  'ap',
  'popNr',
  'popName',
  'popStatus',
  'nr',
  'gemeinde',
  'flurname',
  'status',
  'bekanntSeit',
  'lv95X',
  'lv95Y',
  'link',
  'ekfKontrolleur',
  'ekAbrechnungstyp',
  'ekfrequenz',
  'ekfrequenzStartjahr',
  'ekfrequenzAbweichend',
]

const StyledDialog = styled((props: DialogProps) => <Dialog {...props} />)(
  () => ({
    overflowY: 'hidden',
    '& .MuiDialog-paper': {
      overflowY: 'hidden',
    },
  }),
)

// placing material-ui checkboxes denser
// see: https://github.com/mui-org/material-ui/issues/6098#issuecomment-380451242
// but styling with styled-components
const DenserCheckbox = (props: { children?: React.ReactNode }) => (
  <div className={styles.checkboxDensifier}>{props.children}</div>
)

export const Choose = () => {
  const fields = useAtomValue(ekPlanFieldsAtom)
  const [showEk, setShowEk] = useAtom(ekPlanShowEkAtom)
  const [showEkf, setShowEkf] = useAtom(ekPlanShowEkfAtom)
  const [showCount, setShowCount] = useAtom(ekPlanShowCountAtom)
  const [showEkCount, setShowEkCount] = useAtom(ekPlanShowEkCountAtom)
  const [showMassn, setShowMassn] = useAtom(ekPlanShowMassnAtom)
  const [pastYears, setPastYears] = useAtom(ekPlanPastYearsAtom)

  const onChangeShowEk = () => setShowEk(!showEk)
  const onChangeShowEkf = () => setShowEkf(!showEkf)
  const onChangeShowCount = () => setShowCount(!showCount)
  const onChangeShowEkCount = () => setShowEkCount(!showEkCount)
  const onChangeShowMassn = () => setShowMassn(!showMassn)
  const [fieldsDialogOpen, setFieldsDialogOpen] = useState(false)
  const onClickChooseFields = () => setFieldsDialogOpen(true)
  const closeFieldsDialog = () => setFieldsDialogOpen(false)
  const felderButtonTitle = `Felder wählen (${fields.length}/${allFields.length})`

  const [pastYearsLocal, setPastYearsLocal] = useState<number | ''>(pastYears)
  const [prevPastYears, setPrevPastYears] = useState(pastYears)
  if (prevPastYears !== pastYears) {
    setPrevPastYears(pastYears)
    setPastYearsLocal(pastYears)
  }

  const onChangePastYears = (event: { target: { value: string } }) => {
    const value = event.target.value ? +event.target.value : ''
    setPastYearsLocal(value)
  }

  const onBlurPastYears = () => {
    setPastYears(pastYearsLocal === '' ? 5 : pastYearsLocal)
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <h5 className={styles.title}>anzeigen:</h5>
      </div>
      <div className={styles.chooseContainer}>
        <div className={styles.pastYearsContainer}>
          <TextField
            className={styles.textField}
            label="vergangene Jahre"
            variant="outlined"
            value={pastYearsLocal}
            onChange={onChangePastYears}
            onBlur={onBlurPastYears}
            onKeyPress={(e: { key: string }) => {
              if (e.key === 'Enter') {
                onBlurPastYears()
              }
            }}
            size="small"
            type="number"
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </div>
        <Button
          className={styles.felderButton}
          variant="outlined"
          size="small"
          onClick={onClickChooseFields}
          color="inherit"
        >
          {felderButtonTitle}
        </Button>
        <FormControlLabel
          className={styles.label}
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
        <FormControlLabel
          className={styles.label}
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
        <FormControlLabel
          className={styles.label}
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
        <FormControlLabel
          className={styles.label}
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
        <FormControlLabel
          className={styles.label}
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
      </div>
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
}
