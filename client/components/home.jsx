import React, { useState } from 'react'
import Head from './head'
// import wave from '../assets/images/wave.jpg'

const Home = () => {
  const [counter, setCounterNew] = useState(0)
  const onClick = () => setCounterNew(counter + 1)

  return (
    <div>
      <Head title="Dashboard" />
      <img alt="wave" src="images/wave.jpg" />
      <button type="button" onClick={onClick}>
        updateCounter
      </button>
      <div> Hello World Dashboard {counter} </div>
    </div>
  )
}

Home.propTypes = {}

export default Home
