import styles from "./style.module.css";
import Image from "next/image";
import Link from "next/link";
import useLogout from "../../hooks/useLogout";
// import welcomeImg  from "../../public/Welcome.jpg";

export default function Header(props) {
  const logout = useLogout();
  return (
    <header className={styles.headerContainer}>
      {props.isLoggedIn ? (
        <>
          <div className={styles.navLinkContainer}>
            <Link href="/">Home</Link>
            <Link href="/favorites">Favorites</Link>
            <Link href="/search">Search</Link>
            <a onClick={logout} style={{ cursor: "pointer" }}>Logout</a> 
          </div>
          <div className={styles.headerImage}>
            <img src= {props.image} ></img>
          </div>
          
        </>
      ) : (
        <>  
          <div className={styles.headerImage}>
            <img src={"../Welcome.jpg"} ></img>
          </div>
        </>
      )}
    </header>
  );
}


