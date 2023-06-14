
// window.onload = () => {
//   const token = sessionStorage.getItem('token');

//   const redirectBtn = document.querySelector('.redirectUrl');
//   const checkUrl = 'http://localhost:5000/api/user/auth';

//   document.querySelector('.prof').addEventListener('click', function() {
//     if (!token) {
//       redirectBtn.setAttribute('href', 'login.html');
//     } else {
//       fetch(checkUrl, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       })
//         .then(response => response.json())
//         .then(allData => {
//           const isAdmin = allData.userData.userRole;

//           if (isAdmin === 'ADMIN') {
//             window.location.href = 'Admin.html';
//           } else if (isAdmin === 'USER') {
//             showModalWindow(allData);
//           }
//         })
//         .catch(error => {
//           console.log('Виникла помилка:', error);
//         });
//     }
//   });

//   const userName = document.createElement('h1');
//   const userEmail = document.createElement('h2');

//   function showModalWindow(allData) {
//     const modal = document.getElementById('myModal');
//     const closeBtn = document.querySelector('.close');
//     const contentArea = document.querySelector('.userData');

//     modal.style.display = 'block';

//     userName.innerHTML = allData.userData.userName;
//     contentArea.appendChild(userName);

//     userEmail.innerHTML = allData.userData.userEmail;
//     contentArea.appendChild(userEmail);

//     function closeModal() {
//       modal.style.display = 'none';
//     }

//     closeBtn.addEventListener('click', closeModal);

//     const logoutBtn = document.querySelector('.logoutBtn');

//     function logout() {
//       sessionStorage.removeItem('token');
//       closeModal();
//     }

//     function showBasket(){
//       const basketUrl = `http://localhost:5000/api/basket?basketId=${getBasketId}`;
  
  
//       fetch(basketUrl)
//         .then(response => response.json())
//         .then(data => {
//           console.log(data);
//           for(let i = 0; i < data.rows.length;i++){
//             let basketElement = document.createElement(div)

//             // let deviceName = document.createElement(p)
//             deviceName = data.rows[i].deviceId
            
            
//           }
//         });
//     }
//     showBasket()
//     //

//     logoutBtn.onclick = logout;

//     window.addEventListener('click', function(event) {
//       if (event.target == modal) {
//         closeModal();
//       }
//     });
//   }

//   function getBasket() {
//     const authUrl = 'http://localhost:5000/api/user/auth';
//     fetch(authUrl, {
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     })
//       .then(response => response.json())
//       .then(data => {
//         sessionStorage.setItem('basketId', data.basket.id);
//       });
//   }

//   getBasket();

//   const basketData = document.querySelector('.basketData');
//   let getBasketId = sessionStorage.getItem('basketId');
//   let getDeviceId = sessionStorage.getItem('id');



//   const deviceIdUrl = `http://localhost:5000/api/device/${getDeviceId}`;

//   fetch(deviceIdUrl)
//     .then(response => response.json())
//     .then(data => {
//       showDevice(data);
//     })
//     .catch(error => {
//       console.log('Виникла помилка при завантаженні даних товару:', error);
//     });

//   function showDevice(data) {
//     const deviceSection = document.querySelector('.showDevice');
//     const headDiv = document.createElement('div');
//     headDiv.className = 'headDiv';

//     const deviceImg = document.createElement('img');
//     const path = `../../backend/static/${data.img}`;
//     deviceImg.src = path;
//     headDiv.appendChild(deviceImg);

//     const rightDiv = document.createElement('div');

//     const deviceName = document.createElement('h1');
//     deviceName.innerHTML = data.name;
//     rightDiv.appendChild(deviceName);

//     const devicePrice = document.createElement('h2');
//     devicePrice.innerHTML = `${data.price} грн`;
//     rightDiv.appendChild(devicePrice);

//     const buyBtn = document.createElement('button');
//     buyBtn.className = 'buyBtn';
//     buyBtn.innerHTML = 'В корзину';
//     rightDiv.appendChild(buyBtn);

//     buyBtn.addEventListener('click', function() {
//       addDevice();
//     });

//     headDiv.appendChild(rightDiv);
//     deviceSection.appendChild(headDiv);

//     const infoDiv = document.createElement('div');

//     for (let i = 0; i < data.info.length; i++) {
//       const infoElement = document.createElement('div');
//       infoElement.className = 'infoElement';
//       const infoTitle = document.createElement('h5');
//       infoTitle.innerHTML = data.info[i].title;
//       infoElement.appendChild(infoTitle);

