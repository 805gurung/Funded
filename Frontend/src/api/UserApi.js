const BACKEND_URL = `http://localhost:5000`

export const verifyEmail = (token) => {
    return fetch(`${BACKEND_URL}/verifyuser/${token}`)
        .then((response) => response.json())
        .catch(error => console.log(error));
}

export const authenticate =(data)=>{
    localStorage.setItem('jwt', JSON.stringify(data))
}

export const isauthenticated = () =>{
  return localStorage.getItem('jwt')? JSON.parse(localStorage.getItem('jwt')):false
}
export const register = (user) => {
  return fetch(`${BACKEND_URL}/register`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .catch((error) => console.log(error));
};

export const login = (user) => {
  return fetch(`${BACKEND_URL}/login`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .catch((error) => console.log(error));
};