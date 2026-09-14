import { useEffect, useRef } from 'react'

export const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T | undefined>(undefined)
  useEffect(() => {
    ref.current = value //assign the value of ref to the argument
  }, [value]) //this code will run when the value of 'value' changes
  return ref.current //in the end, return the current ref value.
}
