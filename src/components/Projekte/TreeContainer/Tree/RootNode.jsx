import { observer } from 'mobx-react-lite'

export const RootNode = observer(({ fetcher }) => {
  const res = fetcher?.()
  const navData = res?.navData

  if (!navData) return null

  return <navData.component menu={navData} />
})
