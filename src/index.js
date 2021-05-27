console.log('in src/index.js')
const userList = document.querySelector('#users-list');
const restList = document.querySelector('#restaurants-list');
const reservationList = document.querySelector('#reservations-list');
console.log(userList)

const renderUsers = async (users) => {
  const html = users.map(c => `
  <li>
  <a href='#${c.id}'>${c.name}</a>
  </li>
  `).join('');
  userList.innerHTML = html;
}

const renderRestaurants = async (restaurants) => {
  const html = restaurants.map(c => `
  <li>
  ${c.id}/${c.name}
  </li>
  `).join('');
  restList.innerHTML = html;
}

const renderReservations = async (reservations) => {
  const html = reservations.map(c => `
  <li>
  ${c.id}/${c.name}
  </li>
  `).join('');
  reservationList.innerHTML = html;
}

const init = async () => {
  try {
    const response = await fetch('/api/users');
    const data = await response.json()
    console.log(data[0].name);
    renderUsers(data);    
    const response2 = await fetch('/api/restaurants');
    const data2 = await response2.json()
    console.log(data2[0].name);
    renderRestaurants(data2);
  }
  catch (ex) {

  }
}

window.addEventListener('hashchange', async () => {
  const userId = window.location.hash.slice(1);
  const response = await (fetch(`/api/users/${userId}/reservations`))
  const data = await response.json()
  renderReservations(data);
})

init();