// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import TextField from 'material-ui/TextField'
import Linkify from 'react-linkify'
import styled from 'styled-components'
import { Card, CardText } from 'material-ui/Card'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'

import FormTitle from '../../shared/FormTitle'
import appBaseUrl from '../../../modules/appBaseUrl'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
`
const StyledCard = styled(Card)`
  margin-bottom: 10px !important;
`
const Title = styled.div`font-weight: bold;`
const FilterField = styled(TextField)`
  margin-top: -15px;
  margin-bottom: 10px;
`
const linkifyProperties = {
  target: '_blank',
  style: {
    color: 'inherit',
    fontWeight: 100,
  },
}

const enhance = compose(
  inject('store'),
  withState('berichtjahr', 'changeBerichtjahr', new Date().getFullYear()),
  withState('filter', 'changeFilter', ''),
  withState('messages', 'changeMessages', []),
  withHandlers({
    onChangeBerichtjahr: props => (event, val) => {
      const { changeBerichtjahr, changeMessages, store, tree } = props
      console.log('Qk, onChangeBerichtjahr, jahr:', val)
      changeBerichtjahr(val)
      if ((isNaN(val) && val.length === 4) || (!isNaN(val) && val > 1000)) {
        store.setQk({ tree: tree })
        console.log('Qk, onChangeBerichtjahr, fetching qk')
        // reset messages
        changeMessages([])
        // call fetchQk and pass it changeMessages
        setTimeout(() => store.fetchQk({ tree: props.tree }))
      }
    },
    onChangeFilter: props => (event, val) => props.changeFilter(val),
  }),
  withLifecycle({
    onDidMount({ store }) {
      // call fetchQk and pass it changeMessages
    },
  }),
  observer
)

const Qk = ({
  store,
  tree,
  berichtjahr,
  messages,
  filter,
  onChangeBerichtjahr,
  onChangeFilter,
}: {
  store: Object,
  tree: Object,
  berichtjahr: number,
  messages: Array<Object>,
  filter: string,
  onChangeBerichtjahr: () => void,
  onChangeFilter: () => void,
}) => {
  const apArtId = tree.activeNodes.ap

  const messagesFiltered = filter
    ? messages.filter(m => m.hw.toLowerCase().includes(filter.toLowerCase()))
    : messages

  return (
    <Container>
      <FormTitle tree={tree} title="Qualitätskontrollen" />
      <FieldsContainer>
        <TextField
          floatingLabelText="Berichtjahr"
          type="number"
          value={berichtjahr}
          fullWidth
          onChange={onChangeBerichtjahr}
        />
        <FilterField
          floatingLabelText="nach Typ filtern"
          type="text"
          value={filter || ''}
          fullWidth
          onChange={onChangeFilter}
        />
        {messagesFiltered.map((m, index) =>
          <StyledCard key={index}>
            <CardText>
              <Title>
                {m.hw}
              </Title>
              <div>
                <Linkify properties={linkifyProperties}>
                  {m.url.map((u, i) =>
                    <div key={i}>
                      {`${appBaseUrl}/${u.join('/')}`}
                    </div>
                  )}
                </Linkify>
              </div>
            </CardText>
          </StyledCard>
        )}
      </FieldsContainer>
    </Container>
  )
}

export default enhance(Qk)
