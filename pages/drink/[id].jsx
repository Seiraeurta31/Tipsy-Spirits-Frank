import Head from 'next/head';
import { useRouter } from "next/router";
import Link from 'next/link';
import { useEffect } from 'react';
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../../config/session";
import Header from '../../components/header';
import styles from '../../styles/drink.module.css'
import Image from 'next/image'
import { getDrinkById } from '../../util/cocktails'


//TO DO: Update to retrieve drink data from external API
export const getServerSideProps = withIronSessionSsr( //iron sessions grabs session info and ads to req
  async function getServerSideProps({ req, params }) {
  
    const { user } = req.session
    const props = {}

    const drink = await getDrinkById(params.id)
    if (drink)
      props.drink = drink

    console.log ("Drink by id returned: ", drink)
    props.isLoggedIn = !!user
    return { props }
  },
  sessionOptions
);


// TODO: Display details of drink from API 
export default function Drink( props) {

  
  console.log ("props.drink ", props.drink)

  const router = useRouter()
  const { isLoggedIn } = props
  const drink = props.drink

  console.log("Props.drink: ", props.drink)
  console.log("Drink Name: ", drink.name)

  //ROUTE CALLS: 
  
  // No drink from search/context or getServerSideProps/favorites, redirect to Homepage
  useEffect(() => {
    if (!drink)
      router.push('/')
  }) 


  return (
    <>
      <Head>
        <title>Dink Favorites</title>
        <meta name="description" content="Viewing a book on booker" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📚</text></svg>" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <Header isLoggedIn={isLoggedIn} />
      
      {props.drink.map((drink, i) => (
            <DrinkDetails 
              key={i}
              id={drink.drinkId} 
              name={drink.name} 
              image={drink.image}
              instructions={drink.instructions}>
            </DrinkDetails>
          ))}
    </>
  )
}   

function DrinkDetails({name, image, instructions}) {

    console.log("name: ", name)
    console.log("ingredients: ", instructions)
    const noImage = "/No_image_available.svg.png"

    return (
      <>
        <div className={styles.titleGroup}>
          <h1>{name}</h1>
          <Image src={image ? image : noImage} width={556} height={370} alt={name} className={styles.recipeImg}/>
          <ul>
            {/* {ingredients.map((ingredient, i) => <li key={i}>{ingredient}</li>)} */}
          </ul>
          <p>{instructions}</p>
          
        </div>
      </>
    )
  }
  