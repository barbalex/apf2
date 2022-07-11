import React, { useState, useCallback, useEffect, useContext } from 'react'
import styled from 'styled-components'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'
import jwtDecode from 'jwt-decode'

import StringToCopy from '../../../shared/StringToCopyOnlyButton'
import Title from './Title'
import Headdata from './Headdata'
import Besttime from './Besttime'
import Date from './Date'
import Map from './Map'
import Cover from './Cover'
import More from './More'
import Danger from './Danger'
import Remarks from './Remarks'
import EkfRemarks from './EkfRemarks'
import Files from './Files'
import Count from './Count'
import Verification from './Verification'
import Image from './Image'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import {
  adresse as adresseFragment,
  pop as popFragment,
  tpop as tpopFragment,
  tpopfreiwkontr as tpopfreiwkontrFragment,
  tpopkontrzaehlEinheitWerte as tpopkontrzaehlEinheitWerteFragment,
} from '../../../shared/fragments'

const FormContainer = styled.div`
  padding: 10px;
  width: 100%;
`
const GridContainer = styled.div`
  display: grid;
  grid-template-areas: ${(props) => {
    const { width } = props
    if (width < 600) {
      return `
        'title'
        'image'
        'headdata'
        'besttime'
        'date'
        'map'
        'count1'
        'count2'
        'count3'
        'cover'
        'more'
        'danger'
        'remarks'
        'ekfRemarks'
        'files'
        'verification'
      `
    }
    if (width < 800) {
      return `
        'title title'
        'image image'
        'headdata headdata'
        'besttime besttime'
        'date map'
        'count1 count1'
        'count2 count2'
        'count3 count3'
        'cover cover'
        'more more'
        'danger danger'
        'remarks remarks'
        'ekfRemarks ekfRemarks'
        'files files'
        'verification verification'
      `
    }
    return `
      'title title title image image image'
      'headdata headdata headdata image image image'
      'besttime besttime besttime image image image'
      'date date map image image image'
      'count1 count1 count2 count2 count3 count3'
      'cover cover cover more more more'
      'danger danger danger danger danger danger'
      'remarks remarks remarks remarks remarks remarks'
      'ekfRemarks ekfRemarks ekfRemarks ekfRemarks ekfRemarks ekfRemarks'
      'files files files files files files'
      'verification verification verification verification verification verification'
    `
  }};
  grid-template-columns: ${(props) => {
    const { width } = props
    if (width < 600) return '1fr'
    if (width < 800) return 'repeat(2, 1fr)'
    return 'repeat(6, 1fr)'
  }};
  grid-column-gap: 5px;
  grid-row-gap: 5px;
  justify-items: stretch;
  align-items: stretch;
  justify-content: stretch;
  box-sizing: border-box;
  border-collapse: collapse;
  @media print {
    grid-template-areas:
      'title title title image image image'
      'headdata headdata headdata image image image'
      'besttime besttime besttime image image image'
      'date date map image image image'
      'count1 count1 count2 count2 count3 count3'
      'cover cover cover more more more'
      'danger danger danger danger danger danger'
      'remarks remarks remarks remarks remarks remarks'
      'ekfRemarks ekfRemarks ekfRemarks ekfRemarks ekfRemarks ekfRemarks';
    grid-template-columns: repeat(6, 1fr);
  }
`
const CountHint = styled.div`
  grid-area: 5 / 1 / 5 / 7;
  color: red;
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 10px;
`

const fieldTypes = {
  typ: 'String',
  datum: 'Date',
  jahr: 'Int',
  bemerkungen: 'String',
  flaecheUeberprueft: 'Int',
  deckungVegetation: 'Int',
  deckungNackterBoden: 'Int',
  deckungApArt: 'Int',
  vegetationshoeheMaximum: 'Int',
  vegetationshoeheMittel: 'Int',
  gefaehrdung: 'String',
  tpopId: 'UUID',
  bearbeiter: 'UUID',
  planVorhanden: 'Boolean',
  jungpflanzenVorhanden: 'Boolean',
  apberNichtRelevant: 'Boolean',
  apberNichtRelevantGrund: 'String',
  ekfBemerkungen: 'String',
}

