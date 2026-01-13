import { useParams } from 'react-router'

import { FilesRouter } from '../../../shared/Files/index.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'

export const Component = () => {
  const { tpopkontrId } = useParams()

  return (
    <>
      <FormTitle title="Dateien" />
      <FilesRouter
        parentId={tpopkontrId}
        parent="tpopkontr"
      />
    </>
  )
}
