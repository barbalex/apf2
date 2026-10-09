import { useUsersNavData } from '../../../../modules/useUsersNavData.ts'

export const RootUsersNode = () => {
  const navData = useUsersNavData()
  const Component = navData?.component

  if (!Component) return null

  return <Component menu={navData} />
}
