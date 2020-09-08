import styles from './styles.module.css'
import { useDashboard } from '../../context'
import useZoom from '../../context/useZoom'

const DELTA = 2

function Item({ label, icon, onAction, type, disabled }) {
  const onClick = type === 'input[file]' || disabled ? undefined : onAction
  const disabledClass = disabled ? styles.disabled : ''
  const inputFileElement = type === 'input[file]' && (
    <input accept="image/*" multiple onChange={onAction} type="file" />
  )

  return (
    <div className={`${styles.item} ${disabledClass}`} onClick={onClick}>
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
    disabled={item.disabled}
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
  const { state, boxes, dispatch } = useDashboard()
  const onZoom = useZoom()
  const hasFiles = state.files.length > 0
  const hasSelectedBox = state.selectedBox > -1
  const isFirst = state.fileIndex === 0
  const isLast = state.fileIndex === state.files.length - 1
  const hasBoxes = boxes.length > 0

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
      disabled: !hasFiles || isLast,
    },
    {
      label: 'Prev',
      icon: '⇦',
      action: () => dispatch({ type: 'prev' }),
      disabled: !hasFiles || isFirst,
    },
    {
      label: 'Save',
      icon: '💾',
      disabled: !hasFiles || !hasBoxes,
    },
  ].map(getItem)

  const imageMenuList = [
    {
      label: 'Duplicate RectBox',
      icon: '📑',
      disabled: !hasFiles || !hasSelectedBox,
      action: () => dispatch({ type: 'duplicate-box' }),
    },
    {
      label: 'Delete RectBox',
      icon: '❌',
      disabled: !hasFiles || !hasSelectedBox,
      action: () => dispatch({ type: 'remove-box' }),
    },
    {
      label: 'Zoom in',
      icon: '🔍',
      disabled: !hasFiles,
      action: () => onZoom(DELTA),
    },
    {
      label: 'Zoom out',
      icon: '🔍',
      disabled: !hasFiles,
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
