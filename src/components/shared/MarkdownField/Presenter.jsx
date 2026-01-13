import MarkdownIt from 'markdown-it'

import { Label } from '../Label.jsx'
import styles from './Presenter.module.css'

const mdParser = new MarkdownIt({ breaks: true })

// setting tabIndex on Presenter to make it focusable
// see: https://stackoverflow.com/a/16261525/712005
export const Presenter = ({ value, label }) => (
  <div
    className={styles.container}
    tabIndex="0"
  >
    <Label label={label} />
    <div dangerouslySetInnerHTML={{ __html: mdParser.render(value || '') }} />
  </div>
)
