import React from 'react'
import { Link } from 'react-router-dom'
import Head from './head'

const Dashboard = () => (
  <>
    <Head title="Hello" />
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col justify-center bg-neutral-900 p-10 rounded-xl select-none">
        {/* <img alt="wave" src="images/logo-new-text.png" /> */}
        <div id="title">Dashboard</div>
        <Link to="/dashboard/profile/e7aec42d-a611-47cc-a5c8-93e75ce35f1c">Go to Profile </Link>
        <Link to="/dashboard/main">Go To Main</Link>
      </div>
    </div>
  </>
)

Dashboard.propTypes = {}

export default React.memo(Dashboard)
