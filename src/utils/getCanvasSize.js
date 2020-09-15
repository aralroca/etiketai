export default function getCanvasSize() {
  if (typeof window === 'undefined') return {}

  return {
    width: window.innerWidth - 420,
    height: window.innerHeight,
  }
}
