import React, { useContext, useCallback, useState, useMemo } from 'react'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import { observer } from 'mobx-react-lite'
import { withStyles } from '@material-ui/core/styles'

import Fields from './Fields'
import storeContext from '../../storeContext'
import { defaultFields } from '../../store/EkPlan'

const ChooseContainer = styled.div`
  position: relative;
  flex-basis: 295px;
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
  padding: 0 4px !important;
  font-size: 0.75rem !important;
`

// placing mateiral-ui checkboxes denser
// see: https://github.com/mui-org/material-ui/issues/6098#issuecomment-380451242
const DenserPrimaryAction = withStyles(theme => ({
  root: { margin: '-8px 2px -8px -4px' },
}))(props => <div className={props.classes.root}>{props.children}</div>)

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
  } = store.ekPlan

  const onChangeShowEk = useCallback(() => setShowEk(!showEk), [showEk])
  const onChangeShowEkf = useCallback(() => setShowEkf(!showEkf), [showEkf])
  const onChangeShowCount = useCallback(() => setShowCount(!showCount), [
    showCount,
  ])
  const onChangeShowEkCount = useCallback(() => setShowEkCount(!showEkCount), [
    showEkCount,
  ])
  const onChangeShowMassn = useCallback(() => setShowMassn(!showMassn), [
    showMassn,
  ])
  const [fieldsDialogOpen, setFieldsDialogOpen] = useState(false)
  const onClickChooseFields = useCallback(() => setFieldsDialogOpen(true), [])
  const closeFieldsDialog = useCallback(() => setFieldsDialogOpen(false), [])
  const felderButtonTitle = useMemo(
    () => `Felder wählen (${fields.length}/${defaultFields.length})`,
    [fields.length, defaultFields.length],
  )

  return (
    <ErrorBoundary>
      <>
        <ChooseContainer>
          <ChooseTitle>anzeigen:</ChooseTitle>
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
      </>
    </ErrorBoundary>
  )
}

export default observer(EkPlanChoose)
