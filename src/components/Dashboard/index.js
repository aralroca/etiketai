import Center from '../Center'
import Left from '../Left'
import Right from '../Right'
import { DashboardProvider } from '../../context'

import styles from './styles.module.css'

export default function Dashboard() {
  return (
    <DashboardProvider>
      <div className={styles.dashboard}>
        <div className={styles.left}>
          <Left />
        </div>
        <div className={styles.center}>
          <Center />
        </div>
        <div className={styles.right}>
          <Right />
        </div>
      </div>
    </DashboardProvider>
  )
}
