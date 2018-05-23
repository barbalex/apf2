// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import styled from 'styled-components'
import gql from 'graphql-tag'

const StyledCard = styled(Card)`
  margin: 10px 0;
  background-color: #fff8e1 !important;
`
const StyledCardActions = styled(CardActions)`
  justify-content: space-between;
  cursor: pointer;
  height: auto !important;
`
const CardActionIconButton = styled(IconButton)`
  transform: ${props => (props['data-expanded'] ? 'rotate(180deg)' : 'none')};
`
const CardActionTitle = styled.div`
  padding-left: 8px;
  font-weight: bold;
  word-break: break-word;
  user-select: none;
`
const StyledCardContent = styled(CardContent)`
  margin: -15px 0 0 0;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: stretch;
  align-content: stretch;
`
const StyledFormControlLabel = styled(FormControlLabel)`
  margin-left: 0 !important;
`
const StyledCheckbox = styled(Checkbox)`
  width: 30px !important;
  height: 30px !important;
`

const enhance = compose(
  inject('store'),
  withState('expanded', 'setExpanded', true),
  observer
)

const Optionen = ({
  store,
  fileType,
  applyMapFilterToExport,
  client,
  expanded,
  setExpanded,
}: {
  store: Object,
  fileType: String,
  applyMapFilterToExport: Boolean,
  client: Object,
  expanded: Boolean,
  setExpanded: () => void,
}) => (
  <StyledCard>
    <StyledCardActions
      disableActionSpacing
      onClick={() => setExpanded(!expanded)}
    >
      <CardActionTitle>Optionen</CardActionTitle>
      <CardActionIconButton
        data-expanded={expanded}
        aria-expanded={expanded}
        aria-label="öffnen"
      >
        <Icon title={expanded ? 'schliessen' : 'öffnen'}>
          <ExpandMoreIcon />
        </Icon>
      </CardActionIconButton>
    </StyledCardActions>
    <Collapse in={expanded} timeout="auto" unmountOnExit>
      <StyledCardContent>
        <StyledFormControlLabel
          control={
            <StyledCheckbox
              checked={fileType === 'csv'}
              onChange={() => {
                client.mutate({
                  mutation: gql`
                    mutation setExportKey($key: String!, $value: Array!) {
                      setExportKey(key: $key, value: $value) @client {
                        export @client {
                          applyMapFilterToExport
                          fileType
                          __typename: Export
                        }
                      }
                    }
                  `,
                  variables: {
                    value: fileType === 'csv' ? 'xlsx' : 'csv',
                    key: 'fileType'
                  }
                })
              }}
              value={fileType}
              color="primary"
            />
          }
          label="Dateien im .csv-Format exportieren (Standard ist das xlsx-Format von Excel)"
        />
        <StyledFormControlLabel
          control={
            <StyledCheckbox
              checked={applyMapFilterToExport}
              onChange={() => {
                client.mutate({
                  mutation: gql`
                    mutation setExportKey($key: String!, $value: Array!) {
                      setExportKey(key: $key, value: $value) @client {
                        export @client {
                          applyMapFilterToExport
                          fileType
                          __typename: Export
                        }
                      }
                    }
                  `,
                  variables: {
                    value: !applyMapFilterToExport,
                    key: 'applyMapFilterToExport'
                  }
                })
              }}
              value={applyMapFilterToExport}
              color="primary"
            />
          }
          label={
            store.map.mapFilter.filter.features.length > 0
              ? 'Karten-Filter anwenden'
              : 'Karten-Filter anwenden (verfügbar, wenn ein Karten-Filter erstellt wurde)'
          }
          disabled={!(store.map.mapFilter.filter.features.length > 0)}
        />
      </StyledCardContent>
    </Collapse>
  </StyledCard>
)

export default enhance(Optionen)
