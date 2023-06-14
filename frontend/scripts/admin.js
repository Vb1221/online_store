window.onload = () => {

    let typeUrl = 'http://localhost:5000/api/type'
  // створення нового типу товара
  function createNewType(){
    let token = sessionStorage.getItem('token')

    let typeInput = document.querySelector('.createType').value
    let newType = {name: typeInput}

    fetch(typeUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newType)
    })
    .then(response => response.json())
    .then(data => {
     console.log(data)
    })
    .catch(error => {
      // Обробка помилки
      console.log('Сталася помилка при створенні нового типу:', error);
    });
  }

  document.querySelector('.submitCreateNewType').onclick = createNewType

  // створення нового бренду товара

 let brandUrl = 'http://localhost:5000/api/brand'

  function createNewBrand(){
    let token = sessionStorage.getItem('token')
   
    let brandInput = document.querySelector('.createBrand').value
    let newBrand = {name: brandInput}

    fetch(brandUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newBrand)
    })
    .then(response => response.json())
    .then(data => {
     console.log(data)
    })
    .catch(error => {
      // Обробка помилки
      console.log('Сталася помилка при створенні нового типу:', error);
    });
  }

  document.querySelector('.submitCreateNewBrand').onclick = createNewBrand

  /// створення нового товара

  function typeSelect() {
    let deviceType = [];
    let brandDevice = [];
  
    function showSuggestions() {
      fetch(typeUrl)
        .then(response => response.json())
        .then(dataType => {
          for (let i = 0; i < dataType.length; i++) {
            deviceType.push({ name: dataType[i].name, id: dataType[i].id });
          }
          return fetch(brandUrl);
        })
        .then(response => response.json())
        .then(data => {
          for (let i = 0; i < data.length; i++) {
            brandDevice.push({ name: data[i].name, id: data[i].id });
          }
          typeSelectHelper(deviceType, brandDevice);
        })
        .catch(error => {
          console.log('Виникла помилка:', error);
        });
    }
  
    showSuggestions();
  }
  
  function typeSelectHelper(deviceType, brandDevice) {
    let selectElement = document.getElementById('typeSelect');
    selectElement.innerHTML = '';
  
    for (let i = 0; i < deviceType.length; i++) {
      let option = document.createElement('option');
      option.value = deviceType[i].id;
      option.textContent = deviceType[i].name;
      selectElement.appendChild(option);
    }
  
    let selectBrand = document.getElementById('brandSelect');
    selectBrand.innerHTML = '';
  
    for (let i = 0; i < brandDevice.length; i++) {
      let option = document.createElement('option');
      option.value = brandDevice[i].id;
      option.textContent = brandDevice[i].name;
      selectBrand.appendChild(option);
    }
  }
  

  typeSelect();
  
  //

  let createDeviceBtn = document.querySelector('.createDevice');

  let descriptionArea = document.querySelector('.descriptionArea')
  let descriptionBtn = document.querySelector('.descriptionBtn')
  function addDescription(e){
    e.preventDefault();
    let titleInput = document.createElement('input')
    titleInput.className = 'titleDescription'
    descriptionArea.appendChild(titleInput)

    let description = document.createElement('textarea')
    description.className = 'description'
    descriptionArea.appendChild(description)
}

descriptionBtn.onclick = addDescription

function createDevice(e) {
  e.preventDefault();

  let infoTitle = document.querySelectorAll('.titleDescription')
  let infoDescription = document.querySelectorAll('.description')

  let info = []
  for (let i = 0; i < infoTitle.length; i++) {
    let title = infoTitle[i].value;
    let description = infoDescription[i].value;

  let newData = {
    title: title,
    description:  description
  }
  info.push(newData);
  }

  let deviceName = document.querySelector('.deviceName').value;
  let devicePrice = document.querySelector('.devicePrice').value;
  let selectElement = document.getElementById('typeSelect').value;
  let selectBrand = document.getElementById('brandSelect').value;
  let deviceImg = document.querySelector('.deviceImg').files[0];

  let formData = new FormData();
  formData.append('name', deviceName);
  formData.append('price', devicePrice);
  formData.append('brandId', selectBrand);
  formData.append('typeId', selectElement);
  formData.append('img', deviceImg);
  formData.append('info', JSON.stringify(info));


  const deviceUrl = 'http://localhost:5000/api/device';
  let token = sessionStorage.getItem('token')

  fetch(deviceUrl, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
    },
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.log('Виникла помилка:', error);
    });
}


createDeviceBtn.onclick = createDevice;

}