//       const infoDescription = document.createElement('h5');
//       infoDescription.innerHTML = data.info[i].description;
//       infoElement.appendChild(infoDescription);

//       infoDiv.appendChild(infoElement);
//     }

//     deviceSection.appendChild(infoDiv);
//   }

//   function addDevice() {
//     const createUrl = 'http://localhost:5000/api/basket/create';

//     let deviceData = {
//       basketId: getBasketId,
//       deviceId: getDeviceId
//     };

//     fetch(createUrl, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       },
//       body: JSON.stringify(deviceData)
//     })
//       .then(response => response.json())
//       .then(data => {
//         console.log('Відповідь сервера:', data);
//       });
//   }
// };
window.onload = () => {
  const token = sessionStorage.getItem('token');
  const redirectBtn = document.querySelector('.redirectUrl');
  const checkUrl = 'http://localhost:5000/api/user/auth';

  document.querySelector('.prof').addEventListener('click', function() {
    if (!token) {
      redirectBtn.setAttribute('href', 'login.html');
    } else {
      fetch(checkUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(allData => {
          const isAdmin = allData.userData.userRole;
          if (isAdmin === 'ADMIN') {
            window.location.href = 'Admin.html';
          } else if (isAdmin === 'USER') {
            showModalWindow(allData);
          }
        })
        .catch(error => {
          console.log('Виникла помилка:', error);
        });
    }
  });

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

    closeBtn.addEventListener('click', closeModal);

    const logoutBtn = document.querySelector('.logoutBtn');

    function logout() {
      sessionStorage.removeItem('token');
      closeModal();
    }

    showAllDevicesInBasket();

    logoutBtn.onclick = logout;

    window.addEventListener('click', function(event) {
      if (event.target == modal) {
        closeModal();
      }
    });
  }

  function getBasket() {
    const authUrl = 'http://localhost:5000/api/user/auth';
    fetch(authUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        sessionStorage.setItem('basketId', data.basket.id);
      });
  }

  getBasket();

  const basketData = document.querySelector('.basketData');
  let getBasketId = sessionStorage.getItem('basketId');
  let getDeviceId = sessionStorage.getItem('id');

  const deviceIdUrl = `http://localhost:5000/api/device/${getDeviceId}`;

  fetch(deviceIdUrl)
    .then(response => response.json())
    .then(data => {
      showDevice(data);
    })
    .catch(error => {
      console.log('Виникла помилка при завантаженні даних товару:', error);
    });

  function showDevice(data) {
    const deviceSection = document.querySelector('.showDevice');
    const headDiv = document.createElement('div');
    headDiv.className = 'headDiv';

    const deviceImg = document.createElement('img');
    const path = `../../backend/static/${data.img}`;
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
    buyBtn.innerHTML = 'В корзину';
    rightDiv.appendChild(buyBtn);

    buyBtn.addEventListener('click', function() {
      addDevice();
    });

    headDiv.appendChild(rightDiv);
    deviceSection.appendChild(headDiv);

    const infoDiv = document.createElement('div');

    for (let i = 0; i < data.info.length; i++) {
      const infoElement = document.createElement('div');
      infoElement.className = 'infoElement';
      const infoTitle = document.createElement('h5');
      infoTitle.innerHTML = data.info[i].title;
      infoElement.appendChild(infoTitle);

      const infoDescription = document.createElement('h5');
      infoDescription.innerHTML = data.info[i].description;
      infoElement.appendChild(infoDescription);

      infoDiv.appendChild(infoElement);
    }

    deviceSection.appendChild(infoDiv);
  }

  function addDevice() {
    const createUrl = 'http://localhost:5000/api/basket/create';

    let deviceData = {
      basketId: getBasketId,
      deviceId: getDeviceId
    };

    fetch(createUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(deviceData)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Відповідь сервера:', data);
      });
  }

  function showAllDevicesInBasket() {
    const basketUrl = `http://localhost:5000/api/basket?basketId=${getBasketId}`;

    fetch(basketUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        for (let i = 0; i < data.rows.length; i++) {
          const deviceId = data.rows[i].deviceId;
          const deviceUrl = `http://localhost:5000/api/device/${deviceId}`;

          fetch(deviceUrl)
            .then(response => response.json())
            .then(deviceData => {
              showDeviceInBasket(deviceData); // tyt
            })
            .catch(error => {
              console.log('Виникла помилка при завантаженні даних товару:', error);
            });
        }
      });
  }

  // basketData.addEventListener('click', function() {
  //   showAllDevicesInBasket();
  // });
};
