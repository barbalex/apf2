import { Suspense } from 'react'
import { observer } from 'mobx-react-lite'

export const RootNode = observer(({ fetcher }) => {
  const res = fetcher?.()
  const navData = res?.navData

  return (
    <Suspense fallback={null}>
      <navData.component menu={navData} />
    </Suspense>
  )
})
