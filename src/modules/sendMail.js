// @flow
export default ({
  to,
  subject,
  body,
  cc,
}: {
  to: string,
  subject: string,
  body: string,
  cc: string,
}) => {
  const link = `mailto:${to}${cc ? `?cc=${cc}` : '?'}${
    subject ? `&subject=${subject}` : ''
  }${body ? `&body=${body}` : ''}`
  window.open(link)
}
