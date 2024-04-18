
// Helper functions to get data for cocktails from external API on server side (to protect API key)


//Cocktails searched by ingredient
export async function getDrinksByIngredient(ingredient) {
    console.log("ingredient search triggered")
    const res = await fetch(
      `https://www.thecocktaildb.com/api/json/v2/${process.env.API_KEY}/search.php?s=${ingredient}` //TO DO: Put this call in a UTIL folder (server side)
    )
    if (res.status !== 200) return
    const data = await res.json()
    console.log("JSON Data: ", data)

    const drinksByIngredient = drinkPreviewFormatting(data)
    
    return drinksByIngredient
} 


//Cocktails searched by name
export async function getDrinksByName(name) {
    const res = await fetch(
        `https://www.thecocktaildb.com/api/json/v2/${process.env.API_KEY}/search.php?s=${name}` //TO DO: Put this call in a UTIL folder (server side)
    )
    if (res.status !== 200) return
    const data = await res.json()
    console.log("JSON Data: ", data)

    const drinksByName = drinkPreviewFormatting(data)

    return drinksByName 
}

// Formatting cocktail drink info to match future favorite drink schema model  
function drinkPreviewFormatting (data) {
    const drinkPreviewData = data.drinks.map((drink) => ({
        cocktailId: drink.idDrink,
        name: drink.strDrink,
        image: drink.strDrinkThumb
    }))

    return drinkPreviewData
}