import styled from '@emotion/styled'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'

const SpinnerContainer = styled.div`
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
`
const SpinnerText = styled.div`
  padding: 10px;
`

export const SpinnerOverlay = ({ message, onClose }) => (
  <Dialog
    open
    onClose={onClose}
    disableEscapeKeyDown={true}
  >
    <SpinnerContainer>
      <CircularProgress />
      {!!message && <SpinnerText>{message}</SpinnerText>}
    </SpinnerContainer>
  </Dialog>
)
