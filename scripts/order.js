
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

  function validateData(){
    let phone = document.getElementById('phone');
    let city = document.getElementById('address');
    let mail = document.getElementById('addressNP');

    let phoneReg = /^(050|066|067|068|091|092|093|094|095|096|097|098|099)\d{7}$/;
    let locationRegex = /^[А-Яа-яії]*\s?[А-Яа-яії]+?\s?[А-Яа-яії]+?\s?[А-Яа-яії]+?\s?[А-Яа-яії]+?$/;
    let mailRegex = /^\d+$/


    phone.addEventListener('input', function(){
      console.log(1)
      let number = phone.value
      if(number.match(phoneReg)){
        phone.style.borderColor = 'green'
        phone.style.backgroundColor = '#58d358'
      }else{
        phone.style.borderColor = 'red'
        phone.style.backgroundColor = '#efa4a4'
      }
    })
    city.addEventListener('input', function(){
      let location = city.value
      if(location.match(locationRegex)){
        city.style.borderColor = 'green'
        city.style.backgroundColor = '#58d358'
      }else{
        city.style.borderColor = 'red'
        city.style.backgroundColor = '#efa4a4'
      }
    })
    mail.addEventListener('input', function(){
      let mailNum = mail.value
      if(mailNum.match(mailRegex)){
        mail.style.borderColor = 'green'
        mail.style.backgroundColor = '#58d358'
      }else{
        mail.style.borderColor = 'red'
        mail.style.backgroundColor = '#efa4a4'
      }
    })
  }
  validateData()
};
