// @flow
import React from 'react'
import { GeoJSON } from 'react-leaflet'
import axios from 'axios'
import gql from 'graphql-tag'

import popupFromProperties from './popupFromProperties'
import staticFilesBaseUrl from '../../../../modules/staticFilesBaseUrl'

const style = () => ({ fill: false, color: 'red', weight: 1 })
const onEachFeature = (feature, layer) => {
  if (feature.properties) {
    layer.bindPopup(popupFromProperties(feature.properties))
  }
}

const fetchDetailplaene = (client, treeName) => {
  const baseURL = staticFilesBaseUrl
    const url = `/detailplaeneWgs84neu.json`
    axios
      .get(url, { baseURL })
      .then(({ data }) => {
        console.log('Detailplaene, data fetched:', data)
        client.mutate({
          mutation: gql`
            mutation setTreeMapKey($value: String!, $tree: String!, $key: String!) {
              setTreeMapKey(tree: $tree, key: $key, value: $value) @client {
                tree @client {
                  map {
                    detailplaene @client
                    __typename: Map
                  }
                  __typename: Tree
                }
                tree2 @client {
                  map {
                    detailplaene @client
                    __typename: Map
                  }
                  __typename: Tree2
                }
              }
            }
          `,
          variables: {
            value: data,
            tree: treeName,
            key: 'detailplaene'
          }
        })
      })
}

const DetailplaeneLayer = ({ client, treeName, detailplaene }) => {
  !detailplaene && fetchDetailplaene(client, treeName)

  if (!detailplaene) return null
  return (
    <GeoJSON
      data={detailplaene}
      style={style}
      onEachFeature={onEachFeature}
    />
  )
}

export default DetailplaeneLayer
