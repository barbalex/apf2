export interface FileNode {
  id: string
  fileId: string | null
  name: string | null
  beschreibung: string | null
  fileMimeType: string | null
}

export type FileParent =
  | 'ap'
  | 'idealbiotop'
  | 'pop'
  | 'tpop'
  | 'tpopkontr'
  | 'tpopmassn'

/** context passed through the files router outlet */
export interface FilesOutletContext {
  parent: FileParent
  files: FileNode[]
  refetch: () => void
}
