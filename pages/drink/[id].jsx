import Head from 'next/head';
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../../config/session";
import Header from '../../components/header';
import styles from '../../styles/drink.module.css'
import Image from 'next/image'
import db from '../../db'
import { getDrinkById } from '../../util/drinks'

//GET session info from req AND single drink data from external API
export const getServerSideProps = withIronSessionSsr( //iron sessions grabs session info and ads to req
  async function getServerSideProps({ req, params }) {

    const { user } = req.session 

    const props = {}

    if (user) {
      props.user = req.session.user
    }
    const drink = await getDrinkById(params.id)  //Drink from cocktial DB API

    let isFavorite = false
    
    //Check if drink is a favorite drink
    if (user) {
      props.user = req.session.user
      const favoriteDrink = await db.drink.getFavoriteDrinkById(req.session.user._id, params.id)
      
      if(favoriteDrink !== null){
        drink[0] = favoriteDrink
        isFavorite = true
      }
    }  

    //If drink was found save it to props
    if (drink)
    props.drink = drink

    props.favorite = isFavorite
    props.isLoggedIn = !!user
    return { props }
  },
  sessionOptions
);


// Display details of drink from API 
export default function Drink( props) {

  const router = useRouter()
  const { isLoggedIn } = props
  const [drink] = props.drink // destructure out the drink from array prop

  let favorite = props.favorite

  //Add to favorites
  async function addToFavorites(e) {
    e.preventDefault()
    const res = await fetch(`/api/drink`, {
      method: 'POST',
      headers: 
      {
        "content-type": "application/json",
      },
      body: JSON.stringify(drink)
    })
    // Call router.replace(router.asPath) if you receive a 200 status
    if (res.status === 200) {
      router.replace(router.asPath)
    }  
  
  }

  async function removeFromFavorites(e) {
    e.preventDefault()
    const res = await fetch(`/api/drink`, {
      method: 'DELETE',
      headers: 
      {
        "content-type": "application/json",
      },
      body: JSON.stringify({id: drink.id})
    })
    // Call router.replace(router.asPath) if you receive a 200 status
    if (res.status === 200) {
      router.replace(router.asPath)
    }  
  
  }




  return (
    <>
      <Head>
        <title>Drink Favorites</title>
        <meta name="description" content="A view of favorite drinks" />
      </Head>

      <Header isLoggedIn={isLoggedIn} image={"/Drink.jpg"}/>
      
      <div className={styles.container}>
        <DrinkDetails 
          cocktailDbId={drink.cocktailDbId} 
          name={drink.name} 
          image={drink.image}
          alcoholic={drink.alcoholic}
          ingredients={drink.ingredients}
          instructions={drink.instructions}>
        </DrinkDetails>

        <div className={styles.buttonContainer}>
          {favorite  // Tests if drink is currently a favorite
          //if its a favorite, show button to remove favorite
          ? <button onClick={removeFromFavorites} type="submit" className={styles.button}>Remove from favorites</button>
          //if its NOT a favorite, show button to add to favorites
          : <button onClick={addToFavorites} type="submit" className={styles.button}>Add to Favorites</button>
          }
          <button onClick={() => router.back()} type="submit" className={styles.button}>Back</button>
        </div>
      </div>  
    </>
  )
}   

function DrinkDetails({name, image, alcoholic, ingredients, instructions}) {

    const noImage = "/No_image_available.svg.png"

    return (
      <div className={styles.detailsContainer}>
        <div className={styles.nameContainer}>
          <h1 className={styles.drinkName} >{name}</h1>
        </div>
        <p className={styles.drinkType}> {alcoholic == "Alcoholic" ? "Alcoholic Drink" : "Non-Alcoholic Drink"}</p>
        <div className={styles.imgIngredientsContainer}>
          <Image src={image ? image : noImage} width={250} height={250} alt={name}  className={styles.drinkIMG }/>
          <ul className={styles.ingredients}>
            {ingredients.map((ingredient, i) => <li key={i}>{ingredient}</li>)}
          </ul>
        </div>
        <p>{instructions}</p>
      </div>
          
    )
  }
  