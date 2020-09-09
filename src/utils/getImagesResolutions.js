export default function getImagesResolutions(files) {
  return Promise.all(files.map(file => {
    return new Promise((res, rej) => {
      const img = new Image()
      img.src = URL.createObjectURL(file)
      img.onload = () => {
        res({ w: img.width, h: img.height })
        URL.revokeObjectURL(img.src)
      }
      img.onerror = rej
    })
  }))
}
