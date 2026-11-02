import type { ReactNode } from 'react'
import Linkify from 'linkify-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import styles from './Field.module.css'

interface FieldProps {
  id: string
  label: string
  value: ReactNode
}

export const Field = ({ id, label, value }: FieldProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={styles.rowClass}
      {...attributes}
      {...listeners}
    >
      <div className={styles.labelClass}>{label}</div>
      <div className={styles.valueClass}>
        <Linkify options={{ target: '_blank' }}>{value}</Linkify>
      </div>
    </div>
  )
}
