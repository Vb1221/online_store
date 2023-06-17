
window.onload = () => {

  let profBtn = document.querySelector('.prof')
  profBtn.addEventListener('click', function() {
    openModal()
  });

  function openModal(){
    const redirectBtn = document.querySelector('.redirectUrl');
    const token = sessionStorage.getItem('token');
    const checkUrl = 'https://backend-znpe.onrender.com/api/user/auth';

    if (!token) {
      redirectBtn.setAttribute('href', 'pages/login.html');
      return;
    }

    fetch(checkUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(allData => {
        const isAdmin = allData.userData.userRole;
        if (isAdmin === 'ADMIN') {
          window.location.href = '../pages/Admin.html';
        } else if (isAdmin === 'USER') {
          showModalWindow(allData);
        }
      })
      .catch(error => {
        console.log('Виникла помилка:', error);
      });
  }
  // 

  const userName = document.createElement('h1');
  const userEmail = document.createElement('h2');

  function showModalWindow(allData) {
    const modal = document.getElementById('myModal');
    const closeBtn = document.querySelector('.close');
    const contentArea = document.querySelector('.userData');

    modal.style.display = 'block';

    userName.innerHTML = allData.userData.userName;
    contentArea.appendChild(userName);

    userEmail.innerHTML = allData.userData.userEmail;
    contentArea.appendChild(userEmail);

    function closeModal() {
      modal.style.display = 'none';
    }

    basketData.innerHTML = '';
    getDevicesInBasket();

    closeBtn.addEventListener('click', closeModal);

    const logoutBtn = document.querySelector('.logoutBtn');

    function logout() {
      sessionStorage.removeItem('token');
      closeModal();
    }

    logoutBtn.onclick = logout;

    window.addEventListener('click', function(event) {
      if (event.target == modal) {
        closeModal();
      }
    });
  }

  const typeUrl = 'https://backend-znpe.onrender.com/api/type';
  const typeOfDevices = document.querySelector('.typeOfDevice');

  function getDeviceType(typeUrl) {
    fetch(typeUrl)
      .then(response => response.json())
      .then(data => {
        for (let i = 0; i < data.length; i++) {
          const div = document.createElement('div');
          div.id = data[i].id;
          div.className = 'typeVariant';
          div.innerHTML = data[i].name;
          typeOfDevices.appendChild(div);

          div.addEventListener('click', function() {
            sessionStorage.setItem('typeId', div.id);
            sessionStorage.setItem('typeName', data[i].name);
            window.location.href = 'pages/filtredPage.html';
          });
        }
      })
      .catch(error => {
        console.log('Виникла помилка:', error);
      });
  }

  getDeviceType(typeUrl);

  const allDevice = document.querySelector('.allDevice');
  const deviceUrl = 'https://backend-znpe.onrender.com/api/device';

  function getDevice(deviceUrl) {
    fetch(deviceUrl)
      .then(response => response.json())
      .then(deviceData => {
        for (let i = 0; i < deviceData.rows.length; i++) {
          const deviceDiv = document.createElement('div');
          deviceDiv.id = deviceData.rows[i].id;
          deviceDiv.className = 'deviceCard';

          const deviceName = document.createElement('h6');
          deviceName.innerHTML = deviceData.rows[i].name;
          deviceDiv.appendChild(deviceName);

          const devicePrice = document.createElement('p');
          devicePrice.innerHTML = `${deviceData.rows[i].price} грн`;
          deviceDiv.appendChild(devicePrice);

          const deviceImg = document.createElement('img');
          const path = 'https://backend-znpe.onrender.com/' + deviceData.rows[i].img;
          // const path = '../backend/static/' + deviceData.rows[i].img;
          deviceImg.setAttribute('src', path);
          deviceDiv.appendChild(deviceImg);

          allDevice.appendChild(deviceDiv);

          deviceDiv.addEventListener('click', function() {
            sessionStorage.setItem('id', deviceDiv.id);
            window.location.href = 'pages/fileName.html';
          });
        }
      })
      .catch(error => {
        console.log('Виникла помилка:', error);
      });
  }

  getDevice(deviceUrl);

  const token = sessionStorage.getItem('token');

  if (token) {
    function getBasket() {
      const authUrl = 'https://backend-znpe.onrender.com/api/user/auth';

      fetch(authUrl, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
        .then(response => response.json())
        .then(data => {
          sessionStorage.setItem('basketId', data.basket.id);
        });
    }

    getBasket();
  }

  const basketData = document.querySelector('.basketData');

  let getBasketId = sessionStorage.getItem('basketId');

  function getDevicesInBasket() {  ////
    const basketUrl = `https://backend-znpe.onrender.com/api/basket?basketId=${getBasketId}`;
  
    fetch(basketUrl)
      .then(response => response.json())
      .then(data => {
        let devicePromises = []; 
  
        for (let i = 0; i < data.rows.length; i++) {
          const deviceId = data.rows[i].deviceId;
          const deviceUrl = `https://backend-znpe.onrender.com/api/device/${deviceId}`;
          const basketDeviceId = data.rows[i].id;
  
          const devicePromise = fetch(deviceUrl)
            .then(response => response.json())
            .then(deviceData => {
              showDeviceInBasket(deviceData, basketDeviceId);
              return deviceData.price;
            })
            .catch(error => {
              console.log('Виникла помилка при завантаженні даних товару:', error);
            });
  
          devicePromises.push(devicePromise); 
        }
  
        Promise.all(devicePromises) 
          .then(prices => {
            const totalPrice = prices.reduce((acc, price) => acc + price, 0); 
            showTotalPrice(totalPrice); 
          });
      });
  }  ///
  
//
  function showDeviceInBasket(deviceData, basketDeviceId) {
    const basketDeviceDiv = document.createElement('div');
    basketDeviceDiv.className = 'basketDeviceDiv';

    const basketDeviceImg = document.createElement('img');
    basketDeviceImg.className = 'basketDeviceImg';
    const path = `../../backend/static/${deviceData.img}`;
    basketDeviceImg.setAttribute('src', path);
    basketDeviceDiv.appendChild(basketDeviceImg);

    const basketDeviceName = document.createElement('p');
    basketDeviceName.className = 'basketDeviceName';
    basketDeviceName.innerHTML = deviceData.name;
    basketDeviceDiv.appendChild(basketDeviceName);

    const basketDevicePrice = document.createElement('p');
    basketDevicePrice.className = 'basketDevicePrice';
    basketDevicePrice.innerHTML = `${deviceData.price} грн`;
    basketDeviceDiv.appendChild(basketDevicePrice);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'deleteBtn';
    deleteBtn.innerHTML = 'X';
    basketDeviceDiv.appendChild(deleteBtn);

    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = basketDeviceId;
      const deleteUrl = `https://backend-znpe.onrender.com/api/basket/delete?id=${id}`;

      fetch(deleteUrl, {
        method: 'DELETE'
      })
        .then(response => {
          if (response.ok) {
            deleteBtn.parentNode.remove();
          } else {
            console.log('Сталася помилка під час видалення ресурсу');
          }
        })
        .catch(error => {
          console.error('Помилка під час виконання запиту', error);
        });
        openModal()
    });

    basketData.appendChild(basketDeviceDiv);

  }
  
  function showTotalPrice(totalPrice) {
    let totalPriceP = document.querySelector('.totalprice');
    let orderBtn = document.querySelector('.order')
    let orderDiv = document.querySelector('.orderDiv')
  
    if (totalPrice > 0) {
      totalPriceP.innerHTML = `Всього до сплати ${totalPrice} грн`;
      orderBtn.style.display = 'block'
      totalPriceP.style.color = 'black'
      orderDiv.style.justifyContent = 'space-between'
      orderDiv.style.display = 'flex'
      orderBtn.addEventListener('click', function(){
        window.location.href = 'pages/order.html'
      })
  
    } else {
      totalPriceP.innerHTML = 'Кошик Пустий';
      orderBtn.style.display = 'none'
      totalPriceP.style.color = ' rgba(128, 128, 128, 0.651)'
      totalPriceP.style.textAlign = 'center'
      orderDiv.style.display = 'block'

    }
  }
};
