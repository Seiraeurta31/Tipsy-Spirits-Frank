import styles from "./style.module.css";
import Link from "next/link";
import useLogout from "../../hooks/useLogout";

export default function Header(props) {
  const logout = useLogout();
  return (
    <header>
      {props.isLoggedIn ? (
        <>
          <div className={styles.imgContainerHome}></div>

          <div className={styles.navLinksContainer}>
            <a href="/" className={styles.linkColor} > Home </a>
            <a href="/favorites" className={styles.linkColor} > Favorites </a>
            <a href="/search" className={styles.linkColor} > Search </a>
            <a onClick={logout} style={{ cursor: "pointer" }} className={styles.linkColor}>Logout</a>
          </div>
        </>
      ) : (
        <>
          <div className={styles.imgContainerWelcome}>
            <img></img>
          </div>
        </>
      )}
    </header>
  );
}


