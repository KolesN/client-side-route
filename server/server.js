import express from 'express'
import path from 'path'
import cors from 'cors'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'
import axios from 'axios'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import jwt from 'jsonwebtoken'


import mongooseService from './services/mongoose'
import passportJWT from './services/passport'

import config from './config'
import Html from '../client/html'
import User from './model/User.model'


const { readFile, writeFile, unlink } = require('fs').promises

require('colors')

let Root = ''
mongooseService.connect('mongodb://127.0.0.1:27017/auth')

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
  passport.initialize(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  express.json({ limit: '50mb', extended: true }),
  cookieParser()
]

middleware.forEach((it) => server.use(it))


passport.use('jwt', passportJWT.jwt)

server.use((req, res, next) => {
  res.set('x-skillcrucial-user', 'e7aec42d-a611-47cc-a5c8-93e75ce35f1c')
  res.set('Access-Control-Expose-Headers', 'X-SKILLCRUCIAL-USER')
  next()
})

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

server.get('/api/v1/users', async (req, res) => {
  const result = await readUsers()
  res.json(result)
})

server.get('/api/v1/test/cookies', async (req, res) => {
  console.log(req.cookies)
  res.cookie('serverCookie', 'test', { maxAge: 100000, httpOnly: true })
  res.json({ status: req.cookies })
})

server.post('/api/v1/auth', async (req, res) => {
  console.log(req.body)
  try {
    const user = await User.findAndValidateUser(req.body)
    const payload = { uid: user.id }
    const token = jwt.sign(payload, config.secret, { expiresIn: '48h' })
    res.json({ status: 'ok' })
  } catch (err) {
      res.json({status: 'Error', err})
  }
})

server.post('/api/v1/users', async (req, res) => {
  const list = await readUsers()
  const ID = list[list.length - 1].id + 1
  const newUser = { ...req.body, id: ID }
  const newList = [...list, newUser]

  writeUsers('users', JSON.stringify(newList))

  res.json({ status: 'success', id: ID })
})

server.patch('/api/v1/users/:userId', async (req, res) => {
  const { userId } = req.params
  const list = await readUsers()
  const newList = list.reduce((acc, rec) => {
    if (rec.id === +userId) {
      return [...acc, { ...rec, ...req.body }]
    }
    return [...acc, rec]
  }, [])
  writeUsers('users', JSON.stringify(newList))
  res.json({ status: 'success', id: userId })
})

server.delete('/api/v1/users/:userId', async (req, res) => {
  const { userId } = req.params
  const list = await readUsers()
  const newList = list.reduce((acc, rec) => {
    if (rec.id !== +userId) {
      return [...acc, rec]
    }
    return [...acc]
  }, [])
  writeUsers('users', JSON.stringify(newList))
  res.json({ status: 'success', id: userId })
})

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

// server.use('/api/', (req, res) => {
//   res.status(404)
//   res.end()
// })

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
