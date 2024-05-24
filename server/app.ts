import 'dotenv/config'
import express from 'express';
import { userRoute } from './routes/users';
import { responseHandler } from './middleware/response_handler';



const app = express();
const port = 3000;

app.use(express.json())
app.use(responseHandler)

app.get('/', (req, res) => {
  res.send('The server is working!');
});

app.use('/user', userRoute)


app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});