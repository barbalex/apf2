import { memo, useState, useCallback, useEffect, useContext } from 'react'
import styled from '@emotion/styled'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'
import { jwtDecode } from 'jwt-decode'
import { useQueryClient } from '@tanstack/react-query'

import { StringToCopyOnlyButton } from '../../../../shared/StringToCopyOnlyButton.jsx'
import { Title } from './Title.jsx'
import { Headdata } from './Headdata/index.jsx'
import { Besttime } from './Besttime.jsx'
import { DateField } from './Date.jsx'
import { Map } from './Map.jsx'
import { Cover } from './Cover.jsx'
import { More } from './More.jsx'
import { Danger } from './Danger.jsx'
import { Remarks } from './Remarks.jsx'
import { EkfRemarks } from './EkfRemarks.jsx'
import { Files } from './Files.jsx'
import { Count } from './Count/index.jsx'
import { Verification } from './Verification.jsx'
import { Image } from './Image.jsx'
import { MobxContext } from '../../../../../mobxContext.js'
import { ifIsNumericAsNumber } from '../../../../../modules/ifIsNumericAsNumber.js'
import {
  adresse as adresseFragment,
  pop as popFragment,
  tpop as tpopFragment,
  tpopfreiwkontr as tpopfreiwkontrFragment,
  tpopkontrzaehlEinheitWerte as tpopkontrzaehlEinheitWerteFragment,
} from '../../../../shared/fragments.js'

const FormContainer = styled.div`
  padding: 10px;
  box-sizing: border-box;
  container-type: inline-size;
`
const GridContainer = styled.div`
  display: grid;
  @container (max-width: 600px) {
    grid-template-areas:
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
      'verification';
    grid-template-columns: 1fr;
  }
  @container (min-width: 600px) and (max-width: 800px) {
    grid-template-areas:
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
      'verification verification';
    grid-template-columns: repeat(2, 1fr);
  }
  @container (min-width: 800px) {
    grid-template-areas:
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
      'verification verification verification verification verification verification';
    grid-template-columns: repeat(6, 1fr);
  }
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

export const Form = memo(
  observer(({ data, refetch, row, apId }) => {
    const client = useApolloClient()
    const queryClient = useQueryClient()

    const store = useContext(MobxContext)
    const { isPrint, user } = store
    const { dataFilterSetValue } = store.tree
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
    const zaehls =
      data?.tpopkontrById?.tpopkontrzaehlsByTpopkontrId?.nodes ?? []
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
      async (event) => {
        const field = event.target.name
        const value = ifIsNumericAsNumber(event.target.value)
        /**
         * enable passing two values
         * with same update
         */
        const variables = {
          id: row.id,
          [field]: value,
          changedBy: user.name,
        }
        let field2
        if (field === 'datum') field2 = 'jahr'
        let value2
        if (field === 'datum') {
          // this broke 13.2.2019
          // value2 = !!value ? +format(new Date(value), 'yyyy') : null
          // value can be null so check if substring method exists
          value2 = value && value.substring ? +value.substring(0, 4) : value
        }
        if (field2) variables[field2] = value2
        try {
          await client.mutate({
            mutation: gql`
            mutation updateTpopkontrForEkf(
              $id: UUID!
                $${field}: ${fieldTypes[field]}
                ${field === 'jahr' ? '$datum: Date' : ''}
                ${field === 'datum' ? '$jahr: Int' : ''}
              $changedBy: String
            ) {
              updateTpopkontrById(
                input: {
                  id: $id
                  tpopkontrPatch: {
                      ${field}: $${field}
                      ${field === 'jahr' ? 'datum: $datum' : ''}
                      ${field === 'datum' ? 'jahr: $jahr' : ''}
                    changedBy: $changedBy
                  }
                }
              ) {
                tpopkontr {
                  ...TpopfreiwkontrFields
                  adresseByBearbeiter {
                    ...AdresseFields
                    usersByAdresseId {
                      totalCount
                    }
                  }
                  tpopByTpopId {
                    ...TpopFields
                    popByPopId {
                      ...PopFields
                      apByApId {
                        id
                        ekzaehleinheitsByApId {
                          nodes {
                            id
                            tpopkontrzaehlEinheitWerteByZaehleinheitId {
                              ...TpopkontrzaehlEinheitWerteFields
                            }
                          }
                        }
                      }
                    }
                  }
                  tpopkontrzaehlsByTpopkontrId {
                    nodes {
                      id
                      anzahl
                      einheit
                    }
                  }
                }
              }
            }
            ${adresseFragment}
            ${popFragment}
            ${tpopFragment}
            ${tpopfreiwkontrFragment}
            ${tpopkontrzaehlEinheitWerteFragment}
          `,
            variables,
          })
        } catch (error) {
          return setErrors({ [field]: error.message })
        }
        setErrors({})
        queryClient.invalidateQueries({
          queryKey: [`treeTpopfreiwkontr`],
        })
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [
        row.id,
        row.typ,
        row.jahr,
        row.datum,
        row.bemerkungen,
        row.flaecheUeberprueft,
        row.deckungVegetation,
        row.deckungNackterBoden,
        row.deckungApArt,
        row.vegetationshoeheMaximum,
        row.vegetationshoeheMittel,
        row.gefaehrdung,
        row.tpopId,
        row.bearbeiter,
        row.planVorhanden,
        row.jungpflanzenVorhanden,
        row.apberNichtRelevant,
        row.apberNichtRelevantGrund,
        row.ekfBemerkungen,
        row.tpopByTpopId,
        row.tpopkontrzaehlsByTpopkontrId,
        user.name,
        dataFilterSetValue,
        client,
        store.tree,
        queryClient,
      ],
    )

    useEffect(() => {
      setErrors({})
    }, [row.id])

    return (
      <FormContainer>
        <GridContainer>
          <Title row={row} />
          <Headdata
            pop={pop}
            tpop={tpop}
            row={row}
          />
          <Besttime row={row} />
          <DateField
            saveToDb={saveToDb}
            row={row}
            errors={errors}
          />
          <Map
            saveToDb={saveToDb}
            row={row}
            errors={errors}
          />
          <Image
            key={apId}
            apId={apId}
            artname={artname}
          />
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
            />
          )}
          <Cover
            saveToDb={saveToDb}
            row={row}
            errors={errors}
          />
          <More
            saveToDb={saveToDb}
            row={row}
            errors={errors}
          />
          <Danger
            saveToDb={saveToDb}
            row={row}
            errors={errors}
          />
          <Remarks
            saveToDb={saveToDb}
            row={row}
            errors={errors}
          />
          {((isPrint && ekfBemerkungen) || !isPrint) && (
            <EkfRemarks
              saveToDb={saveToDb}
              row={row}
              errors={errors}
            />
          )}
          {!isPrint && false && <Files row={row} />}
          {!isPrint && !isFreiwillig && (
            <Verification
              saveToDb={saveToDb}
              row={row}
              errors={errors}
            />
          )}
        </GridContainer>
        {!isPrint && !isFreiwillig && (
          <StringToCopyOnlyButton
            text={row.id}
            label="GUID"
          />
        )}
        {!isPrint && <div style={{ height: '64px' }} />}
      </FormContainer>
    )
  }),
)
