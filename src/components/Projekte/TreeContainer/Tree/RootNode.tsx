import { observer } from 'mobx-react-lite'

export const RootNode = ({ fetcher }) => {
  const navData = fetcher?.()
  const Component = navData?.component

  if (!Component) return null

  return <Component menu={navData} />
}
