function useLocalStorage(key: string) {
  function getStorage() {
    //authToken
    let token = localStorage.getItem(key);

    if (token !== null) return JSON.parse(token);

    return null;
  }
  function setStorage(value: any) {
    console.log(typeof value !== "string");
    if (typeof value === "string") localStorage.setItem(key, value);
    else localStorage.setItem(key, JSON.stringify(value));
  }

  function removeStorage() {
    localStorage.removeItem(key);
  }
  return { getStorage, setStorage, removeStorage };
}
export default useLocalStorage;
