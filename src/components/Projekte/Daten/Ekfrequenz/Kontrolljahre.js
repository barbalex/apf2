import React from 'react'
import { FaTimes } from 'react-icons/fa'
import IconButton from '@mui/material/IconButton'
import styled from 'styled-components'

import KontrolljahrField from './KontrolljahrField'
import KontrolljahrFieldEmpty from './KontrolljahrFieldEmpty'

const DelIcon = styled(IconButton)`
  font-size: 1rem !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
`

const Kontrolljahre = ({ kontrolljahre = [], saveToDb, refetch }) => {
  const kontrolljahreSorted = [...kontrolljahre].sort(
    (a, b) => (a ?? 999999) - b,
  )

  return [
    kontrolljahreSorted.map((kontrolljahr, index) => (
      <div key={index}>
        <KontrolljahrField
          saveToDb={saveToDb}
          index={index}
          kontrolljahre={kontrolljahreSorted}
          refetch={refetch}
        />
        <DelIcon
          title={`${kontrolljahreSorted[index]} entfernen`}
          aria-label={`${kontrolljahreSorted[index]} entfernen`}
          onClick={async () => {
            const newVal = [...kontrolljahreSorted]
            newVal.splice(index, 1)
            await saveToDb({
              target: { name: 'kontrolljahre', value: newVal },
            })
            refetch()
          }}
        >
          <FaTimes />
        </DelIcon>
      </div>
    )),
    <KontrolljahrFieldEmpty
      key={kontrolljahre.length}
      saveToDb={saveToDb}
      kontrolljahre={kontrolljahreSorted}
      refetch={refetch}
    />,
  ]
}

export default Kontrolljahre
