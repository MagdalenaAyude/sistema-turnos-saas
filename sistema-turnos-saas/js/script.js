document.addEventListener("DOMContentLoaded", () => {

  const diasContenedor = document.getElementById("calDias");
  const mesActualEl = document.getElementById("mesTexto");
  const mesAnteriorBtn = document.getElementById("prevMes");
  const mesSiguienteBtn = document.getElementById("nextMes");
  const modal = document.getElementById("modal");
  const inputNombre = document.getElementById("nombre");
  const contenedorHorarios = document.getElementById("horarios");
  const inputServicio = document.getElementById("servicio");
  const inputProfesional = document.getElementById("profesional");
  const btnCerrarModal = document.getElementById("cerrarModal");
  const btnNuevoTurno = document.getElementById("btnNuevoTurno");
  const formTurno = document.getElementById("formTurno");
  const agenda = document.getElementById("agenda");
  const tituloModal = document.getElementById("tituloModal");
  const tituloDia = document.getElementById("tituloDia");

  
  const hoy = new Date();

  let mes = hoy.getMonth();
  let anio = hoy.getFullYear();
  let horarioSeleccionado = null;
  let diaActivo = null;
  let elementoActivo = null;

  const meses = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
 ];
  const profesionales = [
  {
    nombre: "Juan",
    servicios: ["Corte", "Barba", "Corte + barba"],
    Horarios: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],
  },
  {
    nombre: "Ana",
    servicios: ["Limpieza facial", "Drenaje linfático"],
    Horarios: ["9:00", "11:00", "12:00", "13:00"],
  },
  {
    nombre: "Mica",
    servicios: ["Permanente", "Semipermanente"],
    Horarios: ["9:00","11:00","12:00","13:00","14:00"],
  },
  {
    nombre: "Lucia",
    servicios:["Descontracturante", "Relajante"],
    Horarios: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],
  },
  
];

const diasSemana = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado"
];

function renderCalendar() {

  diasContenedor.innerHTML = "";

  const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
  const diasDelMes = new Date(anio, mes + 1, 0).getDate();
  let primerDia = new Date(anio, mes, 1).getDay();

  primerDia = primerDia === 0 ? 6 : primerDia - 1;

  mesActualEl.textContent = `${meses[mes]} ${anio}`;
  
  for (let i = 0; i < primerDia; i++) {
    diasContenedor.appendChild(document.createElement("div"));
  }
  for (let dia = 1; dia <= diasDelMes; dia++) {

    const div = document.createElement("div");
    div.classList.add("cal-dia");
    div.textContent = dia;
    const tieneTurnos = turnos.some(t =>
      t.dia === dia &&
      t.mes === mes &&
      t.anio === anio
    );

    if (tieneTurnos) {
      div.classList.add("con-turnos");
    }

    div.addEventListener("click", () => {

      if (elementoActivo) {
        elementoActivo.classList.remove("activo");
      }

      div.classList.add("activo");
      elementoActivo = div;
      diaActivo = dia;

      renderAgenda();
      abrirModal();
      cargarHorarios();
    });

    diasContenedor.appendChild(div);
  }
}
  function renderAgenda() {

  agenda.innerHTML = "";

  if (!diaActivo) {
    agenda.innerHTML = "Elegí una fecha para ver los turnos";
    return;
  }
tituloDia.innerHTML = formatearFecha(diaActivo, mes, anio, "largo");

  const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
  const filtrados = turnos
  .filter(t =>
    t.dia === diaActivo &&
    t.mes === mes &&
    t.anio === anio
  )
  .sort((a, b) => a.horario.localeCompare(b.horario));

  filtrados.forEach(t => {
  const div = document.createElement("div");
  div.classList.add("turno-item");

  div.innerHTML = `
   
  <div class="turno-top">
    <span class="turno-hora">
      ${t.horario}
    </span>
  </div>
  
  <div class="turno-body">
    <strong>
      ${t.nombre}
    </strong>
  <p>
      ${t.servicio}
    </p>
  <small>
      ${t.profesional}
    </small>

  </div>
`;
    agenda.appendChild(div);
});
}
function abrirModal() {

  if (!diaActivo) return;

  const fecha = new Date(anio, mes, diaActivo);
  const nombreDia = diasSemana[fecha.getDay()];
  
  tituloModal.innerHTML = formatearFecha(diaActivo, mes, anio, "modal");
  modal.classList.remove("hidden");
}
function cerrarModal() {
    modal.classList.add("hidden");
    inputNombre.value = "";
    inputProfesional.value = "";
    inputServicio.value = ""
    horarioSeleccionado = "";
  }
