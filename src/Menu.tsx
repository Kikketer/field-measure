import { Component } from 'solid-js'
import { FieldSize } from './types'

type MenuProps = {
  isOpen: () => boolean
  onSetFieldSize: (size: FieldSize) => void
  onClose: () => void
}

export const Menu: Component<MenuProps> = ({
  isOpen,
  onSetFieldSize,
  onClose,
}) => {
  return (
    <dialog open={isOpen()}>
      <article>
        <header>
          <button aria-label="Close" class="close" onClick={onClose}></button>
          Settings
        </header>
        <label for="field-size">Field Size</label>
        <select id="field-size" required>
          <option value={FieldSize.full} selected>
            Full Size
          </option>
          <option value={FieldSize.elevenThirteen}>11-13</option>
          <option value={FieldSize.nineTen}>9-10</option>
          <option value={FieldSize.sevenEight}>7-8</option>
        </select>
        <label for="width">Custom Width</label>
        <input type="text" id="width"></input>
        <label for="length">Custom Length</label>
        <input type="text" id="length"></input>
      </article>
    </dialog>
  )
}
