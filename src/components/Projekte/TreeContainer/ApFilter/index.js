// @flow
import React from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import Switch from '@material-ui/core/Switch'
import get from 'lodash/get'
import { Query } from 'react-apollo'

import dataGql from './data.graphql'
import setTreeKey from './setTreeKey.graphql'
import Label from '../../../shared/Label'
import ErrorBoundary from '../../../shared/ErrorBoundarySingleChild'

const NurApDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding-right: 5px;
  min-width: 40px;
  margin-bottom: -14px;
`
const StyledSwitch = styled(Switch)`
  margin-left: -13px;
  margin-top: -18px;
`

const enhance = compose(
  withHandlers({
    onChange: ({ treeName }) => ({
      client,
      apFilter
    }:{
      client: Object,
      apFilter: Boolean
    }) => {
      client.mutate({
        mutation: setTreeKey,
        variables: {
          value: !apFilter,
          tree: treeName,
          key: 'apFilter'
        }
      })
    },
  })
)

const ApFilter = ({
  treeName,
  onChange,
}: {
  treeName: String,
  onChange: () => void,
}) =>
  <Query query={dataGql} >
    {({ error, data, client }) => {
      if (error) return `Fehler: ${error.message}`

      const apFilter = get(data, `${treeName}.apFilter`)

      return (
        <ErrorBoundary>
          <NurApDiv>
            <Label label="nur AP" />
            <StyledSwitch
              checked={apFilter}
              onChange={() => onChange({ client, apFilter })}
              color="primary"
            />
          </NurApDiv>
        </ErrorBoundary>
      )
    }}
  </Query>

export default enhance(ApFilter)
