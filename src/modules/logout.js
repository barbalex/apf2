export default async idb => {
  console.log("LOGGING OUT")
  idb.currentUser.clear()
  typeof window !== "undefined" && window.location.reload(false)
}
