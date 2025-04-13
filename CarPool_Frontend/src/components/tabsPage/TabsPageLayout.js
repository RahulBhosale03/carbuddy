import styles from './tabsPageLayout.module.css'
import { NavLink, Outlet } from "react-router-dom";

export default function TabsPageLayout() {
    return (
      <div className={styles.tabsPageLayout}>
        <div className={styles.pageContent}>
          <Outlet />
        </div>
        <div className={styles.tabBar}>
          <div className={`${styles.brand}`}>
            <NavLink to="/" className={styles.tabInactive}>
              <span>CarPool</span>
            </NavLink>
          </div>
          <NavLink to="/" className={({ isActive }) =>isActive ? styles.tabActive : styles.tabInactive}>
            <div className={styles.tab}>
              <i className="fi fi-rr-search"></i>
              <span>Search</span>
            </div>
          </NavLink>
          <NavLink to="/publish" className={({ isActive }) =>isActive ? styles.tabActive : styles.tabInactive}>
            <div className={styles.tab}>
              <i className="fi fi-tr-add"></i>
              <span>Publish</span>
            </div>
          </NavLink>
          <NavLink to="/myrides" className={({ isActive }) =>isActive ? styles.tabActive : styles.tabInactive}>
            <div className={styles.tab}>
              <i className="fi fi-tr-time-half-past"></i>
              <span>My Rides</span>
            </div>
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) =>isActive ? styles.tabActive : styles.tabInactive}>
            <div className={styles.tab}>
              <i className="fi fi-tr-circle-user"></i>
              <span>Profile</span>
            </div>
          </NavLink>
        </div>
      </div>
    );
}