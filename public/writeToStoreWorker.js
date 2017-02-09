// @flow
self.onmessage = function (event) {
  console.log(`message received from main script:`, event.data)
  postMessage(`hi from worker, I just got this message from you: ${event.data}`)
}
