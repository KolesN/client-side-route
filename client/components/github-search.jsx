import React, { useState } from 'react'
import Head from './head'
import { history } from '../redux'

const Input = (props) => {
  const [value, setValue] = useState('')
  const onChange = (e) => {
    const newValue = e.target.value
    setValue(newValue)
    props.onChange(newValue)
  }
  return (
    <div>
      <input type="text" id="input-field" value={value} onChange={onChange} />
    </div>
  )
}
const Button = (props) => {
  const onClick = (e) => {
    history.push(`https://api.github.com/users/${e.target.value}/repos`)
    
  }
  return (
    <div>
      <button id="search-button" type="button" onClick={onClick} value={props.username}>
        Search
      </button>
    </div>
  )
}

const Search = () => {
  const [username, setUsername] = useState('')
  const onInputChange = (value) => {
    setUsername(value)
  }
  return (
    <div>
      <Head title="test" />
      <Input onChange={onInputChange} />
      <Button username={username} />
      </div>
  )
}

Search.propTypes = {}

export default Search
