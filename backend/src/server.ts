import express from 'express'
import cors from 'cors'
import { userRouter } from './user-router';
import { courseRouter } from './course-router';
const app = express()
const port = 8000

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/user', userRouter)
app.use('/course', courseRouter)

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})
