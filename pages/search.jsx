import { withIronSessionSsr } from "iron-session/next";
import Head from "next/head";
import Link from 'next/link'
import Image from 'next/image'
import sessionOptions from "../config/session";
import Header from '../components/header'
import { useState, useRef } from 'react'
import styles from '../styles/Search.module.css'
import Footer from "../components/footer";
import { set } from "mongoose";


//Get session information for the user
export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const { user } = req.session;
    const props = {};
    if (user) {
      props.user = req.session.user;
    }
    props.isLoggedIn = !!user;
    return { props };
  },
  sessionOptions
);


export default function Search(props) {
  const inputRef = useRef()
  const inputDivRef = useRef()
  const [query, setQuery] = useState("")
  const [drinks, setDrinks] = useState([])


  async function searchByIngredient(e) {
    e.preventDefault()
    console.log("ingredient search triggered")
    const res = await fetch(
      `https://www.thecocktaildb.com/api/json/v2/${process.env.API_KEY}/search.php?s=${query}` //HELP: How to access API key in .env.Local
    )
    if (res.status !== 200) return
    const data = await res.json()
    console.log("JSON Data: ", data)

    const drinksByIngredient = drinkPreviewFormatting(data)
    setDrinks(drinksByIngredient)
    console.log("drinks saved in state: ", drinks)
  }


  async function searchByName(e) {
    e.preventDefault()
    const res = await fetch(
      `https://www.thecocktaildb.com/api/json/v2/${process.env.API_KEY}/search.php?s=${query}` //HELP: How to access API key in .env.Local
    )
    if (res.status !== 200) return
    const data = await res.json()
    console.log("JSON Data: ", data)

    const drinksByName = drinkPreviewFormatting(data)

    setDrinks(drinksByName)
  }


   function drinkPreviewFormatting (data) {
    const drinkPreviewData = data.drinks.map((drink) => ({
      cocktailId: drink.idDrink,
      name: drink.strDrink,
      image: drink.strDrinkThumb
    }))

    console.log("Drink Preview Formatted Array: ", drinkPreviewData)

    return drinkPreviewData
  }

  console.log("drinks saved in state: ", drinks)

  return (
    <>
      <Head>
        <title>dRINK Search</title>
        <meta name="description" content="The Booker Search Page" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22></text></svg>" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <Header isLoggedIn={props.isLoggedIn} />

      <main>
        <h1 className={styles.title}>Drink Search</h1>
        <form className={styles.form}>
          <label htmlFor="drink-search">Search by ingredient:</label>
          <div ref={inputDivRef}>
            <input
              ref={inputRef}
              type="text"
              name="drink-search"
              id="drink-search"
              value={query}
              autoFocus={true}
              onChange={e => setQuery(e.target.value)}/>
            <button onClick={searchByIngredient} type="submit">Search by Ingredient</button>
            <button onClick={searchByName} type="submit">Search By Name</button>
          </div>
        </form>
      
      {
        drinks?.length
        ? <section className={styles.results}>
          {/* TODO: Render recipes with RecipePreview Component */}
          {drinks.map((drink, i) => (
            <DrinkPreview 
              key={i}
              id={drink.id} 
              name={drink.title} 
              image={drink.image}>
            </DrinkPreview>
          ))}
        </section>
        : <p className={styles.noResults}>No Drinks Found!</p>
      }
      </main>

      <Footer/>
    </>
  )
}

//Drink preview card
function DrinkPreview({id, name, image}) {
  const noImage = "/No_image_available.svg.png"
  return (
    <Link href={'/drink/' + id} className={styles.preview}>
      <Image src={image ? image : noImage} width="300" height="300" alt="picture"/>
      <span>{name}</span>
    </Link>
  )
}


  
  