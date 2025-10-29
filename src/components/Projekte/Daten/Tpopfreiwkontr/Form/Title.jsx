import { container } from './Title.module.css'

export const Title = ({ row }) => {
  const year = row?.jahr ?? new Date().getFullYear()

  return (
    <div
      className={container}
    >{`Erfolgskontrolle Artenschutz Flora ${year}`}</div>
  )
}
