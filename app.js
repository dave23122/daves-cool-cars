const API = "YOUR_WORKER_URL_HERE";

/* ---------- CAR DATA ---------- */
const cars = [
  { name: "Lamborghini Aventador", price: 500000, img: "https://images.unsplash.com/photo-1621135802920-133df287f89c" },
  { name: "Ferrari 488", price: 400000, img: "https://images.unsplash.com/photo-1597687228894-111db66403b6" },
  { name: "Rolls Royce Phantom", price: 600000, img: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6" },
  { name: "Bugatti Chiron", price: 3000000, img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b" },
  { name: "McLaren 720S", price: 450000, img: "https://images.unsplash.com/photo-1553440569-bcc63803a83d" },
  { name: "Porsche 911 Turbo", price: 250000, img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70" },
  { name: "Aston Martin DB11", price: 300000, img: "https://images.unsplash.com/photo-1642201855395-1c8b44e6e42b" },
  { name: "Bentley Continental GT", price: 350000, img: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c" },
  { name: "Mercedes AMG GT", price: 280000, img: "https://images.unsplash.com/photo-1502877338535-766e1452684a" },
  { name: "Audi R8", price: 220000, img: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a" }
];

let selectedCar = null;

/* ---------- DROPDOWN ---------- */
function initDropdown() {
  const container = document.getElementById("carDropdown");

  cars.forEach(car => {
    const div = document.createElement("div");
    div.className = "dropdown-item";

    div.innerHTML = `
      <img src="${car.img}">
      <h3>${car.name}</h3>
      <p>$${car.price.toLocaleString()}</p>
    `;

    div.onclick = () => {
      selectedCar = car;
      renderFields();
    };

    container.appendChild(div);
  });
}

/* ---------- FIELDS ---------- */
function renderFields() {
  document.getElementById("customFields").innerHTML = `
    <label>Color</label>
    <input id="color">

    <label>Interior</label>
    <select id="interior">
      <option>Leather (+$5,000)</option>
      <option>Alcantara (+$7,000)</option>
    </select>

    <label>Extras</label>
    <input id="extras" placeholder="Sport package, carbon kit">
  `;
}

/* ---------- SUBMIT ---------- */
async function submitOrder() {
  if (!selectedCar) return alert("Select a car");

  const data = {
    car: selectedCar.name,
    basePrice: selectedCar.price,
    color: document.getElementById("color").value,
    interior: document.getElementById("interior").value,
    extras: document.getElementById("extras").value
  };

  await fetch(API + "/create", {
    method: "POST",
    body: JSON.stringify(data)
  });

  alert("Luxury order placed 🚗");
}

/* ---------- LOAD ORDERS ---------- */
async function loadOrders() {
  const res = await fetch(API + "/orders");
  const orders = await res.json();

  const table = document.getElementById("ordersTable");

  table.innerHTML = `
    <tr>
      <th></th>
      <th>Car</th>
      <th>Price</th>
      <th>Specs</th>
    </tr>
  `;

  orders.forEach(o => {
    table.innerHTML += `
      <tr>
        <td><input type="checkbox" value="${o.id}"></td>
        <td>${o.car}</td>
        <td>$${o.basePrice}</td>
        <td>${o.color}, ${o.interior}, ${o.extras}</td>
      </tr>
    `;
  });

  document.querySelectorAll("input[type=checkbox]").forEach(cb => {
    cb.onchange = updateButtons;
  });
}

/* ---------- BUTTONS ---------- */
function getSelected() {
  return [...document.querySelectorAll("input:checked")].map(x => x.value);
}

function updateButtons() {
  const has = getSelected().length > 0;
  document.getElementById("invoiceBtn").disabled = !has;
  document.getElementById("deleteBtn").disabled = !has;
}

/* ---------- DELETE ---------- */
async function deleteOrders() {
  if (!confirm("Delete selected orders?")) return;

  await fetch(API + "/delete", {
    method: "POST",
    body: JSON.stringify(getSelected())
  });

  loadOrders();
}

/* ---------- INVOICE ---------- */
async function sendInvoice() {
  const email = prompt("Enter email:");
  if (!email) return;

  await fetch(API + "/invoice", {
    method: "POST",
    body: JSON.stringify({
      ids: getSelected(),
      email
    })
  });

  alert("Invoice sent ✉️");
}

/* ---------- INIT ---------- */
if (document.getElementById("carDropdown")) initDropdown();
if (document.getElementById("ordersTable")) loadOrders();