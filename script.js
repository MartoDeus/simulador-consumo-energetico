const initialAppliances = [
  { id: crypto.randomUUID(), name: "TV", watts: 100, quantity: 1, hours: 5, enabled: true },
  { id: crypto.randomUUID(), name: "Computadora", watts: 400, quantity: 2, hours: 6, enabled: true },
  { id: crypto.randomUUID(), name: "Refrigeradora", watts: 300, quantity: 1, hours: 12, enabled: true },
  { id: crypto.randomUUID(), name: "Focos", watts: 10, quantity: 10, hours: 5, enabled: true },
  { id: crypto.randomUUID(), name: "Plancha", watts: 1200, quantity: 1, hours: 1, enabled: false },
  { id: crypto.randomUUID(), name: "Cocina electrica", watts: 1500, quantity: 1, hours: 2, enabled: false }
];

const state = {
  period: "day",
  panelCount: 6,
  panelOutput: 450,
  batteryCapacities: [2400, 2400, 2400, 2400],
  dayHours: 8,
  nightHours: 12,
  systemLoss: 12,
  appliances: structuredClone(initialAppliances)
};

const applianceList = document.querySelector("#applianceList");
const batteryList = document.querySelector("#batteryList");
const applianceTemplate = document.querySelector("#applianceTemplate");
const applianceForm = document.querySelector("#applianceForm");
const periodButtons = document.querySelectorAll(".period-btn");
const sceneBubble = document.querySelector("#sceneBubble");
const body = document.body;
let renderedPeriod = null;

