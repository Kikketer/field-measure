import logo from '../assets/fav.png'
import styles from './Loader.module.css'

export const Loader = () => {
  return (
    <div class="vertical-align">
      <span>Setting up the shot...</span>
      <img class={styles.Ball} src={logo} />
    </div>
  )
}
