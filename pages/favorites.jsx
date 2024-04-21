import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";
import Footer from "../components/footer";
import db from '../db'
import useLogout from "../hooks/useLogout";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    const props = {};
    if (user) {
      props.user = req.session.user;
      props.isLoggedIn = true;
    } else {
      props.isLoggedIn = false;
    }

    const allDrinks = await db.drink.getAllFavoriteDrinks(user._id)
    props.allDrinks = allDrinks

    return { props };
  },
  sessionOptions
);

export default function Favorites(props) {
  const router = useRouter();
  const logout = useLogout();
  const drinks = props.allDrinks

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props.user.username} />

      <main className={styles.main}>
        <h1 className={styles.title}>
          Favorites Page!
        </h1>
        <div className={styles.grid}>
          <Link href="/search" className={styles.card}>
            <h2>Search for a drink</h2>
          </Link>
        </div>
      
        {
        //If drins exist, render drink components with data
        drinks?.length
        ? <section className={styles.results}>
          <div> 
            {drinks.map((drink, i) => (
              <FavoriteDrink 
                key={i}
                id={drink.favoritesId} 
                name={drink.name} 
                image={drink.image}>
              </FavoriteDrink>
            ))}
          </div>
          
        </section>
        //If no drinks found, display message
        : <p className={styles.noResults}>No Drinks Found!</p>
      }

        <div className={styles.grid}>
          <Link href="/" className={styles.card}>
            <h2>Home</h2>
          </Link>
          <div
            onClick={logout}
            style={{ cursor: "pointer" }}
            className={styles.card}
          >
            <h2>Logout</h2>
          </div>
        </div>
      </main>

      <Footer/>
       
    </div>
  );
}


function FavoriteDrink({id, name, image}) {
  const noImage = "/No_image_available.svg.png"
  return (
      <Link href={'/drink/' + id} className={styles.preview}>
        <h1>{name}</h1>
        <Image src={image ? image : noImage} width="300" height="300" alt="picture"/>
        <span></span>
      </Link>
    
  )
}