const refs = {
  sceneImage: document.querySelector("#sceneImage"),
  dayOrb: document.querySelector("#dayOrb"),
  nightOrb: document.querySelector("#nightOrb"),
  panelCount: document.querySelector("#panelCount"),
  panelOutput: document.querySelector("#panelOutput"),
  batteryCount: document.querySelector("#batteryCount"),
  batteryCapacity: document.querySelector("#batteryCapacity"),
  addBatteryBtn: document.querySelector("#addBatteryBtn"),
  dayHours: document.querySelector("#dayHours"),
  nightHours: document.querySelector("#nightHours"),
  systemLoss: document.querySelector("#systemLoss"),
  panelCountValue: document.querySelector("#panelCountValue"),
  panelGeneratedLabel: document.querySelector("#panelGeneratedLabel"),
  panelPowerLabel: document.querySelector("#panelPowerLabel"),
  batteryCountValue: document.querySelector("#batteryCountValue"),
  batteryCapacityLabel: document.querySelector("#batteryCapacityLabel"),
  lossValue: document.querySelector("#lossValue"),
  systemHealthLabel: document.querySelector("#systemHealthLabel"),
  totalConsumption: document.querySelector("#totalConsumption"),
  totalGeneration: document.querySelector("#totalGeneration"),
  totalStorage: document.querySelector("#totalStorage"),
  wastedEnergy: document.querySelector("#wastedEnergy"),
  coverageText: document.querySelector("#coverageText"),
  batteryReserveText: document.querySelector("#batteryReserveText"),
  coverageBar: document.querySelector("#coverageBar"),
  batteryReserveBar: document.querySelector("#batteryReserveBar"),
  statusHeadline: document.querySelector("#statusHeadline"),
  headlineSupport: document.querySelector("#headlineSupport"),
  statusList: document.querySelector("#statusList"),
  tipsList: document.querySelector("#tipsList"),
  resetScene: document.querySelector("#resetScene"),
  recommendedPanels: document.querySelector("#recommendedPanels"),
  recommendedBatteries: document.querySelector("#recommendedBatteries"),
  nightAutonomy: document.querySelector("#nightAutonomy"),
  chargeableEnergy: document.querySelector("#chargeableEnergy"),
  plannerBadge: document.querySelector("#plannerBadge"),
  dayCoverage: document.querySelector("#dayCoverage"),
  nightCoverage: document.querySelector("#nightCoverage"),
  dayBalance: document.querySelector("#dayBalance"),
  nightBalance: document.querySelector("#nightBalance"),
  withoutPanels: document.querySelector("#withoutPanels"),
  withoutBatteries: document.querySelector("#withoutBatteries")
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatEnergy(wh) {
  if (wh >= 1000) {
    return `${(wh / 1000).toFixed(2)} kWh`;
  }
  return `${Math.round(wh)} Wh`;
}

function formatHours(hours) {
  return `${hours.toFixed(1)} h`;
}

function pluralize(value, singular, plural) {
  return `${value} ${value === 1 ? singular : plural}`;
}

function getBatteryCount() {
  return state.batteryCapacities.length;
}

function getDefaultBatteryCapacity() {
  const lastCapacity = state.batteryCapacities.at(-1);

  if (lastCapacity !== undefined) {
    return lastCapacity;
  }

  return Number(refs.batteryCapacity.value) || 2400;
}

function getAverageBatteryCapacity() {
  if (state.batteryCapacities.length === 0) {
    return getDefaultBatteryCapacity();
  }

  const total = state.batteryCapacities.reduce((sum, capacity) => sum + capacity, 0);
  return total / state.batteryCapacities.length;
}

function getApplianceIconClass(name) {
  const normalized = name.toLowerCase();

  if (normalized.includes("tv") || normalized.includes("tele")) {
    return "appliance-icon-tv";
  }

  if (normalized.includes("compu") || normalized.includes("pc") || normalized.includes("laptop")) {
    return "appliance-icon-computer";
  }

  if (normalized.includes("refri") || normalized.includes("nevera")) {
    return "appliance-icon-fridge";
  }

  if (normalized.includes("plancha")) {
    return "appliance-icon-iron";
  }

  if (normalized.includes("foco") || normalized.includes("luz") || normalized.includes("bombilla")) {
    return "appliance-icon-bulb";
  }

  if (normalized.includes("cocina") || normalized.includes("horno")) {
    return "appliance-icon-stove";
  }

  return "appliance-icon-default";
}

function shortenApplianceName(name) {
  const normalized = name.toLowerCase();

  if (normalized.includes("tele")) {
    return "Televisor";
  }

  if (normalized.includes("compu")) {
    return "Computadora";
  }

  if (normalized.includes("refri")) {
    return "Refrigeradora";
  }

  if (normalized.includes("cocina")) {
    return "Cocina";
  }

  if (normalized.includes("foco")) {
    return "Focos";
  }

  return name.length > 15 ? `${name.slice(0, 14)}.` : name;
}

function getActiveAppliances() {
  return state.appliances.filter((item) => item.enabled);
}

function calculateLoadForPeriod(period) {
  const periodHours = period === "day" ? state.dayHours : state.nightHours;
  const activeItems = getActiveAppliances();
  const activeLoad = activeItems.reduce((sum, item) => sum + (item.watts * item.quantity), 0);
  const consumption = activeItems.reduce((sum, item) => {
    const effectiveHours = Math.min(item.hours, periodHours);
    return sum + (item.watts * item.quantity * effectiveHours);
  }, 0);

  return {
    period,
    periodHours,
    activeLoad,
    consumption
  };
}

function calculateOverview() {
  const lossFactor = 1 - state.systemLoss / 100;
  const dayLoad = calculateLoadForPeriod("day");
  const nightLoad = calculateLoadForPeriod("night");
  const solarRawDay = state.panelCount * state.panelOutput * state.dayHours;
  const solarNetDay = solarRawDay * lossFactor;
  const storageCapacity = state.batteryCapacities.reduce((sum, capacity) => sum + capacity, 0);
  const storableSurplus = Math.min(storageCapacity, Math.max(solarNetDay - dayLoad.consumption, 0));
  const wastedDay = Math.max(solarNetDay - dayLoad.consumption - storableSurplus, 0);
  const daySupplied = Math.min(dayLoad.consumption, solarNetDay);
  const dayDeficit = Math.max(dayLoad.consumption - solarNetDay, 0);
  const nightSupplied = Math.min(nightLoad.consumption, storableSurplus);
  const nightDeficit = Math.max(nightLoad.consumption - storableSurplus, 0);
  const recommendedPanels = state.panelOutput > 0 && state.dayHours > 0 && lossFactor > 0
    ? Math.ceil(dayLoad.consumption / (state.panelOutput * state.dayHours * lossFactor))
    : 0;
  const averageBatteryCapacity = getAverageBatteryCapacity();
  const recommendedBatteries = averageBatteryCapacity > 0
    ? Math.ceil(nightLoad.consumption / averageBatteryCapacity)
    : 0;
  const autonomyHours = nightLoad.activeLoad > 0 ? storageCapacity / nightLoad.activeLoad : 0;

  return {
    dayLoad,
    nightLoad,
    solarNetDay,
    storageCapacity,
    storableSurplus,
    wastedDay,
    daySupplied,
    dayDeficit,
    nightSupplied,
    nightDeficit,
    recommendedPanels,
    recommendedBatteries,
    autonomyHours,
    lossFactor
  };
}

function calculateCurrentScenario(overview) {
  if (state.period === "day") {
    const coverage = overview.dayLoad.consumption === 0 ? 100 : (overview.daySupplied / overview.dayLoad.consumption) * 100;
    const reserveRatio = overview.storageCapacity === 0 ? 0 : (overview.storableSurplus / overview.storageCapacity) * 100;
    return {
      consumption: overview.dayLoad.consumption,
      generation: overview.solarNetDay,
      totalStorage: overview.storageCapacity,
      wasted: overview.wastedDay,
      supplied: overview.daySupplied,
      deficit: overview.dayDeficit,
      coverage,
      reserveRatio
    };
  }

  const coverage = overview.nightLoad.consumption === 0 ? 100 : (overview.nightSupplied / overview.nightLoad.consumption) * 100;
  const reserveRatio = overview.storageCapacity === 0 ? 0 : ((overview.storageCapacity - overview.nightSupplied) / overview.storageCapacity) * 100;
  return {
    consumption: overview.nightLoad.consumption,
    generation: 0,
    totalStorage: overview.storageCapacity,
    wasted: Math.max(overview.storableSurplus - overview.nightSupplied, 0),
    supplied: overview.nightSupplied,
    deficit: overview.nightDeficit,
    coverage,
    reserveRatio
  };
}

function getStatusMessages(overview, currentScenario) {
  const messages = [];
  const tips = [];

  if (state.period === "day") {
    if (state.panelCount === 0) {
      messages.push("Sin paneles durante el dia no existe generacion solar.");
      tips.push("Agrega paneles para cubrir la carga diurna y reducir el deficit base.");
    }
    if (currentScenario.deficit > 0) {
      messages.push(`Durante el dia faltan ${formatEnergy(currentScenario.deficit)} para cubrir toda la demanda.`);
      tips.push(`Para cubrir ese uso, el simulador sugiere al menos ${pluralize(overview.recommendedPanels, "panel", "paneles")}.`);
    } else {
      messages.push("La produccion solar del dia alcanza para abastecer la casa configurada.");
    }
    if (overview.wastedDay > 0) {
      messages.push(`Se desperdician ${formatEnergy(overview.wastedDay)} por excedente no almacenado.`);
      tips.push("Mas baterias o mas consumo util en horas solares pueden aprovechar mejor ese excedente.");
    }
  } else {
    if (getBatteryCount() === 0) {
      messages.push("Durante la noche la casa queda sin respaldo porque no hay baterias.");
      tips.push(`Para la carga nocturna actual, se recomiendan ${pluralize(overview.recommendedBatteries, "bateria", "baterias")}.`);
    }
    if (currentScenario.deficit > 0) {
      messages.push(`Durante la noche faltan ${formatEnergy(currentScenario.deficit)} por energia insuficiente almacenada.`);
      tips.push("Necesitas guardar mas excedente solar durante el dia o reducir el consumo nocturno.");
    } else {
      messages.push("La reserva almacenada cubre la demanda nocturna configurada.");
    }
    if (overview.storableSurplus === 0 && overview.dayLoad.consumption >= overview.solarNetDay) {
      messages.push("Aunque existan baterias, no se cargan porque el dia no deja excedente disponible.");
      tips.push("El sistema debe generar mas de lo que consume durante el dia para llegar con carga a la noche.");
    }
  }

  if (state.systemLoss >= 25) {
    messages.push("Las perdidas del sistema son altas y reducen el rendimiento esperado.");
    tips.push("Mejorar orientacion, limpieza, cableado o conversion ayuda a recuperar energia util.");
  }

  if (overview.nightDeficit > 0 && overview.dayDeficit === 0) {
    tips.push("Tu problema principal no es generar en el dia, sino almacenar mejor para la noche.");
  }

  if (overview.dayDeficit > 0 && overview.nightDeficit === 0) {
    tips.push("La reserva puede estar bien, pero falta potencia de generacion en horas solares.");
  }

  if (getActiveAppliances().length === 0) {
    messages.push("No hay electrodomesticos activos en este escenario.");
    tips.push("Activa o agrega equipos para evaluar un caso de consumo real.");
  }

  return {
    headline: currentScenario.deficit > 0 ? "Energia insuficiente para el escenario actual." : "Sistema equilibrado para el escenario actual.",
    messages,
    tips: tips.slice(0, 4)
  };
}

function renderAppliances() {
  applianceList.innerHTML = "";

  state.appliances.forEach((item) => {
    const node = applianceTemplate.content.firstElementChild.cloneNode(true);
    const icon = node.querySelector(".appliance-icon");

    node.dataset.id = item.id;
    icon.classList.add(getApplianceIconClass(item.name));
    node.querySelector(".appliance-title").textContent = shortenApplianceName(item.name);
    node.querySelector(".appliance-title").title = item.name;
    node.querySelector(".appliance-meta").textContent = `${item.quantity} x ${item.watts} W - ${item.hours} h`;

    const enabledInput = node.querySelector(".appliance-enabled");
    const wattsInput = node.querySelector(".appliance-watts-input");
    const qtyInput = node.querySelector(".appliance-qty-input");
    const hoursInput = node.querySelector(".appliance-hours-input");

    enabledInput.checked = item.enabled;
    wattsInput.value = String(item.watts);
    qtyInput.value = String(item.quantity);
    hoursInput.value = String(item.hours);

    enabledInput.addEventListener("change", () => {
      item.enabled = enabledInput.checked;
      update();
    });

    wattsInput.addEventListener("input", () => {
      item.watts = Math.max(1, Number(wattsInput.value) || 1);
      update();
    });

    qtyInput.addEventListener("input", () => {
      item.quantity = Math.max(1, Number(qtyInput.value) || 1);
      update();
    });

    hoursInput.addEventListener("input", () => {
      item.hours = Math.max(0, Number(hoursInput.value) || 0);
      update();
    });

    node.querySelector(".remove-appliance").addEventListener("click", () => {
      state.appliances = state.appliances.filter((entry) => entry.id !== item.id);
      update();
    });

    node.addEventListener("dragstart", () => node.classList.add("dragging"));
    node.addEventListener("dragend", () => node.classList.remove("dragging"));

    applianceList.appendChild(node);
  });
}

function renderBatteries() {
  batteryList.innerHTML = "";

  state.batteryCapacities.forEach((capacity, index) => {
    const row = document.createElement("article");
    row.className = "battery-line";
    row.innerHTML = `
      <div class="battery-pack-icon" aria-hidden="true"></div>
      <div class="battery-main">
        <strong>Bateria ${index + 1}</strong>
        <span>${capacity} Wh</span>
      </div>
      <input class="battery-capacity-input" type="number" min="0" step="50" value="${capacity}" aria-label="Capacidad bateria ${index + 1}">
      <button class="remove-battery" type="button" aria-label="Eliminar bateria ${index + 1}">x</button>
    `;

    const capacityInput = row.querySelector(".battery-capacity-input");
    const removeButton = row.querySelector(".remove-battery");

    capacityInput.addEventListener("change", () => {
      state.batteryCapacities[index] = Math.max(0, Number(capacityInput.value) || 0);
      update();
    });

    removeButton.addEventListener("click", () => {
      state.batteryCapacities.splice(index, 1);
      refs.batteryCount.value = String(getBatteryCount());
      update();
    });

    batteryList.appendChild(row);
  });
}

function updateReadouts(overview, currentScenario) {
  refs.panelCountValue.textContent = pluralize(state.panelCount, "panel", "paneles");
  refs.panelGeneratedLabel.textContent = formatEnergy(overview.solarNetDay);
  refs.panelPowerLabel.textContent = `${state.panelOutput} W c/u`;
  refs.batteryCountValue.textContent = pluralize(getBatteryCount(), "bateria", "baterias");
  refs.batteryCapacityLabel.textContent = getBatteryCount() === 0
    ? "Sin baterias"
    : "Capacidad editable por bateria";
  refs.lossValue.textContent = `${state.systemLoss} % de perdidas`;
  refs.systemHealthLabel.textContent = state.systemLoss <= 10
    ? "Estado optimo"
    : state.systemLoss <= 20
      ? "Estado estable"
      : "Estado con perdidas";

  refs.totalConsumption.textContent = formatEnergy(currentScenario.consumption);
  refs.totalGeneration.textContent = formatEnergy(currentScenario.generation);
  refs.totalStorage.textContent = formatEnergy(currentScenario.totalStorage);
  refs.wastedEnergy.textContent = formatEnergy(currentScenario.wasted);
  refs.coverageText.textContent = `${Math.round(currentScenario.coverage)} %`;
  refs.batteryReserveText.textContent = `${Math.round(clamp(currentScenario.reserveRatio, 0, 100))} %`;
  refs.coverageBar.style.width = `${clamp(currentScenario.coverage, 0, 100)}%`;
  refs.batteryReserveBar.style.width = `${clamp(currentScenario.reserveRatio, 0, 100)}%`;

  refs.recommendedPanels.textContent = String(overview.recommendedPanels);
  refs.recommendedBatteries.textContent = String(overview.recommendedBatteries);
  refs.nightAutonomy.textContent = formatHours(overview.autonomyHours);
  refs.chargeableEnergy.textContent = formatEnergy(overview.storableSurplus);
  refs.plannerBadge.textContent = state.period === "day" ? "Ajustado al uso diario" : "Considerando respaldo nocturno";

  const dayCoverage = overview.dayLoad.consumption === 0 ? 100 : (overview.daySupplied / overview.dayLoad.consumption) * 100;
  const nightCoverage = overview.nightLoad.consumption === 0 ? 100 : (overview.nightSupplied / overview.nightLoad.consumption) * 100;
  refs.dayCoverage.textContent = `${Math.round(dayCoverage)} %`;
  refs.nightCoverage.textContent = `${Math.round(nightCoverage)} %`;
  refs.dayBalance.textContent = `Balance: ${formatEnergy(overview.solarNetDay - overview.dayLoad.consumption)}`;
  refs.nightBalance.textContent = `Balance: ${formatEnergy(overview.storableSurplus - overview.nightLoad.consumption)}`;
  refs.withoutPanels.textContent = formatEnergy(overview.dayLoad.consumption);
  refs.withoutBatteries.textContent = formatEnergy(overview.nightLoad.consumption);
}

function updateNarrative(overview, currentScenario) {
  const { headline, messages, tips } = getStatusMessages(overview, currentScenario);
  refs.statusHeadline.textContent = headline;
  refs.statusList.innerHTML = "";
  refs.tipsList.innerHTML = "";

  messages.forEach((message) => {
    const li = document.createElement("li");
    li.textContent = message;
    refs.statusList.appendChild(li);
  });

  tips.forEach((tip) => {
    const div = document.createElement("div");
    div.className = "tip-item";
    div.textContent = tip;
    refs.tipsList.appendChild(div);
  });

  if (messages.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Configura paneles, baterias y electrodomesticos para generar diagnosticos.";
    refs.statusList.appendChild(li);
  }

  sceneBubble.textContent = state.period === "day"
    ? currentScenario.deficit > 0
      ? "El campo solar no alcanza para sostener la carga diurna actual."
      : "La produccion del dia permite operar la casa y hasta reservar energia."
    : currentScenario.deficit > 0
      ? "La noche consume mas de lo que lograron guardar las baterias."
      : "La casa se mantiene de noche gracias a la energia almacenada.";

  if (refs.headlineSupport) {
    refs.headlineSupport.textContent = messages[0] || "Configura paneles, baterias y electrodomesticos para generar diagnosticos.";
  }
}

function animateSkyOrb(nextPeriod) {
  const enteringOrb = nextPeriod === "day" ? refs.dayOrb : refs.nightOrb;
  const leavingOrb = nextPeriod === "day" ? refs.nightOrb : refs.dayOrb;

  if (renderedPeriod === null) {
    refs.dayOrb.classList.toggle("active", nextPeriod === "day");
    refs.nightOrb.classList.toggle("active", nextPeriod === "night");
    renderedPeriod = nextPeriod;
    return;
  }

  if (renderedPeriod === nextPeriod) {
    return;
  }

  leavingOrb.classList.remove("active");
  leavingOrb.classList.add("leaving");
  enteringOrb.classList.remove("active", "leaving");
  void enteringOrb.offsetWidth;
  enteringOrb.classList.add("active");

  window.setTimeout(() => {
    leavingOrb.classList.remove("leaving");
  }, 430);

  renderedPeriod = nextPeriod;
}

function updateTheme() {
  body.dataset.theme = state.period === "day" ? "day" : "night";
  refs.sceneImage.src = state.period === "day" ? "assets/dia.png" : "assets/noche.png";
  refs.sceneImage.alt = state.period === "day"
    ? "Casa solar durante el dia"
    : "Casa solar durante la noche";
  animateSkyOrb(state.period);
  periodButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.period === state.period);
  });
}

