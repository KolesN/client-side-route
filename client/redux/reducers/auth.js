const UPDATE_LOGIN = 'UPDATE_LOGIN'
const UPDATE_PASSWORD = 'UPDATE_PASSWORD'
const LOGIN = 'LOGIN'

const initialState = {
  token: '',
  user: {
    name: ''
  },
  login: '',
  password: ''
}
/* eslint-disable default-param-last */
export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_LOGIN: {
      return { ...state, login: action.login }
    }
    case UPDATE_PASSWORD: {
      return { ...state, password: action.password }
    }
    default:
      return state
  }
}

export function updateLoginField(login) {
  return { type: UPDATE_LOGIN, login}
}

export function updatePasswordField(password) {
  return { type: UPDATE_PASSWORD, password }
}

export function signIn(password) {
  return (dispatch, getState) => {
    const { login } = getState().auth
    fetch('/api/v1/auth', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        login,
        password
      })
    })
    .then(r => r.json())
    .then(data => {
      dispatch({ type: LOGIN, token: data.token })
    })
  }
}