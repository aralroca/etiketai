import { useMemo } from 'react'

import styles from './styles.module.css'
import { useDashboard } from '../../context'

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

export default function Left() {
  const { dispatch } = useDashboard()
  const globalList = useMemo(
    () =>
      [
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
      ].map(getItem),
    []
  )

  const imageMenuList = useMemo(
    () =>
      [
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
        },
        {
          label: 'Zoom out',
          icon: '🔍',
        },
      ].map(getItem),
    []
  )

  return (
    <>
      {globalList}
      {imageMenuList}
    </>
  )
}
