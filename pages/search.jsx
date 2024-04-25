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
import { getDrinksByIngredient, getDrinksByName} from "../util/drinks"


//Get Request from server
export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({req, query}) {

    //GET user info from req
    const { user } = req.session
    const props = {}
    let searchedDrinks = []

    if (user) {
      props.user = req.session.user
    }
    props.isLoggedIn = !!user

    //If ingredient query exists, GET drinks by ingredient from external API
    if(query.i != undefined){
      searchedDrinks = await getDrinksByIngredient(query.i)

      if(searchedDrinks){
        props.drinks = searchedDrinks
      } 

      props.drinks = searchedDrinks
    }

    //If name query exists, GET drinks by name from external API
    if(query.n != undefined){
      searchedDrinks = await getDrinksByName(query.n) 
      if(searchedDrinks){
        props.drinks = searchedDrinks
      }  
    }
      
    return { props }

  },
  sessionOptions
);


//FrontEnd SEARCH page HTML with helper functions
export default function Search(props) {
  const router = useRouter()
  const inputRef = useRef()
  const [query, setQuery] = useState("")
  const drinks = props.drinks //an array of drinks


  // Handler for ingredient form submission to refresh URL with ingredient query
  async function searchByIngredient(e) {
    e.preventDefault()
    if (!query.trim()) return 

    router.replace(router.pathname + `?i=${query}`)  //i = ingredient
  }

  // Handler for name form submission to refresh URL with name query
  async function searchByName(e) {
    e.preventDefault()
    if (!query.trim()) return

    router.replace(router.pathname + `?n=${query}`) //n = name
  }

  return (
    <>
      <Head>
        <title>Drink Search</title>
        <meta name="description" content="The Tipsy Spirits Search Page" /> 
      </Head>

      <Header isLoggedIn={props.isLoggedIn} image={"/Favorites.jpg"}/>

      <main className={styles.main}>
        <h1 className={styles.title}>Drink Search</h1>
        <form className={styles.form}>
          <label htmlFor="drink-search">Search for Drink:</label>
            <input
              ref={inputRef}
              type="text"
              name="drink-search"
              id="drink-search"
              value={query}
              autoFocus={true}
              onChange={e => setQuery(e.target.value)}
              className={styles.inputField}/>
            <div className={styles.buttonContainer}>
              <button onClick={searchByIngredient} type="submit" className={styles.button} >Search By Ingredient</button>
              <button onClick={searchByName} type="submit" className={styles.button}>Search By Name</button>
            </div>   
        </form>
    
      {
        //If drins exist, render drink components with data
        drinks?.length
        ? <section>
          <div className={styles.resultsDrinkContainer}> 
            {drinks.map((drink, i) => (
              <DrinkPreview 
                key={i}
                id={drink.cocktailDbId} 
                name={drink.name} 
                image={drink.image}>
              </DrinkPreview>
            ))}
          </div>
          
        </section>
        //If no drinks found, display message
        : <p>No Drinks Found!</p>
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
    <div className={styles.resultsDrinkCard}>
      <Link href={'/drink/' + id}>
        <h1 className={styles.resultsDrinkName}>{name}</h1>
        <Image src={image ? image : noImage} width="200" height="200" alt="picture" className={styles.resultsDrinkIMG}/>
        <span></span>
      </Link>
    </div>
      
    
  )
}


  
  