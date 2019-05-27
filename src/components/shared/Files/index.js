import React, { useCallback, useState } from 'react'
import { observer } from 'mobx-react-lite'
import gql from 'graphql-tag'
import { useApolloClient, useQuery } from 'react-apollo-hooks'
import styled from 'styled-components'
import get from 'lodash/get'
import upperFirst from 'lodash/upperFirst'
import Lightbox from 'react-image-lightbox'
import Button from '@material-ui/core/Button'

import ErrorBoundary from '../ErrorBoundary'
import { idealbiotopFile as idealbiotopFileFragment } from '../fragments'
import Uploader from '../Uploader'
import File from './File'
import 'react-image-lightbox/style.css'
import isImageFile from './isImageFile'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => (props.showfilter ? '#ffd3a7' : 'unset')};
`
const Spacer = styled.div`
  height: 10px;
`
const ButtonsContainer = styled.div`
  display: flex;
`
const LightboxButton = styled(Button)`
  margin-left: 10px !important;
  text-transform: none !important;
`

const fragmentObject = {
  idealbiotop: idealbiotopFileFragment,
}

const Files = ({ parentId, parent }) => {
  const client = useApolloClient()

  const [imageIndex, setImageIndex] = useState(0)
  const [lightboxIsOpen, setLightboxIsOpen] = useState(false)

  const queryName = `all${upperFirst(parent)}Files`
  const parentIdName = `${parent}Id`
  const fields = `${upperFirst(parent)}FileFields`
  const fragment = fragmentObject[parent]
  const queryObject = {
    idealbiotop: gql`
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
    `,
  }

  const query = queryObject[parent]
  const { data, error, loading, refetch } = useQuery(query, {
    variables: { parentId },
  })

  const files = get(data, `all${upperFirst(parent)}Files.nodes`, [])
  console.log({ data, files })

  const onChangeUploader = useCallback(
    file => {
      if (file) {
        file.done(async info => {
          try {
            await client.mutate({
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
          //console.log('File uploaded: ', { info, responce })
          refetch()
          // TODO: reinitiate uploader
        })
      }
    },
    [parentId, refetch],
  )

  const images = files.filter(f => isImageFile(f))
  const imageUrls = images.map(
    f =>
      `https://ucarecdn.com/${f.fileId}/-/resize/1200x/-/quality/lightest/${
        f.name
      }`,
  )
  const onClickLightboxButton = useCallback(() => setLightboxIsOpen(true), [])
  const onCloseLightboxRequest = useCallback(() => setLightboxIsOpen(false), [])
  const onMovePrevImageRequest = useCallback(
    () => setImageIndex((imageIndex + images.length - 1) % images.length),
    [imageIndex, images.length],
  )
  const onMoveNextImageRequest = useCallback(
    () => setImageIndex((imageIndex + 1) % images.length),
    [imageIndex, images.length],
  )

  if (loading) {
    return 'Lade...'
  }

  if (error) {
    return (
      <Container>{`Fehler beim Laden der Daten: ${error.message}`}</Container>
    )
  }

  return (
    <ErrorBoundary>
      <Container>
        <ButtonsContainer>
          <Uploader
            id="file"
            name="file"
            onChange={onChangeUploader}
            content="test"
          />
          {!!images.length && (
            <LightboxButton
              color="primary"
              variant="outlined"
              onClick={onClickLightboxButton}
            >
              Bilder in Gallerie öffnen
            </LightboxButton>
          )}
        </ButtonsContainer>
        {lightboxIsOpen && (
          <Lightbox
            mainSrc={imageUrls[imageIndex]}
            nextSrc={imageUrls[(imageIndex + 1) % images.length]}
            prevSrc={
              imageUrls[(imageIndex + images.length - 1) % images.length]
            }
            onCloseRequest={onCloseLightboxRequest}
            onMovePrevRequest={onMovePrevImageRequest}
            onMoveNextRequest={onMoveNextImageRequest}
            imageTitle={images[imageIndex].name || ''}
            imageCaption={images[imageIndex].beschreibung || ''}
            wrapperClassName="lightbox"
            nextLabel="Nächstes Bild"
            prevLabel="Voriges Bild"
          />
        )}
        <Spacer />
        {files.map(file => (
          <File
            key={file.fileId}
            file={file}
            parent={parent}
            refetch={refetch}
          />
        ))}
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Files)
