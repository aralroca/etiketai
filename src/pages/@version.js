import packageJSON from '../../package.json'

export default function Version() {
  return packageJSON.version || 'No version found'
}
