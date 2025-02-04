import { memo, useContext, useCallback, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'
import styled from '@emotion/styled'

import { MobxContext } from '../../../mobxContext.js'
import { tpop } from '../../shared/fragments.js'
import { setEkplans } from './setEkplans/index.jsx'

const Container = styled.div`
  font-size: 0.75rem !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  overflow: hidden !important;
  padding: 2px 4px !important;
  padding-left: ${(props) =>
    props['data-firstchild'] ? '10px !important' : '2px'};
  border-left: solid hsla(70, 80%, 75%, 1) 1px;
  border-right: solid hsla(70, 80%, 75%, 1) 1px;
  border-bottom: solid #e6e6e6 1px;
  box-sizing: border-box;
  background: ${(props) =>
    props['data-clicked'] ? 'rgb(255,211,167) !important'
    : props['data-isodd'] ? 'rgb(255, 255, 252)'
    : 'unset'};
  &.tpop-hovered {
    background-color: hsla(45, 100%, 90%, 1);
  }
  &.column-hovered {
    background-color: hsla(45, 100%, 90%, 1);
  }
  div {
    white-space: nowrap !important;
    text-overflow: ellipsis !important;
    overflow: hidden !important;
  }
  padding: 5px 15px !important;
  font-size: unset !important;
  border-left: solid green 1px;
  border-right: solid green 1px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  &:focus-within {
    border: solid orange 3px;
  }
`
const Input = styled.input`
  font-size: 12px;
  width: 100%;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  text-align: center;
  &:focus {
    outline: none !important;
  }
`

export const CellForEkfrequenzStartjahr = memo(
  observer(({ row, style, refetchTpop, setProcessing }) => {
    const client = useApolloClient()
    const store = useContext(MobxContext)
    const { enqueNotification } = store
    const { hovered } = store.ekPlan
    const className = hovered.tpopId === row.id ? 'tpop-hovered' : ''

    const [stateValue, setStateValue] = useState(
      row.ekfrequenzStartjahr.value || row.ekfrequenzStartjahr.value === 0 ?
        row.ekfrequenzStartjahr.value
      : '',
    )

    useEffect(() => {
      setStateValue(
        !!row.ekfrequenzStartjahr.value || row.ekfrequenzStartjahr.value === 0 ?
          row.ekfrequenzStartjahr.value
        : '',
      )
    }, [row.ekfrequenzStartjahr.value, row.id])

    const onMouseEnter = useCallback(
      () => hovered.setTpopId(row.id),
      [hovered, row.id],
    )
    const onChange = useCallback((e) => {
      const value = e.target.value || e.target.value === 0 ? e.target.value : ''
      setStateValue(value)
    }, [])
    const onBlur = useCallback(
      async (e) => {
        setProcessing(true)
        const value =
          e.target.value || e.target.value === 0 ? +e.target.value : null
        try {
          await client.mutate({
            mutation: gql`
              mutation updateTpopEkfrequenzStartjahr(
                $id: UUID!
                $ekfrequenzStartjahr: Int
                $changedBy: String
              ) {
                updateTpopById(
                  input: {
                    id: $id
                    tpopPatch: {
                      id: $id
                      ekfrequenzStartjahr: $ekfrequenzStartjahr
                      changedBy: $changedBy
                    }
                  }
                ) {
                  tpop {
                    ...TpopFields
                  }
                }
              }
              ${tpop}
            `,
            variables: {
              id: row.id,
              ekfrequenzStartjahr: value,
              changedBy: store.user.name,
            },
            refetchQueries: ['EkplanTpopQuery'],
          })
        } catch (error) {
          enqueNotification({
            message: error.message,
            options: {
              variant: 'error',
            },
          })
        }
        // TODO: or ekfrequenz has no kontrolljahre
        if (row.ekfrequenz.value && value) {
          await setEkplans({
            tpopId: row.id,
            ekfrequenz: row.ekfrequenz.value,
            ekfrequenzStartjahr: value,
            refetchTpop,
            client,
            store,
          })
        } else {
          await refetchTpop()
        }
        setProcessing(false)
      },
      [row, client, store, enqueNotification, refetchTpop],
    )

    return (
      <Container
        style={style}
        onMouseEnter={onMouseEnter}
        onMouseLeave={hovered.reset}
        className={className}
        data-isodd={row.isOdd}
      >
        <Input
          value={stateValue}
          onChange={onChange}
          onBlur={onBlur}
        />
      </Container>
    )
  }),
)
