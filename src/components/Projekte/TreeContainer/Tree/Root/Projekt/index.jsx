import Row from '../../Row'
import ApberuebersichtFolder from './ApberuebersichtFolder'
import ApFolder from './ApFolder'

const ProjektNode = ({ projekt, projectIsOpen }) => {
  const url = ['Projekte', projekt.id]
  const node = {
    nodeType: 'table',
    menuType: 'projekt',
    id: projekt.id,
    urlLabel: projekt.id,
    label: projekt.label,
    url,
    hasChildren: true,
  }

  return (
    <>
      <Row node={node} />
      {projectIsOpen && (
        <>
          <ApFolder
            projekt={projekt}
            count={projekt?.apsByProjId?.totalCount ?? 0}
          />
          <ApberuebersichtFolder
            projekt={projekt}
            count={projekt?.apberuebersichtsByProjId?.totalCount ?? 0}
          />
        </>
      )}
    </>
  )
}

export default ProjektNode