function update() {
  renderAppliances();
  renderBatteries();
  updateTheme();
  const overview = calculateOverview();
  const currentScenario = calculateCurrentScenario(overview);
  updateReadouts(overview, currentScenario);
  updateNarrative(overview, currentScenario);
}

function syncStateFromInputs() {
  state.panelCount = Number(refs.panelCount.value);
  state.panelOutput = Number(refs.panelOutput.value);
  state.dayHours = Number(refs.dayHours.value);
  state.nightHours = Number(refs.nightHours.value);
  state.systemLoss = Number(refs.systemLoss.value);
}

[
  refs.panelCount,
  refs.panelOutput,
  refs.dayHours,
  refs.nightHours,
  refs.systemLoss
].forEach((input) => {
  input.addEventListener("input", () => {
    syncStateFromInputs();
    update();
  });
});

periodButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.period = button.dataset.period;
    update();
  });
});

applianceForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(applianceForm);
  const name = String(formData.get("name")).trim();

  if (!name) {
    return;
  }

  state.appliances.unshift({
    id: crypto.randomUUID(),
    name,
    watts: Math.max(1, Number(formData.get("watts")) || 1),
    quantity: Math.max(1, Number(formData.get("quantity")) || 1),
    hours: Math.max(0, Number(formData.get("hours")) || 0),
    enabled: true
  });

  applianceForm.reset();
  document.querySelector("#applianceQty").value = "1";
  document.querySelector("#applianceHours").value = "4";
  update();
});