function guardarTurno() {

  const nombre = inputNombre.value;
  const servicio = inputServicio.value;
  const horario = horarioSeleccionado;
  const profesional = inputProfesional.value;

  if (!nombre || !servicio || !horario || !profesional) {
    alert("Completá los datos");
    return;
  }

  let turnos = JSON.parse(localStorage.getItem("turnos")) || [];

  const existe = turnos.some(t =>
  t.dia === diaActivo &&  
  t.mes === mes &&
  t.anio === anio &&
  t.horario === horario &&
  t.profesional === profesional
);
  if (existe) {
    alert("Ese horario ya está ocupado");
    return;
  }

  const turno = {
    dia: diaActivo,
    mes,
    anio,
    nombre,
    profesional,
    servicio,
    horario,
  };

  turnos.push(turno);
  localStorage.setItem("turnos", JSON.stringify(turnos));

  const mensaje = `Hola, quiero confirmar este turno:

  📅 Día: ${diaActivo} de ${meses[mes]}
  ⏰ Hora: ${horario}
  💼 Servicio: ${servicio}
  👤 Profesional: ${profesional}
  🙋 Cliente: ${nombre}`;

const telefono = "542915094533";
const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

window.open(url, "_blank");
  cerrarModal();
  renderAgenda();
  renderCalendar();
}
mesAnteriorBtn.addEventListener("click", () => {
    mes--;
    if (mes < 0) {
      mes = 11;
      anio--;
    }
    renderCalendar();
  });
  
  mesSiguienteBtn.addEventListener("click", () => {
    mes++;
    if (mes > 11) {
      mes = 0;
      anio++;
    }
    renderCalendar();
  });

  formTurno.addEventListener("submit", e => {
    e.preventDefault();
    guardarTurno();
  });
  
  btnNuevoTurno.addEventListener("click", abrirModal);
  btnCerrarModal.addEventListener("click", cerrarModal);
  inputProfesional.addEventListener("change", () => {

  const nombreSeleccionado = inputProfesional.value;
  const profesional = profesionales.find(p => p.nombre === nombreSeleccionado);


  inputServicio.innerHTML = `<option value="">Servicio</option>`;

  if (!profesional) return;

  profesional.servicios.forEach(serv => {
    const option = document.createElement("option");
    option.value = serv;
    option.textContent = serv;
    inputServicio.appendChild(option);
  });
  cargarHorarios();

});
function cargarHorarios() {

  contenedorHorarios.innerHTML = "";
  horarioSeleccionado = null;

  const nombreSeleccionado = inputProfesional.value;
  const profesional = profesionales.find(p => p.nombre === nombreSeleccionado);

  if (!profesional || !diaActivo) {
    contenedorHorarios.innerHTML= `<small class="horario-info">
    Seleccioná un profesional
  </small>
`;
    return;
  }

  const turnos = JSON.parse(localStorage.getItem("turnos")) || [];

  profesional.Horarios.forEach(hora => {

    const ocupado = turnos.some(t =>
      t.dia === diaActivo &&
      t.mes === mes &&
      t.anio === anio &&
      t.horario === hora &&
      t.profesional === nombreSeleccionado
    );

    if (!ocupado) {

      const btn = document.createElement("button");
      btn.textContent = hora;
      btn.classList.add("horario-btn");

      btn.addEventListener("click", () => {

        document.querySelectorAll(".horario-btn").forEach(b =>
          b.classList.remove("activo")
        );

        btn.classList.add("activo");
        horarioSeleccionado = hora;
      });

      contenedorHorarios.appendChild(btn);
    }

  });

  if (contenedorHorarios.innerHTML === "") {
    contenedorHorarios.innerHTML = "<p>No hay disponibilidad</p>";
  }
}
function formatearFecha(dia, mes, anio, formato = "largo") {

  const fecha = new Date(anio, mes, dia);
  const nombreDia = diasSemana[fecha.getDay()];
  const nombreMes = meses[mes];

  if (formato === "largo") {
    return `${nombreDia} | ${dia} de ${nombreMes}`;
  }

  if (formato === "modal") {
    return `${nombreDia} ${dia} de ${nombreMes}`;
  }

  if (formato === "corto") {
    return `${nombreDia}, ${dia}/${mes + 1}`;
  }

  return `${dia} de ${nombreMes}`;
}
renderCalendar();
renderAgenda();
});



 


