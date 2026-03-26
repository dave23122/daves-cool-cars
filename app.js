const API = "https://daves-cool-cars-api.daves-cool-cars-api.workers.dev";

/* =========================
   EMAILJS CONFIG
========================= */
const EMAILJS_PUBLIC_KEY = "pznpgQQTb1kDmyvxc";
const EMAILJS_SERVICE_ID = "service_mzkki19";
const EMAILJS_TEMPLATE_ID = "template_lei0z72";

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
   BUILD EMAIL INVOICE HTML
========================= */
function buildInvoiceHtml(orders) {
  let total = 0;

  const rows = orders.map((o, index) => {
    total += Number(o.basePrice || 0);

    return `
      <div style="margin-bottom:32px; padding:24px; border:1px solid #e5e7eb; border-radius:16px; background:#fafafa;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <h2 style="margin:0; font-size:22px; color:#111827;">${index + 1}. ${o.car}</h2>
          <div style="font-size:20px; font-weight:700; color:#111827;">
            $${Number(o.basePrice).toLocaleString()}
          </div>
        </div>

        <div style="color:#4b5563; font-size:15px; line-height:1.9;">
          <div><strong>Exterior Color:</strong> ${o.color || "-"}</div>
          <div><strong>Interior Material:</strong> ${o.interior || "-"}</div>
          <div><strong>Wheel Design:</strong> ${o.wheel || "-"}</div>
          <div><strong>Brake Package:</strong> ${o.brake || "-"}</div>
          <div><strong>Audio System:</strong> ${o.sound || "-"}</div>
          <div><strong>Roof Style:</strong> ${o.roof || "-"}</div>
          <div><strong>Seat Style:</strong> ${o.seats || "-"}</div>
          <div><strong>Trim Finish:</strong> ${o.trim || "-"}</div>
          <div><strong>Lighting Package:</strong> ${o.lighting || "-"}</div>
          <div><strong>Driver Assistance:</strong> ${o.assistance || "-"}</div>
        </div>
      </div>
    `;
  }).join("");

  return `
    <div style="font-family:Arial, sans-serif; background:#f3f4f6; padding:40px;">
      <div style="max-width:900px; margin:0 auto; background:white; border-radius:24px; overflow:hidden; box-shadow:0 12px 40px rgba(0,0,0,0.08);">

        <div style="background:linear-gradient(135deg, #111827, #1f2937); color:white; padding:40px;">
          <div style="font-size:14px; letter-spacing:2px; text-transform:uppercase; color:#d4af37; margin-bottom:10px;">
            Dave's Cool Cars
          </div>
          <h1 style="margin:0; font-size:38px;">Luxury Vehicle Invoice</h1>
          <p style="margin-top:12px; color:#d1d5db; font-size:16px; line-height:1.7;">
            Thank you for your order. Below is a summary of your selected luxury vehicles and specifications.
          </p>
        </div>

        <div style="padding:40px;">
          ${rows}

          <div style="margin-top:24px; padding:28px; border-radius:18px; background:#111827; color:white;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div style="font-size:18px; color:#d1d5db;">Total</div>
              <div style="font-size:32px; font-weight:800; color:#d4af37;">
                $${Number(total).toLocaleString()}
              </div>
            </div>
          </div>

          <p style="margin-top:28px; color:#6b7280; font-size:14px; line-height:1.8;">
            This invoice is for order tracking and quotation purposes only. No payment is required through this system.
          </p>
        </div>
      </div>
    </div>
  `;
}

/* =========================
   SEND INVOICE WITH EMAILJS
========================= */
async function sendInvoice() {

  await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    to_email: email,
    invoice_html: "<h1>TEST EMAIL</h1>"
  });
/*
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

    const invoiceHtml = buildInvoiceHtml(selectedOrders);

    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email: email,
      invoice_html: invoiceHtml
    });

    alert("Invoice sent successfully.");
  } catch (err) {
    console.error("Email send error:", err);
    alert("Failed to send invoice. Please check your EmailJS setup.");
  }
*/
}

/* ---------- INIT ---------- */
if (document.getElementById("carDropdown")) initDropdown();
if (document.getElementById("ordersTable")) loadOrders();