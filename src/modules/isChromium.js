// source: https://stackoverflow.com/a/9851769/712005
// and https://social.msdn.microsoft.com/Forums/en-US/edde0150-9478-4ca6-ba0f-9e084b5a4719/how-to-detect-microsoft-edge-chromium-chrome-ie-browser-using-javascript?forum=iewebdevelopment

export default () => {
  if (typeof window === 'undefined') return

  // Opera 8.0+
  var isOpera =
    (!!window.opr && !!window.opr.addons) ||
    !!window.opera ||
    navigator.userAgent.indexOf(' OPR/') >= 0

  // Chrome 1 - 71
  var isChrome =
    !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)

  // Blink engine detection
  var isBlink = (isChrome || isOpera) && !!window.CSS

  const agent = window.navigator.userAgent.toLowerCase()
  const isEdgeChromium = agent.indexOf('edg') > -1

  return isBlink || isEdgeChromium
}