const TpopfreiwkontrForm = ({
  treeName,
  showFilter = false,
  data,
  refetch,
  row,
  apId,
}) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { dataFilterSetValue, isPrint, view, user } = store
  const { formWidth: width } = store[treeName]
  const { token } = user
  const role = token ? jwtDecode(token).role : null

  const [errors, setErrors] = useState({})

  const ekzaehleinheitsOriginal =
    data?.tpopkontrById?.tpopByTpopId?.popByPopId?.apByApId
      ?.ekzaehleinheitsByApId?.nodes ?? []
  const ekzaehleinheits = ekzaehleinheitsOriginal
    .map((n) => n?.tpopkontrzaehlEinheitWerteByZaehleinheitId ?? {})
    // remove null values stemming from efkzaehleinheit without zaehleinheit_id
    .filter((n) => n !== null)
  const zaehls = data?.tpopkontrById?.tpopkontrzaehlsByTpopkontrId?.nodes ?? []
  const zaehlsSorted = sortBy(zaehls, (z) => {
    const ekzaehleinheitOriginal = ekzaehleinheitsOriginal.find(
      (e) => e.tpopkontrzaehlEinheitWerteByZaehleinheitId.code === z.einheit,
    )
    if (!ekzaehleinheitOriginal) return 999
    return ekzaehleinheitOriginal.sort || 999
  })
  const zaehls1 = zaehlsSorted[0]
  const zaehls2 = zaehlsSorted[1]
  const zaehls3 = zaehlsSorted[2]
  const zaehl1WasAttributed =
    zaehls1 && (zaehls1.anzahl || zaehls1.anzahl === 0 || zaehls1.einheit)
  const zaehl2ShowNew =
    zaehl1WasAttributed && !zaehls2 && ekzaehleinheits.length > 1
  const zaehl1ShowEmpty =
    ekzaehleinheits.length === 0 && zaehlsSorted.length === 0
  const zaehl2ShowEmpty =
    (!zaehl1WasAttributed && !zaehls2) || ekzaehleinheits.length < 2
  const zaehl2WasAttributed =
    zaehl1WasAttributed &&
    zaehls2 &&
    (zaehls2.anzahl || zaehls2.anzahl === 0 || zaehls2.einheit)
  const zaehl3ShowNew =
    zaehl2WasAttributed && !zaehls3 && ekzaehleinheits.length > 2
  const zaehl3ShowEmpty =
    (!zaehl2WasAttributed && !zaehls3) || ekzaehleinheits.length < 3
  const einheitsUsed = zaehlsSorted
    .filter((n) => !!n.einheit)
    .map((n) => n.einheit)
  const isFreiwillig = role === 'apflora_freiwillig'

  const artname =
    row?.tpopByTpopId?.popByPopId?.apByApId?.aeTaxonomyByArtId?.artname ?? ''
  const pop = row?.tpopByTpopId?.popByPopId ?? {}
  const tpop = row?.tpopByTpopId ?? {}
  const { ekfBemerkungen } = row

  const saveToDb = useCallback(
    async (event) =>
      dataFilterSetValue({
        treeName,
        table: 'tpopfreiwkontr',
        key: event.target.name,
        value: ifIsNumericAsNumber(event.target.value),
      }),
    [dataFilterSetValue, treeName],
  )

  useEffect(() => {
    setErrors({})
  }, [row.id])

  return (
    <FormContainer>
      <GridContainer width={width}>
        <Title row={row} />
        <Headdata pop={pop} tpop={tpop} row={row} treeName={treeName} />
        <Besttime row={row} />
        <Date saveToDb={saveToDb} row={row} errors={errors} />
        <Map
          saveToDb={saveToDb}
          row={row}
          errors={errors}
          showFilter={showFilter}
        />
        {!showFilter && (
          <>
            <Image key={apId} apId={apId} artname={artname} />
            {zaehls1 && (
              <Count
                key={zaehls1.id}
                id={zaehls1.id}
                tpopkontrId={row.id}
                nr="1"
                refetch={refetch}
                einheitsUsed={einheitsUsed}
                ekzaehleinheits={ekzaehleinheits}
                ekzaehleinheitsOriginal={ekzaehleinheitsOriginal}
                treeName={treeName}
              />
            )}
            {zaehl1ShowEmpty && (
              <CountHint>
                Sie müssen auf Ebene Art EK-Zähleinheiten definieren, um hier
                Zählungen erfassen zu können.
              </CountHint>
            )}
            {zaehls2 && (
              <Count
                key={zaehls2.id}
                id={zaehls2.id}
                tpopkontrId={row.id}
                nr="2"
                refetch={refetch}
                einheitsUsed={einheitsUsed}
                ekzaehleinheits={ekzaehleinheits}
                ekzaehleinheitsOriginal={ekzaehleinheitsOriginal}
                treeName={treeName}
              />
            )}
            {zaehl2ShowNew && (
              <Count
                id={null}
                tpopkontrId={row.id}
                nr="2"
                showNew
                refetch={refetch}
                einheitsUsed={einheitsUsed}
                ekzaehleinheits={ekzaehleinheits}
                ekzaehleinheitsOriginal={ekzaehleinheitsOriginal}
                treeName={treeName}
              />
            )}
            {zaehl2ShowEmpty && !zaehl1ShowEmpty && (
              <Count
                id={null}
                tpopkontrId={row.id}
                nr="2"
                showEmpty
                showNew
                refetch={refetch}
                einheitsUsed={einheitsUsed}
                ekzaehleinheits={ekzaehleinheits}
                ekzaehleinheitsOriginal={ekzaehleinheitsOriginal}
                treeName={treeName}
              />
            )}
            {zaehls3 && (
              <Count
                key={zaehls3.id}
                id={zaehls3.id}
                tpopkontrId={row.id}
                nr="3"
                refetch={refetch}
                einheitsUsed={einheitsUsed}
                ekzaehleinheits={ekzaehleinheits}
                ekzaehleinheitsOriginal={ekzaehleinheitsOriginal}
                treeName={treeName}
              />
            )}
            {zaehl3ShowNew && (
              <Count
                id={null}
                tpopkontrId={row.id}
                nr="3"
                showNew
                refetch={refetch}
                einheitsUsed={einheitsUsed}
                ekzaehleinheits={ekzaehleinheits}
                ekzaehleinheitsOriginal={ekzaehleinheitsOriginal}
                treeName={treeName}
              />
            )}
            {zaehl3ShowEmpty && !zaehl2ShowEmpty && (
              <Count
                id={null}
                tpopkontrId={row.id}
                nr="3"
                showEmpty
                showNew
                refetch={refetch}
                einheitsUsed={einheitsUsed}
                ekzaehleinheits={ekzaehleinheits}
                ekzaehleinheitsOriginal={ekzaehleinheitsOriginal}
                treeName={treeName}
              />
            )}
          </>
        )}
        <Cover saveToDb={saveToDb} row={row} errors={errors} />
        <More saveToDb={saveToDb} row={row} errors={errors} />
        <Danger saveToDb={saveToDb} row={row} errors={errors} />
        <Remarks saveToDb={saveToDb} row={row} errors={errors} />
        {((isPrint && ekfBemerkungen) || !isPrint) && (
          <EkfRemarks saveToDb={saveToDb} row={row} errors={errors} />
        )}
        {!isPrint && !showFilter && <Files row={row} />}
        {!isPrint && !isFreiwillig && !(view === 'ekf') && (
          <Verification saveToDb={saveToDb} row={row} errors={errors} />
        )}
      </GridContainer>
      {!showFilter && !isPrint && !isFreiwillig && !(view === 'ekf') && (
        <StringToCopy text={row.id} label="GUID" />
      )}
      {!isPrint && <div style={{ height: '64px' }} />}
    </FormContainer>
  )
}

export default observer(TpopfreiwkontrForm)
