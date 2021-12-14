import React, { useCallback, useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'
import styled from 'styled-components'
import { FaTimes, FaDownload } from 'react-icons/fa'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { Formik, Form } from 'formik'
import upperFirst from 'lodash/upperFirst'

import ErrorBoundary from '../ErrorBoundary'
import TextField from '../TextField'
import {
  apFile as apFileFragment,
  idealbiotopFile as idealbiotopFileFragment,
  popFile as popFileFragment,
  tpopFile as tpopFileFragment,
  tpopkontrFile as tpopkontrFileFragment,
  tpopmassnFile as tpopmassnFileFragment,
} from '../fragments'
import isImageFile from './isImageFile'
import ifIsNumericAsNumber from '../../../modules/ifIsNumericAsNumber'
import storeContext from '../../../storeContext'

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  background-color: ${(props) => (props.showfilter ? '#ffd3a7' : 'unset')};
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
  ap: apFileFragment,
  idealbiotop: idealbiotopFileFragment,
  pop: popFileFragment,
  tpop: tpopFileFragment,
  tpopkontr: tpopkontrFileFragment,
  tpopmassn: tpopmassnFileFragment,
}

const File = ({ file, parent, refetch }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)

  const [fieldErrors, setFieldErrors] = useState({})

  const [delMenuAnchorEl, setDelMenuAnchorEl] = React.useState(null)
  const delMenuOpen = Boolean(delMenuAnchorEl)

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
  }, [client, file.id, parent, refetch, tableName])
  const onClickDownload = useCallback(
    () => window.open(`https://ucarecdn.com/${file.fileId}/-/inline/no/`),
    [file],
  )

  const saveToDb = useCallback(
    async (event) => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value)

      const variables = {
        id: file.id,
        [field]: value,
        changedBy: store.user.name,
      }
      try {
        const mutationName = `update${upperFirst(parent)}FileById`
        const fields = `${upperFirst(parent)}FileFields`
        const fragment = fragmentObject[parent]
        const parentId = `${parent}Id`
        await client.mutate({
          mutation: gql`
              mutation UpdateFile(
                $id: UUID!
                $${parentId}: UUID
                $fileId: UUID
                $fileMimeType: String
                $name: String
                $beschreibung: String
              ) {
                ${mutationName}(
                  input: {
                    id: $id
                    ${tableName}Patch: {
                      id: $id
                      ${parentId}: $${parentId}
                      fileId: $fileId
                      fileMimeType: $fileMimeType
                      name: $name
                      beschreibung: $beschreibung
                    }
                  }
                ) {
                  ${tableName} {
                    ...${fields}
                  }
                }
              }
              ${fragment}
            `,
          variables,
        })
      } catch (error) {
        return setFieldErrors({ [field]: error.message })
      }
      setFieldErrors({})
      refetch()
    },
    [client, file.id, parent, refetch, store.user.name, tableName],
  )

  if (!file) return null

  const isImage = isImageFile(file)

  return (
    <ErrorBoundary>
      <Container>
        {isImage ? (
          <Img
            src={`https://ucarecdn.com/${file.fileId}/-/resize/80x/-/quality/lightest/${file.name}`}
          />
        ) : (
          <ImgReplacement>...</ImgReplacement>
        )}
        <DateiTypField>
          <TextField
            name="fileMimeType"
            label="Datei-Typ"
            disabled
            schrinkLabel
            value={file.fileMimeType}
            saveToDb={saveToDb}
            error={fieldErrors.fileMimeType}
          />
        </DateiTypField>
        <Spacer />
        <DateiNameField>
          <TextField
            name="name"
            label="Datei-Name"
            disabled
            schrinkLabel
            value={file.name}
            saveToDb={saveToDb}
            error={fieldErrors.name}
          />
        </DateiNameField>
        <Spacer />
        <BeschreibungField>
          <TextField
            name="beschreibung"
            label="Beschreibung"
            multiLine
            schrinkLabel
            value={file.beschreibung}
            saveToDb={saveToDb}
            error={fieldErrors.beschreibung}
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
          onClick={(event) => setDelMenuAnchorEl(event.currentTarget)}
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
