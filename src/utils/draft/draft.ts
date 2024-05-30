const elementIsVisibleInViewport = (el: HTMLElement) => {
  if (!el) return "no loaded";
  const { top, left, bottom, right } = el.getBoundingClientRect();
  const { innerHeight, innerWidth } = window;
  return top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
};
