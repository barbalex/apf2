
import { useRootNavData } from '../../../../modules/useRootNavData.ts'
import { Nav } from '../Nav.tsx'

export const Menu = () => {
  const navData = useRootNavData()

  return (
    <>
      {navData.menus.map((item, index) => (
        <Nav
          key={item.id}
          item={item}
          baseUrl={navData.url}
          needsBorderRight={index < navData.menus.length - 1}
        />
      ))}
    </>
  )
}