const addApplianceBtn = document.querySelector("#addApplianceBtn");

if (addApplianceBtn) {
  addApplianceBtn.addEventListener("click", () => {
    document.querySelector("#applianceName").focus();
  });
}

const increasePanelsBtn = document.querySelector("#increasePanels");
const decreasePanelsBtn = document.querySelector("#decreasePanels");

if (increasePanelsBtn && decreasePanelsBtn) {
  increasePanelsBtn.addEventListener("click", () => {
    refs.panelCount.value = String(Math.min(20, Number(refs.panelCount.value) + 1));
    syncStateFromInputs();
    update();
  });

  decreasePanelsBtn.addEventListener("click", () => {
    refs.panelCount.value = String(Math.max(0, Number(refs.panelCount.value) - 1));
    syncStateFromInputs();
    update();
  });
}

if (refs.addBatteryBtn) {
  refs.addBatteryBtn.addEventListener("click", () => {
    if (getBatteryCount() >= 16) {
      return;
    }

    state.batteryCapacities.push(getDefaultBatteryCapacity());
    refs.batteryCount.value = String(getBatteryCount());
    update();
  });
}

refs.resetScene.addEventListener("click", () => {
  state.period = "day";
  state.panelCount = 6;
  state.panelOutput = 450;
  state.batteryCapacities = [2400, 2400, 2400, 2400];
  state.dayHours = 8;
  state.nightHours = 12;
  state.systemLoss = 12;
  state.appliances = structuredClone(initialAppliances);

  refs.panelCount.value = String(state.panelCount);
  refs.panelOutput.value = String(state.panelOutput);
  refs.batteryCount.value = String(getBatteryCount());
  refs.batteryCapacity.value = String(getDefaultBatteryCapacity());
  refs.dayHours.value = String(state.dayHours);
  refs.nightHours.value = String(state.nightHours);
  refs.systemLoss.value = String(state.systemLoss);

  update();
});

