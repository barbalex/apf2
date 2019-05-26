import React, { useContext, useState, useEffect, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import gql from 'graphql-tag'
import { useApolloClient } from 'react-apollo-hooks'
import styled from 'styled-components'
import { FaTimes, FaDownload } from 'react-icons/fa'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import storeContext from '../../../storeContext'
import TextField from '../../shared/TextField'
import ErrorBoundary from '../ErrorBoundary'
import { idealbiotopFile as idealbiotopFileFragment } from '../fragments'
import isImageFile from './isImageFile'
import { upperFirst } from 'graphql-compose'

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  background-color: ${props => (props.showfilter ? '#ffd3a7' : 'unset')};
  width: 100%;
`
const Img = styled.img`
  margin-right: 10px;
  width: 80px;
  height: 50px;
  object-fit: contain;
  margin-bottom: 1rem;
`
const ImgReplacement = styled.div`
  min-width: 80px;
  margin-right: 10px;
  text-align: center;
  color: rgba(0, 0, 0, 0.38);
  font-size: 1rem;
  padding-top: 19px;
`
const DelIcon = styled(IconButton)`
  margin-bottom: 20px !important;
`
const DownloadIcon = styled(IconButton)`
  margin-bottom: 20px !important;
`
const Spacer = styled.div`
  min-width: 12px;
`
const DateiTypField = styled.div`
  min-width: 200px;
  flex-grow: 0;
`
const DateiNameField = styled.div`
  min-width: 215px;
  flex-grow: 0;
`
const BeschreibungField = styled.div`
  flex-grow: 1;
`
const MenuTitle = styled.h3`
  padding-top: 8px;
  padding-left: 15px;
  padding-right: 16px;
  padding-bottom: 0;
  margin-bottom: 3px;
  &:focus {
    outline: none;
  }
`

const fragmentObject = {
  idealbiotop: idealbiotopFileFragment,
}

const File = ({ file, parent, refetch }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)

  const [errors, setErrors] = useState({})

  const [delMenuAnchorEl, setDelMenuAnchorEl] = React.useState(null)
  const delMenuOpen = Boolean(delMenuAnchorEl)

  useEffect(() => setErrors({}), [file])

  const tableName = `${parent}File`

  const onClickDelete = useCallback(async () => {
    // 1. remove dataset
    try {
      const mutationName = `delete${upperFirst(parent)}FileById`
      await client.mutate({
        mutation: gql`
          mutation deleteDataset {
            ${mutationName}(
              input: {
                id: "${file.id}"
              }
            ) {
              ${tableName} {
                id
              }
            }
          }
        `,
      })
    } catch (error) {
      return console.log(error)
      // TODO: enque
      /*return store.enqueNotification({
        message: `Die Datei konnte nicht gelöscht werden: ${error.message}`,
        options: {
          variant: 'error',
        },
      })*/
    }
    refetch()
  }, [file])
  const onClickDownload = useCallback(
    () => window.open(`https://ucarecdn.com/${file.fileId}/-/inline/no/`),
    [file],
  )

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      const value = event.target.value || null
      try {
        let valueToSet
        if (value === undefined || value === null) {
          valueToSet = null
        } else {
          valueToSet = `"${value}"`
        }
        const mutationName = `update${upperFirst(parent)}FileById`
        const fields = `${upperFirst(parent)}FileFields`
        const fragment = fragmentObject[parent]
        await client.mutate({
          mutation: gql`
              mutation ${mutationName}(
                $id: uuid!
              ) {
                ${mutationName}(
                  input: {
                    id: $id
                    ${tableName}Patch: {
                      ${field}: ${valueToSet}
                    }
                  }
                ) {
                  ${tableName} {
                    ...${fields}
                  }
                }
              ${fragment}
            `,
          variables: {
            id: file.id,
          },
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
      refetch()
    },
    [file],
  )

  if (!file) return null

  const isImage = isImageFile(file)

  return (
    <ErrorBoundary>
      <Container>
        {isImage ? (
          <Img
            src={`https://ucarecdn.com/${
              file.fileId
            }/-/resize/80x/-/quality/lightest/${file.name}`}
          />
        ) : (
          <ImgReplacement>...</ImgReplacement>
        )}
        <DateiTypField>
          <TextField
            key={`${file.id}fileMimeType`}
            name="fileMimeType"
            label="Datei-Typ"
            value={file.fileMimeType}
            saveToDb={saveToDb}
            error={errors.fileMimeType}
            disabled
            schrinkLabel
          />
        </DateiTypField>
        <Spacer />
        <DateiNameField>
          <TextField
            key={`${file.id}name`}
            name="name"
            label="Datei-Name"
            value={file.name}
            saveToDb={saveToDb}
            error={errors.name}
            disabled
            schrinkLabel
          />
        </DateiNameField>
        <Spacer />
        <BeschreibungField>
          <TextField
            key={`${file.id}beschreibung`}
            name="beschreibung"
            label="Beschreibung"
            value={file.beschreibung}
            saveToDb={saveToDb}
            error={errors.beschreibung}
            multiLine
            schrinkLabel
          />
        </BeschreibungField>
        <DownloadIcon title="herunterladen" onClick={onClickDownload}>
          <FaDownload />
        </DownloadIcon>
        <DelIcon
          title="löschen"
          aria-label="löschen"
          aria-owns={delMenuOpen ? 'delMenu' : undefined}
          aria-haspopup="true"
          onClick={event => setDelMenuAnchorEl(event.currentTarget)}
        >
          <FaTimes />
        </DelIcon>
        <Menu
          id="delMenu"
          anchorEl={delMenuAnchorEl}
          open={delMenuOpen}
          onClose={() => setDelMenuAnchorEl(null)}
          PaperProps={{
            style: {
              maxHeight: 48 * 4.5,
              width: 120,
            },
          }}
        >
          <MenuTitle>löschen?</MenuTitle>
          <MenuItem onClick={onClickDelete}>ja</MenuItem>
          <MenuItem onClick={() => setDelMenuAnchorEl(null)}>nein</MenuItem>
        </Menu>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(File)
