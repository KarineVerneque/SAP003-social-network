import Button from '../components/button.js';
import Input from '../components/input.js';
import Register from './register.js';

function buttonLogin() {
  const email = document.querySelector('.input-email').value;
  const password = document.querySelector('.input-password').value;
  console.log(email);
  console.log(password);
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function () {
    // Handle Errors here.
    //var errorCode = error.code;
    //var errorMessage = error.message;
    // ...
  });
}

function loginSocial(event) {
  event.preventDefault();
  // var config = {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function (result) {
    //   var token = result.credential.accessToken;
    //   var user = result.user;
    // }).catch(function(error) {
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   var email = error.email;
    //   var credential = error.credential;
  });
}


function Login() {
  const template = `
    <h1>InstaHealth</h1>
      <form class="login-card">
        ${Input({
          class: 'input-email',
          placeholder: 'email',
          type: 'email',
        })}

        ${Input({
          class: 'input-password',
          placeholder: 'password',
          type: 'password',
        })}

        ${Button({ id: '🎉', title: 'Entrar 🎉', onClick: buttonLogin })}
        ${Button({ id: 'google', title: 'Entrar com sua conta do Google', class: 'btn-google', onClick: loginSocial })}
    </form>
    <p>Criar conta<a href="#/register">Registre-se</a></p>
  `;
  return template;
}
export default Login;

function locationHashChanged() {
  if (location.hash === '#/register') {
    document.querySelector('main').innerHTML = Register();
  }
}

window.onhashchange = locationHashChanged;
