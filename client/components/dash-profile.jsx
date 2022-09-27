import React from 'react'
import { Link, useParams } from 'react-router-dom'
import Head from './head'


const DashProfile = () => {
  const { user } = useParams()
  return <>

    <Head title="Hello" />
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col justify-center bg-neutral-900 p-10 rounded-xl select-none">
        <img alt="wave" src="images/logo-new-text.png" />
        <div id="title">Profile</div>
        <Link to="/dashboard">Go To Root</Link>
        <Link to="/dashboard/main">Go to Main </Link>
        <div className="username">`${user}`</div>
      </div>
    </div>
  </>
}

DashProfile.propTypes = {}

export default React.memo(DashProfile)
