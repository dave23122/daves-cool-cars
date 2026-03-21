const API = "YOUR_WORKER_URL_HERE";

/* ---------- CAR DATA ---------- */
const cars = [
  {
    name: "Lamborghini",
    img: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Lamborghini_Aventador.jpg"
  },
  {
    name: "Ferrari",
    img: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Ferrari_488.jpg"
  },
  {
    name: "Rolls Royce",
    img: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Rolls-Royce_Phantom.jpg"
  }
];

let selectedCar = null;

/* ---------- DROPDOWN ---------- */
function initDropdown() {
  const container = document.getElementById("carDropdown");

  cars.forEach(car => {
    const div = document.createElement("div");
    div.className = "dropdown-item";
    div.innerHTML = `<img src="${car.img}"><span>${car.name}</span>`;

    div.onclick = () => {
      selectedCar = car.name;
      renderFields();
    };

    container.appendChild(div);
  });
}

/* ---------- FIELDS ---------- */
function renderFields() {
  const el = document.getElementById("customFields");
  el.innerHTML = `
    <label>Color</label>
    <input id="color">

    <label>Interior</label>
    <select id="interior">
      <option>Leather</option>
      <option>Alcantara</option>
    </select>

    <label>Extras</label>
    <input id="extras" placeholder="Sunroof, Sport Package">
  `;
}

/* ---------- SUBMIT ---------- */
async function submitOrder() {
  const data = {
    car: selectedCar,
    color: document.getElementById("color").value,
    interior: document.getElementById("interior").value,
    extras: document.getElementById("extras").value
  };

  await fetch(API + "/create", {
    method: "POST",
    body: JSON.stringify(data)
  });

  alert("Order placed!");
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
      <th>Color</th>
      <th>Interior</th>
      <th>Extras</th>
    </tr>
  `;

  orders.forEach(o => {
    table.innerHTML += `
      <tr>
        <td><input type="checkbox" value="${o.id}"></td>
        <td>${o.car}</td>
        <td>${o.color}</td>
        <td>${o.interior}</td>
        <td>${o.extras}</td>
      </tr>
    `;
  });

  document.querySelectorAll("input[type=checkbox]").forEach(cb => {
    cb.onchange = updateButtons;
  });
}

/* ---------- BUTTON STATE ---------- */
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
  if (!confirm("Are you sure?")) return;

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

  alert("Invoice sent!");
}

/* ---------- INIT ---------- */
if (document.getElementById("carDropdown")) initDropdown();
if (document.getElementById("ordersTable")) loadOrders();