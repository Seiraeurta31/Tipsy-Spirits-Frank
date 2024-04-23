import styles from "./style.module.css";
import Link from "next/link";
import useLogout from "../../../03-DB_and_Auth/mongo-auth-example/hooks/useLogout";

export default function Header(props) {
  const logout = useLogout();
  return (
    <header >
      {props.isLoggedIn ? (
        <>
          <p>
            <Link href="/">Home</Link>
          </p>
          <div >
            <p>Welcome, {props.username}!</p>
            <div >
              <Link href="/search" >
                <h2>Search for a drink</h2>
              </Link>
            </div>
            <p onClick={logout} >
              Logout
            </p>
          </div>
        </>
      ) : (
        <>
          <p>
            <Link href="/">Home</Link>
          </p>
          <p>
            <Link href="/login">Login</Link>
          </p>
        </>
      )}
    </header>
  );
}

