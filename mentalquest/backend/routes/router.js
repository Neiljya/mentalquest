import express from 'express';
import User from '../models/user.js';
import axios from 'axios';
const router = express.Router();

// route to send context to flask server
router.post('/generate-tasks', async (req,res) => {
    try {
        // get the user context from request
        const userContext = req.body.context;

        // send context to flask server
        const response = await axios.post('http://localhost:4000/generate_tasks',{ context: userContext });

        // return generated tasks from Flask to frontend
        res.json(response.data);
    } catch (error){
        console.error(error);
        res.status(500).send('Error generating tasks');
    }
});

router.get('/user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
          }
      
          const userData = await User.findById(userId); // Correct usage
          if (!userData) {
            return res.status(404).json({ message: 'User not found' });
          }
          res.json(userData);

    } catch (error){
        res.status(500).json({message:error.message});
    }
});

// gest the first user in entry (for testing purposes)
router.get('/users/first', async (req, res) => {
    try {
      const userData = await User.findOne().sort({ _id: 1 });
      if (!userData) {
        return res.status(404).json({ message: 'No users found' });
      }
      res.json(userData);
    } catch (error) {
      console.error('Error fetching first user:', error);
      res.status(500).json({ message: error.message });
    }
  });
  

export default router;