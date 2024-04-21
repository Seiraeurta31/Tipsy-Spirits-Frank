import Head from 'next/head';
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../../config/session";
import Header from '../../components/header';
import styles from '../../styles/drink.module.css'
import db from '../../db';
import Image from 'next/image'
import { getDrinkById } from '../../util/drinks'

//GET session info from req AND single drink data from external API
export const getServerSideProps = withIronSessionSsr( //iron sessions grabs session info and ads to req
  async function getServerSideProps({ req, params }) {
  
    const { user } = req.session

    console.log("User Info: ", user)
    const props = {}
     //sets if book is a favorite or not

    let favorite = false
    const favoriteDrink = await db.drink.getFavoriteDrinkById(user._id, params.id)

    if(favoriteDrink !== null){
      favorite = true
    } 

    //GET drink from API from util/drinks
    const drink = await getDrinkById(params.id)

    //If drink was found save it to props
    if (drink)
      props.drink = drink

   
    //Search favorites list for drinkID to check if a favorite exists
    

    props.isFavorite = favorite

    props.isLoggedIn = !!user
    return { props }
  },
  sessionOptions
);


// TODO: Display details of drink from API 
export default function Drink( props) {

  const router = useRouter()
  const { isLoggedIn } = props
  const [drink] = props.drink // destructure out the drink from array prop
  const isFavorite = props.isFavorite //Favorite book



  //ROUTE CALLS from buttons to ADD/ DELETE favorites from database: 

  //TODO: Add to favorites
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


  return (
    <>
      <Head>
        <title>Dink Favorites</title>
        <meta name="description" content="Viewing a book on booker" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📚</text></svg>" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <Header isLoggedIn={isLoggedIn} />
      
      
      <DrinkDetails 
        id={drink.drinkId} 
        name={drink.name} 
        image={drink.image}
        alcoholic={drink.alcoholic}
        ingredients={drink.ingredients}
        instructions={drink.instructions}>
      </DrinkDetails>

      {isFavorite  // Tests if drink is currently a favorite
      //if its a favorite, show button to remove favorite
      ? <button onClick={removeFromFavorites} type="submit">Back</button>
      //if its NOT a favorite, show button to add to favorites
      : <button onClick={addToFavorites} type="submit">Back</button>
      }
      
      
    </>
  )
}   

function DrinkDetails({name, image, alcoholic, ingredients, instructions}) {

    const noImage = "/No_image_available.svg.png"

    return (
      <>
          <h1>{name}</h1>
          <p>{alcoholic == "Alcoholic" ? "Alcoholic Drink" : "Non-Alcoholic Drink"}</p>
          <Image src={image ? image : noImage} width={556} height={370} alt={name} className={styles.recipeImg}/>
          <ul>
            {ingredients.map((ingredient, i) => <li key={i}>{ingredient}</li>)}
          </ul>
          <p>{instructions}</p>
      </>
    )
  }
  