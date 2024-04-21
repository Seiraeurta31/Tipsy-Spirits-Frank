import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session"
import db from '../../db'

export default withIronSessionApiRoute(
  async function handler(req, res) {

    if(!req.session.user)
      return res.status(401).end()

    const {_id: userId} = req.session.user


  //API Routes/SECRETARY to handle requests to DB  
    switch(req.method) {
      // DONE: On a POST request, add a book using db.book.add with request body (must use JSON.parse)
      
      case 'POST': 
        try{
          console.log("POST TRIGGERED")
          const drinkToAdd = req.body
          const addedDrink= await db.drink.addFavoriteDrink(userId, drinkToAdd)
          if(addedDrink == null){
            req.session.destroy()  //incase was able to get in but no info so destroy user
            return res.status(401)
          }
          return res.status(200).json(addedDrink)
        }catch(error){
          return res.status(400).json({error: error.message})
        }

      // 
      default: 
        return res.status(404).end()
    }
  },
  sessionOptions
)