// seems not in use
import { useEffect } from 'react'

// custom Hook for automatic abortion on unmount or dependency change
// You might add onFailure for promise errors as well.
// source: https://stackoverflow.com/a/60907638/712005
export function useAsync<T>(
  asyncFn: () => Promise<T>,
  onSuccess: (data: T) => void,
) {
  useEffect(() => {
    let isActive = true
    asyncFn().then((data: T) => {
      if (isActive) onSuccess(data)
      else console.log('aborted setState on unmounted component')
    })
    return () => {
      isActive = false
    }
  }, [asyncFn, onSuccess])
}
