import { input, label as labelClass } from './Radio.module.css'

export const Radio = ({ name, value, label, checked, onChange }) => (
  <label className={labelClass}>
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className={input}
    />
    {label}
  </label>
)
