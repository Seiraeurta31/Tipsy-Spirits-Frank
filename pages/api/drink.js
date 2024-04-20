import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session"
import db from '../../db'

export default withIronSessionApiRoute(
  async function handler(req, res) {

    if(!req.session.user)
      return res.status(401).end()

    const {id: userId} = req.session.user


  //API Routes/SECRETARY to handle requests to DB  
    switch(req.method) {
      // DONE: On a POST request, add a book using db.book.add with request body (must use JSON.parse)
      
      case 'POST': 
        try{
          const bookRequest = req.body
          const bookToAdd = req.body
          const addedBook = await db.book.add(userId, bookToAdd)
          if(addedBook == null){
            req.session.destroy()  //incase was able to get in but no info so destroy user
            return res.status(401)
          }
          return res.status(200).json(addedBook)
        }catch(error){
          return res.status(400).json({error: error.message})
        }

      // DONE: On a DELETE request, remove a book using db.book.remove with request body (must use JSON.parse)
      case 'DELETE': 
        try{
          const bookToDelete = req.body
          const deletedBook = await db.book.remove(userId, bookToDelete.id)
          if(deletedBook == null){
            req.session.destroy()
            return res.status(401)
          }
          return res.status(200).json(deletedBook)
        }catch(error){
          return res.status(400).json({error: error.message})
        }
      // DONE: Respond with 404 for all other requests
      default: 
        return res.status(404).end()
    }
  },
  sessionOptions
)