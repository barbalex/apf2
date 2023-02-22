import React, { useCallback, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import styled from '@emotion/styled'
import upperFirst from 'lodash/upperFirst'
import Button from '@mui/material/Button'
import SimpleBar from 'simplebar-react'
import ImageGallery from 'react-image-gallery'

import ErrorBoundary from '../ErrorBoundary'
import Error from '../Error'
import Spinner from '../Spinner'

import {
  apFile as apFileFragment,
  idealbiotopFile as idealbiotopFileFragment,
  popFile as popFileFragment,
  tpopFile as tpopFileFragment,
  tpopkontrFile as tpopkontrFileFragment,
  tpopmassnFile as tpopmassnFileFragment,
} from '../fragments'
import Uploader from '../Uploader'
import File from './File'
import 'react-image-gallery/styles/css/image-gallery.css'
import isImageFile from './isImageFile'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => (props.showfilter ? '#ffd3a7' : 'unset')};
  padding: 0 10px;
`
const Spacer = styled.div`
  height: 10px;
`
const ButtonsContainer = styled.div`
  display: flex;
  margin-top: 8px;
`
const LightboxButton = styled(Button)`
  margin-left: 10px !important;
  text-transform: none !important;
`

const fragmentObject = {
  ap: apFileFragment,
  idealbiotop: idealbiotopFileFragment,
  pop: popFileFragment,
  tpop: tpopFileFragment,
  tpopkontr: tpopkontrFileFragment,
  tpopmassn: tpopmassnFileFragment,
}

const Files = ({
  parentId = '99999999-9999-9999-9999-999999999999',
  parent,
  loadingParent,
}) => {
  const client = useApolloClient()

  const [lightboxIsOpen, setLightboxIsOpen] = useState(false)

  const queryName = `all${upperFirst(parent)}Files`
  const parentIdName = `${parent}Id`
  const fields = `${upperFirst(parent)}FileFields`
  const fragment = fragmentObject[parent]

  const query = gql`
  query FileQuery($parentId: UUID!) {
    ${queryName}(
      orderBy: NAME_ASC
      filter: { ${parentIdName}: { equalTo: $parentId } }
    ) {
      nodes {
        ...${fields}
      }
    }
  }
  ${fragment}
`
  const { data, error, loading, refetch } = useQuery(query, {
    variables: { parentId },
  })

  const files = data?.[`all${upperFirst(parent)}Files`].nodes ?? []

  const [uploaderId, setUploaderId] = useState(0)
  // console.log('Files, uploaderId:', uploaderId)
  const onChangeUploader = useCallback(
    async (info) => {
      if (info) {
        let responce
        try {
          responce = await client.mutate({
            mutation: gql`
              mutation insertFile {
                create${upperFirst(parent)}File(
                  input: {
                    ${parent}File: {
                      fileId: "${info.uuid}",
                      fileMimeType: "${info.mimeType}",
                      ${parent}Id: "${parentId}",
                      name: "${info.name}"
                    }
                  }
                ) {
                  ${parent}File {
                    ...${fields}
                  }
                }
              }
              ${fragment}
            `,
          })
        } catch (error) {
          return console.log(error)
          // TODO: add enqueNotification
          /*return store.enqueNotification({
              message: error.message,
              options: {
                variant: 'error',
              },
            })*/
        }
        console.log('File uploaded: ', { info, responce })
        refetch()
        // TODO: reinitiate uploader
        setUploaderId(uploaderId + 1)
        return null
      }
      setUploaderId(uploaderId + 1)
      return null
    },
    [client, fields, fragment, parent, parentId, refetch, uploaderId],
  )

  const images = files.filter((f) => isImageFile(f))
  const imageObjects = images.map((f) => ({
    original: `https://ucarecdn.com/${f.fileId}/-/resize/1200x/-/quality/lightest/${f.name}`,
    thumbnail: `https://ucarecdn.com/${f.fileId}/-/resize/250x/-/quality/lightest/${f.name}`,
    fullscreen: `https://ucarecdn.com/${f.fileId}/-/resize/1800x/-/quality/lightest/${f.name}`,
    originalAlt: f.beschreibung || '',
    thumbnailAlt: f.beschreibung || '',
    description: f.beschreibung || '',
    originalTitle: f.name || '',
    thumbnailTitle: f.name || '',
  }))
  const onClickLightboxButton = useCallback(
    () => setLightboxIsOpen(!lightboxIsOpen),
    [lightboxIsOpen],
  )

  if (loading || loadingParent) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <SimpleBar
      style={{
        maxHeight: '100%',
        height: '100%',
      }}
    >
      <ErrorBoundary>
        <Container>
          <ButtonsContainer>
            <Uploader id={uploaderId} onChange={onChangeUploader} />
            {!!images.length && (
              <LightboxButton
                color="primary"
                variant="outlined"
                onClick={onClickLightboxButton}
              >
                {lightboxIsOpen
                  ? 'Gallerie schliessen'
                  : 'Bilder in Gallerie öffnen'}
              </LightboxButton>
            )}
          </ButtonsContainer>
          {lightboxIsOpen && (
            <>
              <Spacer />
              <ImageGallery items={imageObjects} showPlayButton={false} />
            </>
          )}
          <Spacer />
          {files.map((file) => (
            <File
              key={file.fileId}
              file={file}
              parent={parent}
              refetch={refetch}
            />
          ))}
        </Container>
      </ErrorBoundary>
    </SimpleBar>
  )
}

export default observer(Files)
