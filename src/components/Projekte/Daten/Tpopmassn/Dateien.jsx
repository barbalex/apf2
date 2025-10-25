import { useParams } from 'react-router'

import { FilesRouter } from '../../../shared/Files/index.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'

export const Component = () => {
  const { tpopmassnId } = useParams()

  return (
    <>
      <FormTitle title="Dateien" />
      <FilesRouter
        parentId={tpopmassnId}
        parent="tpopmassn"
      />
    </>
  )
}
