
window.onload = () => {

let profBtn = document.querySelector('.prof')
let orderBtn = document.querySelector('.order')

profBtn.addEventListener('click', function() {
  openModal()
});

  let deviceSection = document.querySelector('.showDevice');
  let basketData = document.querySelector('.basketData');

  function openModal(){
  const redirectBtn = document.querySelector('.redirectUrl');
  const token = sessionStorage.getItem('token');
  const checkUrl = 'https://backend-znpe.onrender.com/api/user/auth';

  if (!token) {
    redirectBtn.setAttribute('href', 'login.html');
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
        showModalWindow(allData.userData);
      }
    })
    .catch(error => {
      console.log('Виникла помилка:', error);
    });
}
//

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
          window.location.href = 'filtredPage.html';
        });
      }
    })
    .catch(error => {
      console.log('Виникла помилка:', error);
    });
}

getDeviceType(typeUrl);

let userName = document.createElement('h1');
let userEmail = document.createElement('h2');
function showModalWindow(userData) {
  let modal = document.getElementById('myModal');
  let closeBtn = document.querySelector('.close');
  let contentArea = document.querySelector('.userData');

  modal.style.display = 'block';


  userName.innerHTML = userData.userName;
  contentArea.appendChild(userName);


  userEmail.innerHTML = userData.userEmail;
  contentArea.appendChild(userEmail);

  function closeModal() {
    modal.style.display = 'none';
  }

  closeBtn.addEventListener('click', closeModal);

  const logoutBtn = document.querySelector('.logoutBtn');

  function logout() {
    sessionStorage.removeItem('token');
    closeModal();
  }

  basketData.innerHTML = '';
  getDevicesInBasket();

  logoutBtn.onclick = logout;

  window.addEventListener('click', event => {
    if (event.target == modal) {
      closeModal();
    }
  });
}

async function getBasket() {
  let token = sessionStorage.getItem('token');
  const authUrl = 'https://backend-znpe.onrender.com/api/user/auth';
  try {
    const response = await fetch(authUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    sessionStorage.setItem('basketId', data.basket.id);
  } catch (error) {
    console.log('Виникла помилка:', error);
  }
}

async function showDevice(data) {
  const headDiv = document.createElement('div');
  headDiv.className = 'headDiv';

  const deviceImg = document.createElement('img');
  const path = 'https://backend-znpe.onrender.com/' + data.img;
  deviceImg.src = path;
  headDiv.appendChild(deviceImg);

  const rightDiv = document.createElement('div');

  const deviceName = document.createElement('h1');
  deviceName.innerHTML = data.name;
  rightDiv.appendChild(deviceName);

  const devicePrice = document.createElement('h2');
  devicePrice.innerHTML = `${data.price} грн`;
  rightDiv.appendChild(devicePrice);

  const buyBtn = document.createElement('button');
  buyBtn.className = 'buyBtn';
  buyBtn.innerHTML = 'В кошик';
  rightDiv.appendChild(buyBtn);

  buyBtn.addEventListener('click', addDevice);

  headDiv.appendChild(rightDiv);
  deviceSection.appendChild(headDiv);

  const infoDiv = document.createElement('div');
  infoDiv.className = 'infoDiv'

  data.info.forEach(info => {
    const infoElement = document.createElement('div');
    infoElement.className = 'infoElement';

    const infoTitle = document.createElement('h5');
    infoTitle.innerHTML = info.title;
    infoElement.appendChild(infoTitle);

    const infoDescription = document.createElement('h5');
    infoDescription.innerHTML = info.description;
    infoElement.appendChild(infoDescription);

    infoDiv.appendChild(infoElement);
  });

  deviceSection.appendChild(infoDiv);
}

async function addDevice() {
  let buyBtn = document.querySelector('.buyBtn')
  buyBtn.classList.add('clicked');
  let token = sessionStorage.getItem('token')
  if(token){
    const createUrl = 'https://backend-znpe.onrender.com/api/basket/create';
    const getBasketId = sessionStorage.getItem('basketId');
    const getDeviceId = sessionStorage.getItem('id');

    const deviceData = {
      basketId: getBasketId,
      deviceId: getDeviceId
    };

    try {
      const response = await fetch(createUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(deviceData)
      });
      const data = await response.json();
      // console.log('Відповідь сервера:', data);
      
    } catch (error) {
      console.log('Виникла помилка:', error);
    }
  }
  else{
    alert('Зареєструйтесь')
  }
}

let getBasketId = sessionStorage.getItem('basketId');

function getDevicesInBasket() {  
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
}  

function showDeviceInBasket(deviceData, basketDeviceId) {

  const basketDeviceDiv = document.createElement('div');
  basketDeviceDiv.className = 'basketDeviceDiv';

  const basketDeviceImg = document.createElement('img');
  basketDeviceImg.className = 'basketDeviceImg';
  const path = 'https://backend-znpe.onrender.com/' + deviceData.img;
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

  deleteBtn.addEventListener('click', async e => {
    e.preventDefault();
    const id = basketDeviceId;
    const deleteUrl = `https://backend-znpe.onrender.com/api/basket/delete?id=${id}`;

    try {
      const response = await fetch(deleteUrl, {
        method: 'DELETE'
      });
      if (response.ok) {
        deleteBtn.parentNode.remove();
      } else {
        console.log('Сталася помилка під час видалення ресурсу');
      }
    } catch (error) {
      console.error('Помилка під час виконання запиту', error);
    }
    openModal()
  });

  basketData.appendChild(basketDeviceDiv);
}

async function fetchDeviceData(deviceIdUrl) {
  try {
    const response = await fetch(deviceIdUrl);
    const data = await response.json();
    showDevice(data);
  } catch (error) {
    console.log('Виникла помилка при завантаженні даних товару:', error);
  }
}

const getDeviceId = sessionStorage.getItem('id');
const deviceIdUrl = `https://backend-znpe.onrender.com/api/device/${getDeviceId}`;
fetchDeviceData(deviceIdUrl);

function checkToken(){
  let token = sessionStorage.getItem('token')
  if(token){
    getBasket();
  }
}
checkToken()


function showTotalPrice(totalPrice) {
  let totalPriceP = document.querySelector('.totalprice');

  let orderDiv = document.querySelector('.orderDiv')

  if (totalPrice > 0) {
    totalPriceP.innerHTML = `Всього до сплати ${totalPrice} грн`;
    orderBtn.style.display = 'block'
    totalPriceP.style.color = 'black'
    orderDiv.style.justifyContent = 'space-between'
    orderDiv.style.display = 'flex'
    orderBtn.addEventListener('click', function(){
      window.location.href = 'order.html'
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


