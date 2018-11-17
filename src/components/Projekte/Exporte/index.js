import React, { useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import compose from 'recompose/compose'

import FormTitle from '../../shared/FormTitle'
import Tipps from './Tipps'
import Ap from './Ap'
import Populationen from './Populationen'
import Teilpopulationen from './Teilpopulationen'
import Kontrollen from './Kontrollen'
import Massnahmen from './Massnahmen'
import Beobachtungen from './Beobachtungen'
import Anwendung from './Anwendung'
import Optionen from './Optionen'
import ErrorBoundary from '../../shared/ErrorBoundary'
import withLocalData from './withLocalData'
import mobxStoreContext from '../../../mobxStoreContext'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  @media print {
    display: none !important;
  }
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow-x: auto;
  height: 100%;
  padding-bottom: 10px;
  overflow: auto !important;
`
const ExporteContainer = styled.div`
  border-left-color: rgb(46, 125, 50);
  border-left-width: 1px;
  border-left-style: solid;
  border-right-color: rgb(46, 125, 50);
  border-right-width: 1px;
  border-right-style: solid;
  height: 100%;
`

const enhance = compose(withLocalData)

const Exporte = ({ localData }: { localData: Object }) => {
  if (localData.error) return `Fehler: ${localData.error.message}`

  const mobxStore = useContext(mobxStoreContext)
  const { mapFilter } = mobxStore

  const applyMapFilterToExport = get(localData, 'export.applyMapFilterToExport')
  const fileType = get(localData, 'export.fileType')

  return (
    <ExporteContainer>
      <ErrorBoundary>
        <Container>
          <FormTitle title="Exporte" />
          <FieldsContainer>
            <Optionen
              mapFilter={mapFilter}
              applyMapFilterToExport={applyMapFilterToExport}
              fileType={fileType}
            />
            <Tipps />
            <Ap
              applyMapFilterToExport={applyMapFilterToExport}
              fileType={fileType}
              mapFilter={mapFilter}
            />
            <Populationen
              mapFilter={mapFilter}
              applyMapFilterToExport={applyMapFilterToExport}
              fileType={fileType}
            />
            <Teilpopulationen
              mapFilter={mapFilter}
              applyMapFilterToExport={applyMapFilterToExport}
              fileType={fileType}
            />
            <Kontrollen
              mapFilter={mapFilter}
              applyMapFilterToExport={applyMapFilterToExport}
              fileType={fileType}
            />
            <Massnahmen
              mapFilter={mapFilter}
              applyMapFilterToExport={applyMapFilterToExport}
              fileType={fileType}
            />
            <Beobachtungen
              mapFilter={mapFilter}
              applyMapFilterToExport={applyMapFilterToExport}
              fileType={fileType}
            />
            <Anwendung />
          </FieldsContainer>
        </Container>
      </ErrorBoundary>
    </ExporteContainer>
  )
}

export default enhance(Exporte)
