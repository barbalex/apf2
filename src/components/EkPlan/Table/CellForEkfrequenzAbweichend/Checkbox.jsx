import { useContext, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import styled from '@emotion/styled'

import { tpop } from '../../../shared/fragments.js'
import { MobxContext } from '../../../../mobxContext.js'

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`

const Icon = styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 2px;
`
const CheckboxDiv = styled.div`
  width: 19px;
  height: 19px;
  background: ${(props) => (props.checked ? '#2e7d32' : 'rgba(46,125,50,0.1)')};
  border-radius: 3px;
  transition: all 150ms;
  margin: auto;
`

export const Checkbox = observer(({ row, value, field }) => {
  const store = useContext(MobxContext)
  const { enqueNotification } = store
  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [checked, setChecked] = useState(value === null ? false : value)
  useEffect(() => {
    setChecked(row[field] === true)
  }, [field, row, value])

  const onClick = async () => {
    setChecked(!checked)
    try {
      await apolloClient.mutate({
        mutation: gql`
            mutation updateTpopCheckbox(
              $id: UUID!
              $${field}: Boolean
              $changedBy: String
            ) {
              updateTpopById(
                input: {
                  id: $id
                  tpopPatch: {
                    id: $id
                    ${field}: $${field}
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
          [field]: !checked,
          changedBy: store.user.name,
        },
      })
    } catch (error) {
      setChecked(!checked)
      enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    tsQueryClient.invalidateQueries({
      queryKey: ['EkplanTpopQuery'],
    })
  }

  return (
    <Container onClick={onClick}>
      <CheckboxDiv checked={checked}>
        <Icon
          viewBox="0 0 24 24"
          style={{ visibility: checked ? 'visible' : 'hidden' }}
        >
          <polyline points="20 6 9 17 4 12" />
        </Icon>
      </CheckboxDiv>
    </Container>
  )
})
