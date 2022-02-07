export const throttle = (fn: Function, limit: number) => {
  let inThrottle: boolean;
  return (...args: any[]) => {
    const context = this;
    if (!inThrottle) {
      fn.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
