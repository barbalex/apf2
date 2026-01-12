import { FaTimes } from 'react-icons/fa'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import { KontrolljahrField } from './KontrolljahrField.jsx'
import { KontrolljahrFieldEmpty } from './KontrolljahrFieldEmpty.jsx'

import styles from './Kontrolljahre.module.css'

export const Kontrolljahre = ({ kontrolljahre = [], saveToDb, refetch }) => {
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
        <Tooltip title={`${kontrolljahreSorted[index]} entfernen`}>
          <IconButton
            aria-label={`${kontrolljahreSorted[index]} entfernen`}
            onClick={async () => {
              const newVal = [...kontrolljahreSorted]
              newVal.splice(index, 1)
              await saveToDb({
                target: { name: 'kontrolljahre', value: newVal },
              })
              refetch()
            }}
            className={styles.delIcon}
          >
            <FaTimes />
          </IconButton>
        </Tooltip>
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
