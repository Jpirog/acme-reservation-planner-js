console.log('in src/index.js')
const userList = document.querySelector('#users-list');
const restList = document.querySelector('#restaurants-list');
const reservationList = document.querySelector('#reservations-list');

const renderUsers = async (users) => {
  const userId = window.location.hash.slice(1) * 1;
  const html = users.map(c => `
  <li class='users' data-userid='${c.id}' >
  <a href='#${c.id}'>${c.name}</a>
  </li>
  `).join('');
  userList.innerHTML = html;
}

const renderRestaurants = async (restaurants) => {
  const html = restaurants.map(c => `
  <li class='rest' data-restid='${c.id}'>
  ${c.name}
  </li>
  `).join('');
  restList.innerHTML = html;
}

const renderReservations = async (reservations) => {
  const html = reservations.map(c => `
  <li>
  ${c.restaurant.name}<span data-resid=${c.id}>Cancel</span>
  </li>
  `).join('');
  reservationList.innerHTML = html;
}

const init = async () => {
  try {
    const response = await fetch('/api/users');
    const data = await response.json()
    renderUsers(data);    
    const response2 = await fetch('/api/restaurants');
    const data2 = await response2.json()
    renderRestaurants(data2);
  }
  catch (ex) {
    console.log(ex);
  }
}

window.addEventListener('hashchange', async () => {
  const userId = window.location.hash.slice(1);
  console.log('you selected',userId)
  const response = await (fetch(`/api/users/${userId}/reservations`))
  const data = await response.json()
  renderReservations(data);
  const users = document.querySelectorAll('.users')
  users.forEach(c => userId == c.dataset.userid ? c.classList.add('selected') : c.classList.remove('selected')); 
})

restList.addEventListener('click', async (ev) => {
  const clickedId = ev.target.dataset.restid;
  const userId = window.location.hash.slice(1);
  
  if (!userId) {
    alert("Select a user before selecting a restaurant for a reservation")
    return;
  };
  
  console.log("NEW reservation", userId, clickedId)
  const newRes = await (fetch(`/api/users/${userId}/reservations`, 
    { method: 'POST', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({"restaurantId": clickedId}) }))

  const response = await (fetch(`/api/users/${userId}/reservations`))
  const data = await response.json()
  renderReservations(data);
})

reservationList.addEventListener('click', async (ev) => {
  console.log("DELETE", ev.target.tagName, ev.target.dataset.resid)
  if (ev.target.tagName === 'SPAN') {
    const resToCancel = ev.target.dataset.resid;
    const newRes = await (fetch(`/api/reservations/${resToCancel}`, 
      { method: 'DELETE', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"Id": resToCancel}) }))

    const userId = window.location.hash.slice(1);
    const response = await (fetch(`/api/users/${userId}/reservations`))
    const data = await response.json()
    renderReservations(data);
  }
})
init();