function makeDraggable(element) {
  let startX = 0;
  let startY = 0;
  let originX = 0;
  let originY = 0;

  const onPointerMove = (event) => {
    const nextX = originX + (event.clientX - startX);
    const nextY = originY + (event.clientY - startY);
    element.style.left = `${nextX}px`;
    element.style.top = `${nextY}px`;
    element.style.bottom = "auto";
  };

  const onPointerUp = () => {
    element.classList.remove("dragging");
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  };

  element.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    startX = event.clientX;
    startY = event.clientY;
    originX = element.offsetLeft;
    originY = element.offsetTop;
    element.classList.add("dragging");
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  });
}

document.querySelectorAll(".draggable").forEach(makeDraggable);

function enableSmoothWheelScroll(element) {
  let targetScroll = element.scrollTop;
  let animationFrame = null;
  const wheelBoost = 1.18;
  const easing = 0.58;

  const animate = () => {
    const distance = targetScroll - element.scrollTop;

    if (Math.abs(distance) < 1.6) {
      element.scrollTop = targetScroll;
      animationFrame = null;
      return;
    }

    element.scrollTop += distance * easing;
    animationFrame = requestAnimationFrame(animate);
  };

  element.addEventListener("wheel", (event) => {
    const canScroll = element.scrollHeight > element.clientHeight;

    if (!canScroll) {
      return;
    }

    event.preventDefault();
    targetScroll = clamp(targetScroll + event.deltaY * wheelBoost, 0, element.scrollHeight - element.clientHeight);

    if (!animationFrame) {
      animationFrame = requestAnimationFrame(animate);
    }
  }, { passive: false });

  element.addEventListener("scroll", () => {
    if (!animationFrame) {
      targetScroll = element.scrollTop;
    }
  }, { passive: true });
}

document.querySelectorAll(".left-rail, .right-rail, .appliance-list, .battery-list").forEach(enableSmoothWheelScroll);

syncStateFromInputs();
update();
