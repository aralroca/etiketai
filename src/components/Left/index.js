import { useEffect } from 'react'

import Modal from '../Modal'
import download from '../../utils/download'
import getPascalVocLabels from '../../utils/getPascalVocLabels'
import getYoloLabels from '../../utils/getYoloLabels'
import useZoom from '../../context/useZoom'
import { useDashboard } from '../../context'

import styles from './styles.module.css'
import useRedraw from '../../context/useRedraw'

const DELTA = 2

export default function Left() {
  const { state, dispatch } = useDashboard()
  const onZoom = useZoom()
  const hasFiles = state.files.length > 0
  const hasSelectedBox = state.selectedBox > -1
  const isFirst = state.fileIndex === 0
  const isLast = state.fileIndex === state.files.length - 1
  const hasBoxes = Object.values(state.allBoxes).flat().length > 0

  useEffect(() => {
    if (state.saved || !hasBoxes) return

    function unload(e) {
      const msg =
        'Do you really want to close? Changes that you made may not be saved.'
      e.returnValue = msg
      return msg
    }

    window.addEventListener('beforeunload', unload)
    return () => window.removeEventListener('beforeunload', unload)
  }, [state.saved, hasBoxes])

  const globalList = [
    {
      label: 'Open',
      icon: '📂',
      type: 'input[file]',
      action: (e) =>
        e.target.files.length > 0 &&
        dispatch({ type: 'load', data: e.target.files }),
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
      action: () => dispatch({ type: 'toggle-save-modal' }),
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
      <SaveModal />
    </>
  )
}

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

function SaveModal() {
  const { state, boxes, boxNames, dispatch } = useDashboard()
  const { size } = state
  const close = () => dispatch({ type: 'toggle-save-modal' })

  async function onSave(e) {
    e.preventDefault()
    const [format, files] = Array.prototype.slice
      .call(e.target)
      .filter((f) => f.checked)
      .map((f) => f.value)

    const all = files === 'all'

    const boxesToDownload = all
      ? state.files.map((_, i) => state.allBoxes[i])
      : [boxes]

    const namesOfBoxes = all
      ? state.files.map((_, i) => state.allBoxesNames[i])
      : [boxNames]

    const relatedFiles = all ? state.files : [state.files[state.fileIndex]]

    const labels =
      format === 'xml'
        ? await getPascalVocLabels(
            boxesToDownload,
            relatedFiles,
            namesOfBoxes,
            size
          )
        : await getYoloLabels(boxesToDownload, relatedFiles, namesOfBoxes, size)

    labels.forEach(({ dataurl, filename }) => download(dataurl, filename))
    dispatch({ type: 'save' })
    close()
  }

  return (
    <Modal title="Save labels" open={state.isSaveModalOpen} onClose={close}>
      <form onSubmit={onSave}>
        <p>Format:</p>

        <div>
          <input type="radio" id="xml" name="format" value="xml" checked />
          <label for="xml">PascalVOC (.xml)</label>
        </div>

        <div>
          <input type="radio" id="txt" name="format" value="txt" />
          <label for="txt">YOLO (.txt)</label>
        </div>

        <p>Labels to download:</p>

        <div>
          <input
            type="radio"
            id="current"
            name="files"
            value="current"
            checked
          />
          <label for="current">Current file</label>
        </div>

        <div>
          <input type="radio" id="all" name="files" value="all" />
          <label for="all">All files</label>
        </div>

        <div className={styles.buttons}>
          <button>Download</button>
          <button type="button" onClick={close}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  )
}
