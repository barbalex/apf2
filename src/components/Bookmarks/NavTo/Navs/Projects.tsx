import { Nav } from '../Nav.tsx'
import { navData } from './projectsNavData.ts'

export const Menu = () => {
  return navData.menus.map((item, index) => (
    <Nav
      key={item.id}
      item={item}
      baseUrl={navData.url}
      needsBorderRight={index < navData.menus.length - 1}
    />
  ))
}
