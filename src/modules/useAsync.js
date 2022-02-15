import { useEffect } from 'react'

// custom Hook for automatic abortion on unmount or dependency change
// You might add onFailure for promise errors as well.
// source: https://stackoverflow.com/a/60907638/712005
function useAsync(asyncFn, onSuccess) {
  useEffect(() => {
    let isActive = true
    asyncFn().then((data) => {
      if (isActive) onSuccess(data)
      else console.log('aborted setState on unmounted component')
    })
    return () => {
      isActive = false
    }
  }, [asyncFn, onSuccess])
}

export default useAsync
