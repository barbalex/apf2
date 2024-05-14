import React, { useContext } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'

import Checkbox from '../shared/Checkbox'
import storeContext from '../../../../../storeContext.js'

const LayerDiv = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 24px;
  padding-top: 4px;
  &:not(:last-of-type) {
    border-bottom: 1px solid #ececec;
  }
  /*
   * z-index is needed because leaflet
   * sets high one for controls
   */
  z-index: 2000;
  /*
   * font-size is lost while moving a layer
   * because it is inherited from higher up
   */
  font-size: 12px;
`
const Comments = styled.div`
  padding-left: 21px;
`
const Comment1 = styled.span`
  font-weight: 700;
  ${(props) => props['data-color'] && `color: ${props['data-color']};`}
`
const Comment2 = styled.span`
  padding-left: 3px;
`

const ShowForMultipleAps = () => {
  const { apId } = useParams()

  const store = useContext(storeContext)
  const { showApfLayersForMultipleAps, toggleShowApfLayersForMultipleAps } =
    store
  const { apGqlFilterForTree } = store.tree

  const { data } = useQuery(
    gql`
      query TreeRootQuery($apsFilter: ApFilter!) {
        allAps(filter: $apsFilter) {
          totalCount
        }
      }
    `,
    {
      variables: {
        apsFilter: apGqlFilterForTree,
      },
    },
  )

  const apsCount = data?.allAps?.totalCount ?? 0

  const comment = apsCount > 1 ? `${apsCount} Arten aktiv.` : ''
  const color =
    apsCount > 5
      ? 'rgba(228, 89, 0, 1)'
      : apsCount > 50
      ? 'rgba(228, 0, 0, 1)'
      : ''

  return (
    <LayerDiv>
      <Checkbox
        value={showApfLayersForMultipleAps}
        label="Layer auch anzeigen, wenn mehr als eine Art aktiv ist"
        checked={showApfLayersForMultipleAps}
        onChange={toggleShowApfLayersForMultipleAps}
      />
      {!apId && showApfLayersForMultipleAps && (
        <>
          <Comments>
            <Comment1 data-color={color}>{comment}</Comment1>
            <Comment2>Je mehr, desto langsamer wird die App</Comment2>
          </Comments>
        </>
      )}
    </LayerDiv>
  )
}

export default observer(ShowForMultipleAps)
