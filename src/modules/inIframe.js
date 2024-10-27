// https://stackoverflow.com/a/326076/712005
export const inIframe = () => {
  try {
    return window.self !== window.top
  } catch (e) {
    return true
  }
}
