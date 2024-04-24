import styles from "./style.module.css";
import Link from "next/link";
import useLogout from "../../../03-DB_and_Auth/mongo-auth-example/hooks/useLogout";

export default function Header(props) {
  const logout = useLogout();
  return (
    <header >

      {props.isLoggedIn ? (
        <>
        <div classname={styles.navbar} >
          <div classname={styles.img_container}>
            <img></img>
          </div>

          <div classname={styles.navLinks_container}> 
            <a href="/" classname={styles.link}>Home</a>
            <a href="/favorites" classname={styles.link}>Favorites</a>
            <a href="/search" classname={styles.link}>Search</a>
            <a onClick={logout} classname={styles.link}>Logout</a>
          </div>
        </div>
        

          {/* <div >
            <Link href="/search" >
              <h2>Search for a drink</h2>
            </Link>
          </div>
          <p>
            <Link href="/">Home</Link>
          </p>
          <p>Welcome, {props.username}!</p>
          <div >
            <Link href="/search" >
              <h2>Search for a drink</h2>
            </Link>
          </div>
          <p onClick={logout} >
            Logout
          </p>
          </div> */}    
        </>
      ) : (
        <>
          <div classname={styles.img_container}>
            <img></img>
          </div>
          
        </>
      )}
    </header>
  );
}

