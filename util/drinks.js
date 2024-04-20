
//--------Page of HELPER functions to get data from external API -------

//GET drinks by ingredient
export async function getDrinksByIngredient(ingredient) {
    const res = await fetch(
      `https://www.thecocktaildb.com/api/json/v2/${process.env.API_KEY}/filter.php?i=${ingredient}` //TO DO: Put this call in a UTIL folder (server side)
    )
    //Reassign API data KEY's to readable terms
    const drinksByIngredient = drinkPreviewData(res)
    return drinksByIngredient
} 

//GET drinks by name
export async function getDrinksByName(name) {
    const res = await fetch(
        `https://www.thecocktaildb.com/api/json/v2/${process.env.API_KEY}/search.php?s=${name}` //TO DO: Put this call in a UTIL folder (server side)
    )
    //Reassign API data KEY's to readable terms
    const drinksByName = drinkPreviewData(res)
    return drinksByName 
}


async function drinkPreviewData(res) {

    if (res.status !== 200) 
    return null
    
    //Convert data to JSON format
    const data = await res.json()

    //Confirms ingredient and/or name exists
    if(data.drinks == 'None Found' || data.drinks == null )
        return null   
    
    //Assign keys to data   
    const drinkData = data.drinks.map((drink) => ({
        drinkId: drink.idDrink,
        name: drink.strDrink,
        image: drink.strDrinkThumb
    }))

    return drinkData
}



//GET drinks by id from drinks/[id]
export async function getDrinkById(drinkId) {

    console.log ("drink ID: ", drinkId)
    const res = await fetch(
        `https://www.thecocktaildb.com/api/json/v2/${process.env.API_KEY}/lookup.php?i=${drinkId}` //TO DO: Put this call in a UTIL folder (server side)
    )
    if (res.status !== 200) 
        return null

    const data = await res.json()

    if(data.drinks == 'None Found')
        return null

    const drinksById = drinkDetailsData(data)

    return drinksById
}


// Format drink data from id results 
function drinkDetailsData (data) {

    const ingredientsList = ingredientsListBuilder(data)

    const drinkDetailsData = data.drinks.map((drink) => ({
        drinkId: drink.idDrink,
        name: drink.strDrink,
        image: drink.strDrinkThumb,
        alcoholic: drink.strAlcoholic,
        ingredients: ingredientsList,
        instructions: drink.strInstructions
    }))

    return drinkDetailsData
}    

function ingredientsListBuilder (data){
    let drinkIngredientsArray = []
    var ingredientVar
    let ingredient = ""

    for(let i = 1; i<16; i++){
        let ingredientstr = "strIngredient" + i
        let ingredientVarString = `data.drinks[0].${ingredientstr}`
        ingredientVar = eval(ingredientVarString)

        if(ingredientVar === null){
            break;
        }
            
        let measurementStr = "strMeasure"  + i
        let measurementVarString = `data.drinks[0].${measurementStr}`
        var measurementVar = eval(measurementVarString)

        if(measurementVar === null){
            ingredient = `${ingredientVar} `
            
        }else{
            ingredient = `${measurementVar} ${ingredientVar} `
        }

        drinkIngredientsArray.push(ingredient)
    }      

    return drinkIngredientsArray

}