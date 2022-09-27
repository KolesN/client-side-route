import express from 'express'
import path from 'path'
import cors from 'cors'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'
import axios from 'axios'

import cookieParser from 'cookie-parser'
import config from './config'
import Html from '../client/html'

const { readFile, writeFile, unlink } = require('fs').promises

require('colors')

let Root
try {
  // eslint-disable-next-line import/no-unresolved
  Root = require('../dist/assets/js/ssr/root.bundle').default
} catch {
  // eslint-disable-next-line no-console
  console.log('SSR not found. Please run "yarn run build:ssr"'.red)
}

let connections = []

const port = process.env.PORT || 8090
const server = express()

const USERS_SOURCE = 'https://jsonplaceholder.typicode.com/users'

const getData = async (url) => {
  const result = await axios(url).then(({ data }) => data)
  return result
}

const removeFile = (name) => {
  unlink(`${__dirname}/${name}.json`)
}

const writeUsers = (name, text) => {
  writeFile(`${__dirname}/${name}.json`, text, { encoding: 'utf8' })
}

const readUsers = async () => {
  const result = await readFile(`${__dirname}/users.json`, { encoding: 'utf8' })
    .then((text) => {
      return JSON.parse(text)
    })
    .catch(async () => {
      const data = await getData(USERS_SOURCE)
      writeUsers('users', JSON.stringify(data))
      return data
    })
  return result
}

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  express.json({ limit: '50mb', extended: true }),
  cookieParser()
]

middleware.forEach((it) => server.use(it))

server.use((req, res, next) => {
  res.set('x-skillcrucial-user', 'e7aec42d-a611-47cc-a5c8-93e75ce35f1c')
  res.set('Access-Control-Expose-Headers', 'X-SKILLCRUCIAL-USER')
  next()
})

// server.use('/api/', (req, res) => {
//   res.status(404)
//   res.end()
// })

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Skillcrucial'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

// get /api/v1/users - получает всех юзеров из файла users.json, если его нет - получает данные с сервиса https://jsonplaceholder.typicode.com/users, заполняет файл users.json полученными данными и возвращает эти данные пользователю.
server.get('/api/v1/users', async (req, res) => {
  const result = await readUsers()
  res.json(result)
})

// post /api/v1/users - получает тело запроса, добавляет в файл users.json объект нового юзера с id равным id последнего элемента + 1 и содержащий полученное тело запроса.
// Пользователю должен вернуться объект { status: 'success', id: id }

// patch /api/v1/users/:userId - получает тело запроса и добавляет его поля к объекту с id равным userId из файла users.json.
// Пользователю должен вернуться объект { status: 'success', id: userId }

// delete /api/v1/users/:userId - удаляет юзера в users.json, с id равным userId, и возвращает { status: 'success', id: userId }

// delete /api/v1/users - удаляет файл users.json
server.delete('/api/v1/users', (req, res) => {
  removeFile('users')
  res.json({ status: 'ok' })
})

server.get('/*', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

const app = server.listen(port)

if (config.isSocketsEnabled) {
  const echo = sockjs.createServer()
  echo.on('connection', (conn) => {
    connections.push(conn)
    conn.on('data', async () => {})

    conn.on('close', () => {
      connections = connections.filter((c) => c.readyState !== 3)
    })
  })
  echo.installHandlers(app, { prefix: '/ws' })
}
// eslint-disable-next-line no-console
console.log(`Serving at http://localhost:${port}`)

// readFile(`${__dirname}/test.json`, { encoding: 'utf8' })
//   .then((text) => {
//     /* вернется текст из файла, а не объект джаваскрипта */
//   })
//   .catch((err) => {
//     /* случается когда нет файла */
//   })

//  writeFile(`${__dirname}/test.json`, text, { encoding: "utf8" });

//  stat(`${__dirname}/test.json`)
//   .then(data => /* случается когда есть файл test.json */)
//    .catch(err => /* случается когда нет файла test.json */)

// unlink(`${__dirname}/test.json`)
