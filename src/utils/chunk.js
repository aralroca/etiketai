export default function chunk(arr, chunkSize) {
  const res = []

  for (var i = 0, len = arr.length; i < len; i += chunkSize) {
    res.push(arr.slice(i, i + chunkSize))
  }

  return res
}
