// https://stackoverflow.com/a/326076/712005
const inIframe = () => {
  try {
    return window.self !== window.top
  } catch (e) {
    return true
  }
}

export default inIframe
