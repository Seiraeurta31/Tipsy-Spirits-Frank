import { Schema } from 'mongoose'

const drinkSchema = new Schema({
  favoritesId: Number,
  name: String,
  image: String,
  // alcoholic: String,
  // instructions: String,
  // ingredients: [{String}],
})

export default drinkSchema