const API = "https://daves-cool-cars-api.daves-cool-cars-api.workers.dev";

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

/* ---------- CONFIG OPTIONS ---------- */
const configOptions = [
  {
    id: "color",
    label: "Exterior Color",
    options: ["Black Metallic", "Pearl White", "Rosso Red", "Midnight Blue", "Graphite Grey"]
  },
  {
    id: "interior",
    label: "Interior Material",
    options: ["Leather", "Premium Leather", "Alcantara", "Quilted Leather", "Carbon Performance Interior"]
  },
  {
    id: "wheel",
    label: "Wheel Design",
    options: ["20\" Performance", "21\" Forged", "Diamond-Cut Alloy", "Black Gloss Sport", "Carbon Aero Wheels"]
  },
  {
    id: "brake",
    label: "Brake Package",
    options: ["Standard Performance", "Carbon Ceramic", "Track Performance", "High-Endurance", "Red Caliper Sport"]
  },
  {
    id: "sound",
    label: "Audio System",
    options: ["Standard Premium", "Bose Surround", "Bowers & Wilkins", "Bang & Olufsen", "Bespoke Studio Audio"]
  },
  {
    id: "roof",
    label: "Roof Style",
    options: ["Standard Coupe", "Panoramic Glass", "Carbon Fiber Roof", "Convertible", "Black Contrast Roof"]
  },
  {
    id: "seats",
    label: "Seat Style",
    options: ["Comfort Seats", "Sport Seats", "Ventilated Luxury Seats", "Heated GT Seats", "Track Bucket Seats"]
  },
  {
    id: "trim",
    label: "Trim Finish",
    options: ["Brushed Aluminum", "Open-Pore Wood", "Piano Black", "Carbon Fiber", "Satin Titanium"]
  },
  {
    id: "lighting",
    label: "Lighting Package",
    options: ["Standard LED", "Adaptive Matrix LED", "Ambient Signature Lighting", "Laser Headlights", "Night Vision Assist"]
  },
  {
    id: "assistance",
    label: "Driver Assistance",
    options: ["Standard Assist", "Parking Pack", "Highway Assist", "360° Camera Pack", "Full Luxury Assist Suite"]
  }
];

/* ---------- DROPDOWN / CAR GRID ---------- */
function initDropdown() {
  const container = document.getElementById("carDropdown");
  if (!container) return;

  container.innerHTML = "";

  cars.forEach(car => {
    const div = document.createElement("div");
    div.className = "dropdown-item";

    div.innerHTML = `
      <img src="${car.img}" alt="${car.name}">
      <div class="car-name">${car.name}</div>
      <p class="car-price">$${car.price.toLocaleString()}</p>
    `;

    div.onclick = () => {
      selectedCar = car;

      document.querySelectorAll(".dropdown-item").forEach(el => {
        el.classList.remove("selected");
      });

      div.classList.add("selected");
      renderFields();
    };

    container.appendChild(div);
  });
}

/* ---------- CONFIG FORM ---------- */
function renderFields() {
  const container = document.getElementById("customFields");
  if (!container) return;

  const fieldsHtml = configOptions.map(field => `
    <div class="form-field">
      <label for="${field.id}">${field.label}</label>
      <select id="${field.id}">
        ${field.options.map(option => `<option>${option}</option>`).join("")}
      </select>
    </div>
  `).join("");

  container.innerHTML = `
    <div class="configurator-shell">
      <div class="config-card">
        <div class="config-header">
          <h3 class="config-title">Customize Your ${selectedCar.name}</h3>
          <p class="config-subtitle">
            Refine every detail of your vehicle with a curated selection of premium finishes and luxury options.
          </p>
        </div>

        <div class="form-grid">
          ${fieldsHtml}
        </div>

        <div class="config-actions">
          <button class="btn btn-primary" onclick="submitOrder()">Place Order</button>
        </div>
      </div>
    </div>
  `;
}

/* ---------- COLLECT CONFIG VALUES ---------- */
function collectConfiguration() {
  const config = {};
  configOptions.forEach(field => {
    const el = document.getElementById(field.id);
    config[field.id] = el ? el.value : "";
  });
  return config;
}

/* ---------- SUBMIT ORDER ---------- */
async function submitOrder() {
  if (!selectedCar) {
    alert("Please select a car first.");
    return;
  }

  const config = collectConfiguration();

  const data = {
    car: selectedCar.name,
    basePrice: selectedCar.price,
    ...config
  };

  await fetch(API + "/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  alert("Luxury order placed successfully.");
}

/* ---------- LOAD ORDERS ---------- */
async function loadOrders() {
  const table = document.getElementById("ordersTable");
  if (!table) return;

  const res = await fetch(API + "/orders");
  const orders = await res.json();

  table.innerHTML = `
    <thead>
      <tr>
        <th style="width: 56px;"></th>
        <th>Car</th>
        <th>Base Price</th>
        <th>Configuration</th>
      </tr>
    </thead>
    <tbody>
      ${orders.map(o => `
        <tr>
          <td><input type="checkbox" value="${o.id}"></td>
          <td>${o.car}</td>
          <td>$${Number(o.basePrice).toLocaleString()}</td>
          <td class="specs-cell">
            <strong>Exterior:</strong> ${o.color || "-"}<br>
            <strong>Interior:</strong> ${o.interior || "-"}<br>
            <strong>Wheels:</strong> ${o.wheel || "-"}<br>
            <strong>Brakes:</strong> ${o.brake || "-"}<br>
            <strong>Audio:</strong> ${o.sound || "-"}<br>
            <strong>Roof:</strong> ${o.roof || "-"}<br>
            <strong>Seats:</strong> ${o.seats || "-"}<br>
            <strong>Trim:</strong> ${o.trim || "-"}<br>
            <strong>Lighting:</strong> ${o.lighting || "-"}<br>
            <strong>Driver Assist:</strong> ${o.assistance || "-"}
          </td>
        </tr>
      `).join("")}
    </tbody>
  `;

  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.onchange = updateButtons;
  });
}

/* ---------- SELECTED IDS ---------- */
function getSelected() {
  return [...document.querySelectorAll('tbody input[type="checkbox"]:checked')].map(x => x.value);
}

/* ---------- BUTTON STATE ---------- */
function updateButtons() {
  const has = getSelected().length > 0;
  const invoiceBtn = document.getElementById("invoiceBtn");
  const deleteBtn = document.getElementById("deleteBtn");

  if (invoiceBtn) invoiceBtn.disabled = !has;
  if (deleteBtn) deleteBtn.disabled = !has;
}

/* ---------- DELETE ---------- */
async function deleteOrders() {
  if (!confirm("Are you sure you want to delete the selected orders?")) return;

  await fetch(API + "/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(getSelected())
  });

  loadOrders();
}

/* ---------- SEND INVOICE ---------- */
async function sendInvoice() {
  const email = prompt("Enter the email address to send the invoice to:");
  if (!email) return;

  await fetch(API + "/invoice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      ids: getSelected(),
      email
    })
  });

  alert("Invoice sent successfully.");
}

/* ---------- INIT ---------- */
if (document.getElementById("carDropdown")) initDropdown();
if (document.getElementById("ordersTable")) loadOrders();