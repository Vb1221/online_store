
window.onload = () => {
  function getBasket() {
    let basketId = sessionStorage.getItem('basketId');
    const basketUrl = `https://backend-znpe.onrender.com/api/basket?basketId=${basketId}`;
    fetch(basketUrl)
      .then((response) => response.json())
      .then((data) => {
        getDevice(data);
      });
  }

  function getDevice(data) {
    for (let i = 0; i < data.rows.length; i++) {
      let deviceId = data.rows[i].deviceId;
      const basketDeviceId = data.rows[i].id;
      const deviceUrl = `https://backend-znpe.onrender.com/api/device/${deviceId}`;
      fetch(deviceUrl)
        .then((response) => response.json())
        .then((deviceData) => {
          showDevice(deviceData, basketDeviceId);
        });
    }
  }

  let devicesDiv = document.querySelector('.createOrder');

  function showDevice(deviceData, basketDeviceId) {
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

    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = basketDeviceId;
      const deleteUrl = `https://backend-znpe.onrender.com/api/basket/delete?id=${id}`;

      fetch(deleteUrl, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            deleteBtn.parentNode.remove();
            updateTotalPrice(deviceData);
          } else {
            console.log('Сталася помилка під час видалення ресурсу');
          }
        })
        .catch((error) => {
          console.error('Помилка під час виконання запиту', error);
        });
    });

    devicesDiv.appendChild(basketDeviceDiv);
    showTotalPrice(deviceData);
  }

  let totalPrice = 0;

  function showTotalPrice(deviceData) {
    totalPrice += deviceData.price;
    const totalPriceP = document.querySelector('.totalPrice');
    totalPriceP.innerHTML = `Всього до сплати ${totalPrice} грн`;
  }

  function updateTotalPrice(deviceData) {
    totalPrice -= deviceData.price;
    const totalPriceP = document.querySelector('.totalPrice');
    totalPriceP.innerHTML = `Всього до сплати ${totalPrice} грн`;
  }

  getBasket();
};
