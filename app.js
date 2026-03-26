const API = "https://daves-cool-cars-api.daves-cool-cars-api.workers.dev";

/* =========================
   EMAILJS CONFIG
========================= */
const EMAILJS_PUBLIC_KEY = "pznpgQQTb1kDmyvxc";
const EMAILJS_SERVICE_ID = "service_mzkki19";
const EMAILJS_TEMPLATE_ID = "template_lei0z72";

/* ---------- CAR DATA ---------- */
const cars = [
  { name: "Lamborghini Aventador", price: 500000, img: "images/lamborghini-aventador.webp" },
  { name: "Ferrari 488", price: 400000, img: "images/ferrari-488.webp" },
  { name: "Rolls Royce Phantom", price: 600000, img: "images/rolls-royce-phantom.webp" },
  { name: "Bugatti Chiron", price: 3000000, img: "images/bugatti-chiron.webp" },
  { name: "McLaren 720S", price: 450000, img: "images/mclaren-720s.webp" },
  { name: "Porsche 911 Turbo", price: 250000, img: "images/porsche-911-turbo.webp" },
  { name: "Aston Martin DB11", price: 300000, img: "images/aston-martin-db11.webp" },
  { name: "Bentley Continental GT", price: 350000, img: "images/bentley-continental-gt.webp" },
  { name: "Mercedes AMG GT", price: 280000, img: "images/mercedes-amg-gt.webp" },
  { name: "Audi R8", price: 220000, img: "images/audi-r8.webp" }
];

let selectedCar = null;

/* ---------- CONFIG OPTIONS ---------- */
const configOptions = [
  { id: "color", label: "Exterior Color", options: ["Black Metallic", "Pearl White", "Rosso Red", "Midnight Blue", "Graphite Grey"] },
  { id: "interior", label: "Interior Material", options: ["Leather", "Premium Leather", "Alcantara", "Quilted Leather", "Carbon Performance Interior"] },
  { id: "wheel", label: "Wheel Design", options: ["20\" Performance", "21\" Forged", "Diamond-Cut Alloy", "Black Gloss Sport", "Carbon Aero Wheels"] },
  { id: "brake", label: "Brake Package", options: ["Standard Performance", "Carbon Ceramic", "Track Performance", "High-Endurance", "Red Caliper Sport"] },
  { id: "sound", label: "Audio System", options: ["Standard Premium", "Bose Surround", "Bowers & Wilkins", "Bang & Olufsen", "Bespoke Studio Audio"] },
  { id: "roof", label: "Roof Style", options: ["Standard Coupe", "Panoramic Glass", "Carbon Fiber Roof", "Convertible", "Black Contrast Roof"] },
  { id: "seats", label: "Seat Style", options: ["Comfort Seats", "Sport Seats", "Ventilated Luxury Seats", "Heated GT Seats", "Track Bucket Seats"] },
  { id: "trim", label: "Trim Finish", options: ["Brushed Aluminum", "Open-Pore Wood", "Piano Black", "Carbon Fiber", "Satin Titanium"] },
  { id: "lighting", label: "Lighting Package", options: ["Standard LED", "Adaptive Matrix LED", "Ambient Signature Lighting", "Laser Headlights", "Night Vision Assist"] },
  { id: "assistance", label: "Driver Assistance", options: ["Standard Assist", "Parking Pack", "Highway Assist", "360° Camera Pack", "Full Luxury Assist Suite"] }
];

/* =========================
   INIT EMAILJS
========================= */
if (window.emailjs) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

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

  setTimeout(() => {
    const customFields = document.getElementById("customFields");
    if (customFields) {
      customFields.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }, 100);
};
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

  const res = await fetch(API + "/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  if (!res.ok) {
    alert(result.message || "Failed to create order.");
    return;
  }

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
        <th style="width: 56px;">
          <input type="checkbox" id="selectAllCheckbox" onchange="toggleSelectAll(this)">
        </th>
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

  document.querySelectorAll('tbody input[type="checkbox"]').forEach(cb => {
    cb.onchange = updateButtons;
  });
}

/* ---------- SELECTED IDS ---------- */
function getSelected() {
  return [...document.querySelectorAll('tbody input[type="checkbox"]:checked')].map(x => x.value);
}

/* ---------- SELECT ALL ---------- */
function toggleSelectAll(masterCheckbox) {
  const rowCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');

  rowCheckboxes.forEach(cb => {
    cb.checked = masterCheckbox.checked;
  });

  updateButtons();
}

/* ---------- BUTTON STATE ---------- */
function updateButtons() {
  const selected = getSelected();
  const has = selected.length > 0;

  const invoiceBtn = document.getElementById("invoiceBtn");
  const deleteBtn = document.getElementById("deleteBtn");
  const selectAllCheckbox = document.getElementById("selectAllCheckbox");
  const rowCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');

  if (invoiceBtn) invoiceBtn.disabled = !has;
  if (deleteBtn) deleteBtn.disabled = !has;

  if (selectAllCheckbox) {
    const total = rowCheckboxes.length;
    const checked = [...rowCheckboxes].filter(cb => cb.checked).length;

    selectAllCheckbox.checked = total > 0 && checked === total;
    selectAllCheckbox.indeterminate = checked > 0 && checked < total;
  }
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

/* =========================
   BUILD EMAIL INVOICE CONTENT
========================= */
function buildInvoiceContent(orders) {
  let total = 0;

  const items = orders.map((o, index) => {
    total += Number(o.basePrice || 0);

    return `${index + 1}. ${o.car} - $${Number(o.basePrice).toLocaleString()}
Exterior Color: ${o.color || "-"}
Interior Material: ${o.interior || "-"}
Wheel Design: ${o.wheel || "-"}
Brake Package: ${o.brake || "-"}
Audio System: ${o.sound || "-"}
Roof Style: ${o.roof || "-"}
Seat Style: ${o.seats || "-"}
Trim Finish: ${o.trim || "-"}
Lighting Package: ${o.lighting || "-"}
Driver Assistance: ${o.assistance || "-"}
`;
  }).join("\n----------------------------------------\n\n");

  return {
    invoiceItems: items,
    invoiceTotal: `$${Number(total).toLocaleString()}`
  };
}

/* =========================
   SEND INVOICE WITH EMAILJS
========================= */
async function sendInvoice() {
  const email = prompt("Enter the email address to send the invoice to:");
  if (!email) return;

  const selectedIds = getSelected();

  if (selectedIds.length === 0) {
    alert("Please select at least one order.");
    return;
  }

  try {
    const res = await fetch(API + "/orders");
    const allOrders = await res.json();

    const selectedOrders = allOrders.filter(order => selectedIds.includes(String(order.id)));

    if (selectedOrders.length === 0) {
      alert("No matching orders found.");
      return;
    }

    const invoice = buildInvoiceContent(selectedOrders);

    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email: email,
      invoice_items: invoice.invoiceItems,
      invoice_total: invoice.invoiceTotal
    });

    alert("Invoice sent successfully.");
  } catch (err) {
    console.error("Email send error:", err);
    alert("Failed to send invoice. Please check your EmailJS setup.");
  }
}

/* ---------- INIT ---------- */
if (document.getElementById("carDropdown")) initDropdown();
if (document.getElementById("ordersTable")) loadOrders();