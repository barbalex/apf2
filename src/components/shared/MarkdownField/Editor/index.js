import React, { lazy, Suspense } from 'react'

import Spinner from '../../Spinner'

const MarkdownField = lazy(() => import('./MarkdownField'))

// need to lazy import because react-markdown-editor-lite calls navigator which busts gatsby build
const MdField = (props) => (
  <Suspense fallback={<Spinner />}>
    <MarkdownField {...props} />
  </Suspense>
)

export default MdField
