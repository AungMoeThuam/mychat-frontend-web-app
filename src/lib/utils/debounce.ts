function debounce(callback: Function, timeout: number = 1000) {
  let id: any;
  return (...args: any[]) => {
    clearTimeout(id);
    id = setTimeout(() => callback(...args), timeout);
  };
}

export default debounce;
