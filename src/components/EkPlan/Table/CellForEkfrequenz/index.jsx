import { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import styled from '@emotion/styled'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker'

import { StyledCellForSelect } from '../index.jsx'
import { MobxContext } from '../../../../mobxContext.js'

const processChangeWorkerFactory = createWorkerFactory(
  () => import('./processChange.js'),
)

const StyledDialogTitle = styled(DialogTitle)`
  font-size: 1rem;
  font-weight: 700;
  padding: 10px 16px 5px 16px;
`
const StyledListItem = styled(ListItem)`
  font-size: 0.85rem;
  user-select: none;
  ${(props) =>
    props.active === 'true' && 'background-color: rgba(0, 0, 0, 0.04);'}
`
const CodeText = styled.span`
  font-family: 'Roboto Mono', monospace;
  font-size: 0.85rem;
  min-width: ${(props) => props.width * 0.65}rem;
`
const AnwendungsfallText = styled.span`
  font-size: 0.85rem;
`

export const CellForEkfrequenz = observer(
  ({ row, isOdd, field, width, setProcessing, data }) => {
    const apolloClient = useApolloClient()
    const tsQueryClient = useQueryClient()

    const store = useContext(MobxContext)
    const { enqueNotification } = store
    const { hovered, apValues } = store.ekPlan
    const className = hovered.tpopId === row.id ? 'tpop-hovered' : ''

    const processChangeWorker = useWorker(processChangeWorkerFactory)

    const allEkfrequenzs = data?.allEkfrequenzs?.nodes ?? []

    const maxCodeLength = Math.max(
      ...allEkfrequenzs.map((a) => (a.code || '').length),
    )

    const onMouseEnter = () => hovered.setTpopId(row.id)

    const onChange = async (e) => {
      const value = e.target.value || null
      setProcessing(true)
      await processChangeWorker.processChange({
        apolloClient,
        value,
        row,
        enqueNotification,
        store,
        tsQueryClient,
      })
      setProcessing(false)
    }

    const valueToShow = allEkfrequenzs?.find((e) => e.id === field.value)?.code

    const [open, setOpen] = useState(false)
    const onOpen = () => setOpen(true)
    const onClose = () => setOpen(false)

    return (
      <>
        <StyledCellForSelect
          width={width}
          onMouseEnter={onMouseEnter}
          onMouseLeave={hovered.reset}
          onClick={onOpen}
          className={className}
          data-isodd={isOdd}
        >
          {valueToShow}
        </StyledCellForSelect>
        <Dialog
          onClose={onClose}
          open={open}
        >
          <StyledDialogTitle>EK-Frequenz wählen:</StyledDialogTitle>
          <List sx={{ pt: 0 }}>
            <StyledListItem
              onClick={() => {
                onChange({ target: { value: '' } })
                onClose()
              }}
              button={true.toString()}
              dense
              active={(data?.tpopById?.ekfrequenz === null).toString()}
            >
              Kein Wert
            </StyledListItem>
            {allEkfrequenzs.map((e) => (
              <StyledListItem
                key={e.id}
                onClick={() => {
                  onChange({ target: { value: e.id } })
                  onClose()
                }}
                button={true.toString()}
                dense
                active={(e.id === data?.tpopById?.ekfrequenz).toString()}
              >
                <CodeText width={maxCodeLength}>{e.code}</CodeText>
                <AnwendungsfallText>{e.anwendungsfall}</AnwendungsfallText>
              </StyledListItem>
            ))}
          </List>
        </Dialog>
      </>
    )
  },
)
