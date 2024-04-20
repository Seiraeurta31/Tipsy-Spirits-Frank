
//--------Page of HELPER functions to get data from external API -------

//GET drinks by ingredient
export async function getDrinksByIngredient(ingredient) {
    console.log("ingredient search triggered")
    const res = await fetch(
      `https://www.thecocktaildb.com/api/json/v2/${process.env.API_KEY}/filter.php?i=${ingredient}` //TO DO: Put this call in a UTIL folder (server side)
    )
    
    const drinksByIngredient = processDrinkData(res)

    return drinksByIngredient
} 

//GET drinks by name
export async function getDrinksByName(name) {
    const res = await fetch(
        `https://www.thecocktaildb.com/api/json/v2/${process.env.API_KEY}/search.php?s=${name}` //TO DO: Put this call in a UTIL folder (server side)
    )

    //Isolate necessary data into new array of drink objects 
    const drinksByName = processDrinkData(res)
  
    return drinksByName 
}


async function processDrinkData(res) {
    if (res.status !== 200) 
        return null

    const data = await res.json()

    if(data.drinks == 'None Found')
        return null
    
    //Isolate necessary data into new array of drink objects  
    const formattedData = drinkPreviewFormatting(data)

    return formattedData
}


// Formatting cocktail drink info to match future favorite drink schema model  
function drinkPreviewFormatting (data) {
    const drinkPreviewData = data.drinks.map((drink) => ({
        drinkId: drink.idDrink,
        name: drink.strDrink,
        image: drink.strDrinkThumb
    }))

    return drinkPreviewData
}



//Drinks searched by drinkId
export async function getDrinkById(drinkId) {

    console.log("Get Drink By Id TRIGGERED")

    console.log ("drink ID: ", drinkId)
    const res = await fetch(
        `https://www.thecocktaildb.com/api/json/v2/${process.env.API_KEY}/lookup.php?i=${drinkId}` //TO DO: Put this call in a UTIL folder (server side)
    )
    if (res.status !== 200) 
        return null

    const data = await res.json()

    console.log("Data from API: ", data)

    if(data.drinks == 'None Found')
        return null

    const drinksById = drinkDetailsFormatting(data)

    return drinksById
}

function drinkDetailsFormatting (data) {

    const ingredients = ingredientsBuilder(data)

    const drinkDetailsData = data.drinks.map((drink) => ({
        drinkId: drink.idDrink,
        name: drink.strDrink,
        image: drink.strDrinkThumb,
        instructions: drink.strInstructions
    }))

    return drinkDetailsData
}    

function ingredientsBuilder (data){

    console.log("Data: ", data)
    let drinkIngredientsArray = []
    let ingredientName






    
    ingredientName = "strIngredient" + 1
    let ingredientString = `data.drinks[0].${ingredientName}`

    var myVar = eval(ingredientString)

    console.log("My Var: ", myVar)

    console.log("data ingredient: ", ingredientString)
    
    console.log("Ingredient Name: ", ingredientName)



    // for (let i = 1; ingredient !=null; i++) {
     
   
    // }

}