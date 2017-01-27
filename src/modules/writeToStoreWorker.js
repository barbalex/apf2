self.onmessage = function getGoing() {
  // console.log(`message received from main script, event:`, event)
  postMessage(`hi from worker`)
}
