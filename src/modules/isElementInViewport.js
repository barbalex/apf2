// https://stackoverflow.com/a/7557433/712005
// Goal:
// Check if tree node is in viewport
// If not, IntoViewScroller will scroll to it
const isElementInViewport = (el) => {
  var rect = el.getBoundingClientRect()

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

export default isElementInViewport
