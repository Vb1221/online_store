window.onload = () => {



  document.querySelector('.prof').addEventListener('click', function() {
 
    let redirectBtn = document.querySelector('.redirectUrl')

    let token = sessionStorage.getItem('token')

    let checkUrl = 'http://localhost:5000/api/user/auth'

    if(!token){
      redirectBtn.setAttribute('href', 'pages/login.html')
    }
      
      fetch(checkUrl, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      .then(response => response.json())
      .then(allData => {
        console.log(allData)
        let isAdmin = allData.userData.userRole

        if (isAdmin === 'ADMIN'){
          window.location.href = 'pages/Admin.html';
        }
        else if(isAdmin === 'USER'){
          showModalWindow(allData)
        }
      })
      .catch(error => {
        console.log('Виникла помилка:', error);
      });
  });

  let userName = document.createElement('h1')
  let userEmail = document.createElement('h2')
  function showModalWindow(allData){
    let modal = document.getElementById("myModal");
    let closeBtn = document.querySelector(".close");

    let contentArea = document.querySelector('.userData')

    modal.style.display = "block";


    userName.innerHTML = allData.userData.userName
    contentArea.appendChild(userName)


    userEmail.innerHTML = allData.userData.userEmail
    contentArea.appendChild(userEmail)


    function closeModal() {
      modal.style.display = "none";
    }


    closeBtn.addEventListener("click", closeModal);

    let logoutBtn = document.querySelector('.logoutBtn')

    function logout(){
      sessionStorage.removeItem('token');
      closeModal()
    }

    
    // let basketId = allData.basket.id
    // let basketUrl = `http://localhost:5000/api/basket/${basketId}`
    // console.log(basketId)


    logoutBtn.onclick = logout


    window.addEventListener("click", function(event) {
      if (event.target == modal) {
        closeModal();
      }
    });
  }


  ///////

 let typeUrl = 'http://localhost:5000/api/type'
 
  let typeOfDevices = document.querySelector('.typeOfDevice')
  
  function getDeviceType(typeUrl){
    fetch(typeUrl)
      .then(response => response.json())
      .then(data => {
        // console.log(data)
        for(let i = 0; i < data.length; i++){
          let div = document.createElement('div')
          div.id = data[i].id
          div.className = 'typeVariant'
          div.innerHTML = data[i].name
          typeOfDevices.appendChild(div)

          div.addEventListener('click', function(){
            sessionStorage.setItem('typeId', div.id)
            sessionStorage.setItem('typeName', data[i].name)
            window.location.href = `pages/filtredPage.html`;
          })
        }
        
      })
      .catch(error => {
        console.log('Виникла помилка:', error);
      });
  }
  getDeviceType(typeUrl)



  //

  let allDevice = document.querySelector('.allDevice')

  const deviceUrl = 'http://localhost:5000/api/device'

  function getDevice(deviceUrl){
    fetch(deviceUrl)
      .then(response => response.json())
      .then(deviceData => {
        //  console.log(deviceData)
        for(let i = 0; i < deviceData.rows.length; i++){
          let deviceDiv = document.createElement('div')
          deviceDiv.id = deviceData.rows[i].id
          deviceDiv.className = 'deviceCard'

          let deviceName = document.createElement('h6')
          deviceName.innerHTML = deviceData.rows[i].name
          deviceDiv.appendChild(deviceName)

          let devicePrice = document.createElement('p')
          devicePrice.innerHTML = `${deviceData.rows[i].price} грн`
          deviceDiv.appendChild(devicePrice)

          let deviceImg = document.createElement('img')
          let path = '../backend/static/' + deviceData.rows[i].img
          deviceImg.setAttribute('src', path)
          deviceDiv.appendChild(deviceImg)

          allDevice.appendChild(deviceDiv)

          deviceDiv.addEventListener('click', function() {
            sessionStorage.setItem('id', deviceDiv.id)
            window.location.href = `pages/fileName.html`;
          })
        }

        
      })
      .catch(error => {
        console.log('Виникла помилка:', error);
      });
  }

  getDevice(deviceUrl)


  //

  function getBasket(){
    let authUrl = 'http://localhost:5000/api/user/auth'
    let token = sessionStorage.getItem('token')
    fetch(authUrl, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(response => response.json())
    .then(data =>{
      sessionStorage.setItem('basketId', data.basket.id)
    })
  }
  getBasket()


  //

  let basketData = document.querySelector('.basketData')

  let basketId = sessionStorage.getItem('basketId')

  const basketUrl = `http://localhost:5000/api/basket?basketId=${basketId}`

  fetch(basketUrl)
  .then(response => response.json())
  .then(data => {
    console.log(data)
  })

}