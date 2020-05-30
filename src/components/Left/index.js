import styles from './styles.module.css'
import { useDashboard } from '../../context'
import useZoom from '../../context/useZoom'

const DELTA = 2

function Item({ label, icon, onAction, type }) {
  const onClick = type === 'input[file]' ? undefined : onAction
  const inputFileElement = type === 'input[file]' && (
    <input accept="image/*" multiple onChange={onAction} type="file" />
  )

  return (
    <div className={styles.item} onClick={onClick}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.label}>
        {inputFileElement}
        {label}
      </div>
    </div>
  )
}

const getItem = (item) => (
  <Item
    icon={item.icon}
    key={item.label}
    label={item.label}
    onAction={item.action}
    type={item.type}
  />
)

function ZoomPercentage() {
  const { state, canvasRef } = useDashboard()

  if (!canvasRef.current) return ''

  const perOne = Math.pow(1.1, state.zoom)
  const perCent = (perOne * 100).toFixed(0) + '%'

  return (
    <div style={{ marginTop: 10 }} className={styles.label}>
      {perCent}
    </div>
  )
}

export default function Left() {
  const { dispatch } = useDashboard()
  const onZoom = useZoom()

  const globalList = [
    {
      label: 'Open',
      icon: '📂',
      type: 'input[file]',
      action: (e) => dispatch({ type: 'load', data: e.target.files }),
    },
    {
      label: 'Next',
      icon: '⇨',
      action: () => dispatch({ type: 'next' }),
    },
    {
      label: 'Prev',
      icon: '⇦',
      action: () => dispatch({ type: 'prev' }),
    },
    {
      label: 'Save',
      icon: '💾',
    },
  ].map(getItem)

  const imageMenuList = [
    {
      label: 'Create RectBox',
      icon: '🌠',
    },
    {
      label: 'Duplicate RectBox',
      icon: '📑',
    },
    {
      label: 'Delete RectBox',
      icon: '❌',
    },
    {
      label: 'Zoom in',
      icon: '🔍',
      action: () => onZoom(DELTA),
    },
    {
      label: 'Zoom out',
      icon: '🔍',
      action: () => onZoom(-DELTA),
    },
  ].map(getItem)

  return (
    <>
      {globalList}
      {imageMenuList}
      <ZoomPercentage />
    </>
  )
}
