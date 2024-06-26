import User from '../models/user'
import dbConnect from '../connection'

//CRUD for getting, creating, deleting drinks from "favorites"

//READ/GET ALL drinks in favorites list
export async function getAllFavoriteDrinks(userId) {

  await dbConnect()
  
  //Check for user, if none, return null, otherwise proceed to return all favorite drinks under user.
  const user = await User.findById(userId).lean()
  if (!user) return null
  return user.favoriteDrinks.map(drink=> convertDrinkIdToString(drink))
}

//READ/GET single drink from favorites list by drink Id
export async function getFavoriteDrinkById(userId, drinkId) {

  await dbConnect()

  //Check for user, if none, return null, otherwise proceed to find drink by user.
  const user = await User.findById(userId).lean()  
  if (!user) return null

  //Check for drink by id, if none, return null, otherwise return drink
  const drinkFound = user.favoriteDrinks.find(fav => fav.cocktailDbId === drinkId)

  if (drinkFound) return convertDrinkIdToString(drinkFound)
  return null
}


//CREATE/ADD drink to favorites list
export async function addFavoriteDrink(userId, drink) {

  await dbConnect()

  //If user exists, add drink to user Favorites
  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { favoriteDrinks: drink } },  //Query language for MongoDB to add object to an array (non duplicate)  
    { new: true } 
  )
  //If user was not found, return null
  if (!user) return null

  //If user exists, confirm new drink was added by searching for drink in favorites by id and returning new drink
  const addedDrink = user.favoriteDrinks.find(fav => fav.cocktailDbId == drink.cocktailDbId) 

  return convertDrinkIdToString(addedDrink)
}


//DELETE/REMOVE drink from Favorites list
export async function removeFavoriteDrink(userId, drinkId) {

  //Start up database connection
  await dbConnect()
 
  //If user exists, find drink in Favorites by ID and remove it
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { favoriteDrinks: {_id: drinkId } } },
    { new: true }
  )
  //If user does not exists, return null, otherwise return true for successful deletion
  if (!user) return null
  return true
}

export function convertDrinkIdToString({_id, ...otherProperties}) {
  const id = _id.toString()
  return { ...otherProperties, id }
}