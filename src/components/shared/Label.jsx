import { labelClass } from './Label.module.css'

export const Label = ({ label, color = 'rgba(0, 0, 0, 0.5)' }) => (
  <div
    style={{ color }}
    className={labelClass}
  >
    {label}
  </div>
)
