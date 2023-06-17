window.onload = () => {

  function toggleForm() {
    let loginForm = document.getElementById("loginForm");
    let registerForm = document.getElementById("registerForm");

    if (loginForm.style.display === "none") {
      loginForm.style.display = "block";
      registerForm.style.display = "none";
    } else {
      loginForm.style.display = "none";
      registerForm.style.display = "block";
    }
  }

  let switchFormBtn = document.querySelector('.switchForm')
  let switchFormBtn1 = document.querySelector('.switchForm1')

  switchFormBtn.onclick = toggleForm
  switchFormBtn1.onclick = toggleForm



  let loginBtn = document.querySelector('.loginBtn')

  loginBtn.addEventListener('click', function userLogin(event) {
    event.preventDefault();

    let userNameLogin = document.querySelector('.userNameLogin').value
    let passwordLogin = document.querySelector('.passwordLogin').value

    const loginUrl = 'https://backend-znpe.onrender.com/api/user/login'

    let loginData = {
      username: userNameLogin,
      password: passwordLogin
    };

      fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      })
      .then(function(response) {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Помилка запиту до сервера: ' + response.status);
        }
      })
      .then(function(data) {
        // Обробка успішної відповіді від сервера
        sessionStorage.setItem('token', data.token)
        // console.log(data);
        window.location.href = '../index.html';
      })
      .catch(function(error) {
        // Обробка помилки
        console.error(error);
        alert('wrong user name or password')
      });

  })

  let submitReg = document.querySelector('.submitReg')

  submitReg.addEventListener('click', function(e){
    e.preventDefault()
    let regInput = document.querySelector('.regUserName').value
    let passInput = document.querySelector('.regUserPassword').value
    let emailInput = document.querySelector('.regUserEmail').value

    let regData = {
      username: regInput,
      password: passInput,
      email: emailInput
    }
    const registrationUrl = 'https://backend-znpe.onrender.com/api/user/registration'

    fetch(registrationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(regData)
    })
    .then(data => {
      console.log(data)
      window.location.href = 'login.html'
    })
    .catch(function(error) {
      // Обробка помилки
      console.error(error);
      // alert('wrong user name or password')
    });


    })





}