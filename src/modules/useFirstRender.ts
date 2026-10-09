import { useRef } from 'react'

export const useFirstRender = () => {
  const ref = useRef(true)
  // reading and writing the ref during render is what makes this hook work
  // eslint-disable-next-line react-hooks/refs
  const firstRender = ref.current
  // eslint-disable-next-line react-hooks/refs
  ref.current = false

  return firstRender
}
