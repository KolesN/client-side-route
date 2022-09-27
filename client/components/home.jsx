import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Head from './head'
// import wave from '../assets/images/wave.jpg'

const Home = () => {
  const [counter, setCounterNew] = useState(0)
  const onClick = () => setCounterNew(counter + 1)

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
          <img alt="wave" src="images/logo-new-text.png" />
          <div id="title">Home</div>
          <Link to="/dashboard">Go To Root</Link>
          <Link to="/dashboard/main">Go to Main </Link>
          <Link to="/dashboard/profile/e7aec42d-a611-47cc-a5c8-93e75ce35f1c">Go to Profile </Link>
        </div>
      </div>
    </div>
  )
}

Home.propTypes = {}

export default Home
