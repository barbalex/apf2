import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer'
import '@cyntler/react-doc-viewer/dist/index.css'

interface Props {
  fileId: string
  name: string
  fileMimeType: string
  width: number
}

// this was separated into its own component to avoid loading the doc viewer and its dependencies
// until we know we need it, which is only for non-image/pdf files

export const DocViewerWrapper = ({
  fileId,
  name,
  fileMimeType,
  width,
}: Props) => (
  <DocViewer
    key={width}
    documents={[
      {
        uri: `https://ucarecdn.com/${fileId}/${name}`,
        mimeType: fileMimeType,
      },
    ]}
    renderers={DocViewerRenderers}
    config={{ header: { disableHeader: true } }}
    style={{ height: '100%' }}
    className="doc-viewer"
  />
)
