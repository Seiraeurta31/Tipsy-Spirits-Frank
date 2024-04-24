import styles from "./style.module.css";
import Link from "next/link";
import useLogout from "../../hooks/useLogout";

export default function Header(props) {
  const logout = useLogout();
  return (
    <header className={styles.headerContainer}>
      {props.isLoggedIn ? (
        <>
          <Link href="/">Home</Link>
          <Link href="/favorites">Favorites</Link>
          <Link href="/search">Search</Link>
          <a onClick={logout} style={{ cursor: "pointer" }}>Logout</a> 
        </>
      ) : (
        <>  
        </>
      )}
    </header>
  );
}


