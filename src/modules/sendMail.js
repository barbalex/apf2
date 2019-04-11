export default ({ to, subject, body, cc }) => {
  const link = `mailto:${to}${cc ? `?cc=${cc}` : '?'}${
    subject ? `&subject=${subject}` : ''
  }${body ? `&body=${encodeURIComponent(body)}` : ''}`
  window.open(link)
}
