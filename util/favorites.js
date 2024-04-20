
export async function getAllFavoriteDrinks(userId, drinkId) {
    const favoriteDrinks = await db.book.getAll(userId)
    
}