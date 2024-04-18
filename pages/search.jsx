import { withIronSessionSsr } from "iron-session/next";
import Head from "next/head";
import Link from 'next/link'
import Image from 'next/image'
import sessionOptions from "../config/session";
import Header from '../components/header'
import { useState, useRef } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/Search.module.css'
import Footer from "../components/footer";
import { getDrinksByIngredient, getDrinksByName} from "../util/cocktails"


//Get session for the user/ /cocktail information from API
export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps( {req}, context ) {
    const { user } = req.session
    const props = {}
    
    if (user) {
      props.user = req.session.user
    }
    props.isLoggedIn = !!user

    const searchIngredient = context.query.i
    const searchName = context.query.n

    if(searchIngredient){
      console.log("context check triggered")
      const drinksByIngredient = await getDrinksByIngredient(searchIngredient) 
      props.drinks = drinksByIngredient
    }
    else if(searchName){
      const drinksByName = await getDrinksByName(searchName) 
      props.drinks = drinksByName
    }

    return { props }
  },
  sessionOptions
);


export default function Search(props) {
  const router = useRouter()
  const inputRef = useRef()
  const inputDivRef = useRef()
  const [query, setQuery] = useState("")
  const [drinks, setDrinks] = useState([])


  // Handler for form submission to refresh URL with ingredient query
  async function searchByIngredient(e) {
    e.preventDefault()
    console.log ("Query ingredient: ", query)
    if (!query.trim()) return 
    // const drinksByIngredient = await getDrinksByIngredient(query) 
    // setDrinks(drinksByIngredient)
    router.replace(router.pathname + `?i=${query}`)  //i = ingredient
  }

  async function searchByName(e) {
    e.preventDefault()
    if (!query.trim()) return
    console.log ("Query name: ", query)
    // const drinksByName = await getDrinksByName(query)
    // setDrinks(drinksByName)
    router.replace(router.pathname + `?n=${query}`) //n = name
  }

  if(props.drinks) {
    setDrinks(props.drinks)
  }  

  return (
    <>
      <Head>
        <title>Drink Search</title>
        <meta name="description" content="The Booker Search Page" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22></text></svg>" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <Header isLoggedIn={props.isLoggedIn} />

      <main>
        <h1 className={styles.title}>Drink Search</h1>
        <form className={styles.form}>
          <label htmlFor="drink-search">Search for Drink:</label>
          <div ref={inputDivRef}>
            <input
              ref={inputRef}
              type="text"
              name="drink-search"
              id="drink-search"
              value={query}
              autoFocus={true}
              onChange={e => setQuery(e.target.value)}/>
            <button onClick={searchByIngredient} type="submit">Search By Ingredient</button>
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


  
  