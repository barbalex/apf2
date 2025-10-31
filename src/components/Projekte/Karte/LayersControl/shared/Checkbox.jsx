import { container, input, label as labelClass } from './Checkbox.module.css'

export const Checkbox = ({ value, label, checked, onChange }) => (
  <div className={container}>
    <label className={labelClass}>
      <input
        type="checkbox"
        value={value}
        checked={checked}
        onChange={onChange}
        className={input}
      />
      {label}
    </label>
  </div>
)
