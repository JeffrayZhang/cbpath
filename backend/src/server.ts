import express from 'express'
import cors from 'cors'
import { userRouter } from './user-router';
import { courseRouter } from './course-router';
import { reviewRouter } from './review-router';
const app = express()
const port = 8000

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use(async (_req, res, next) => {
  // makes sure that if an error occurs, the server
  // returns a 500 response rather than crashing the
  // server
  try {
    await next()
  } catch(error) {
    console.error(error);
    console.error(error.stack);
    res.status(500).send('Something broke :(')
  }
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/user', userRouter)
app.use('/course', courseRouter)
app.use('/review', reviewRouter)

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})
