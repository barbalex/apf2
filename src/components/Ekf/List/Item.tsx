import { useNavigate, useParams, useLocation } from 'react-router'

import styles from './Item.module.css'

export const Item = ({ projektCount, row }) => {
  const { search } = useLocation()
  const { ekfId, userId, ekfYear } = useParams()
  const navigate = useNavigate()
  const innerContainerHeight = projektCount > 1 ? 110 : 91

  const onClick = () =>
    navigate(`/Daten/Benutzer/${userId}/EKF/${ekfYear}/${row.id}${search}`)

  return (
    <div
      className={styles.outerContainer}
      onClick={onClick}
      style={{
        backgroundColor: ekfId === row.id ? 'rgb(255, 250, 198)' : 'unset',
        height: innerContainerHeight,
      }}
    >
      <div
        className={styles.innerContainer}
        style={{ height: innerContainerHeight }}
      >
        {projektCount > 1 && <div>{row.projekt}</div>}
        <div>{row.art}</div>
        <div>{row.pop}</div>
        <div>{row.tpop}</div>
      </div>
    </div>
  )
}
