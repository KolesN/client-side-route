import React, { useState, useEffect } from 'react'
import { Route } from 'react-router-dom'
import Cookies from 'universal-cookie'
import dashMain from './dash-main'
import dashProfile from './dash-profile'
import dashboard from './dashboard'
import Head from './head'
// import wave from '../assets/images/wave.jpg'

const Home = () => {
  const [counter, setCounterNew] = useState(0)
  const onClick = () => setCounterNew(counter + 1)
  const cookies = new Cookies()
  const date = new Date()
  useEffect(() => {
    cookies.set('created', date.toString(), { path: '/' })
    fetch('/api/v1/test/cookies')
  })

  return (
    <div>
      <Head title="Home" />
      <img alt="wave" src="images/wave.jpg" />
      <button type="button" onClick={onClick}>
        updateCounter
      </button>
      <div> Hello World Dashboard {counter} </div>
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col justify-center bg-neutral-900 p-10 rounded-xl select-none">
          {/* <img alt="wave" src="images/logo-new-text.png" /> */}
          <div id="title">Home</div>
          <Route exact path="/dashboard" component={dashboard} />
          <Route exact path="/dashboard/main" component={dashMain} />
          <Route exact path="/dashboard/profile/:user" component={dashProfile} />
        </div>
      </div>
    </div>
  )
}

Home.propTypes = {}

export default Home
