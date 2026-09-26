console.log("registro JS cargado");

import { mostrarModal } from "./modal.js";

const form = document.getElementById("formRecuperacion");

const campos = ["nombre", "correo", "password", "preguntaRecuperacion"];

function validarCampo(id) {
  const input = document.getElementById(id);
  const error = document.getElementById("error-" + id);

  if (!input) return true;

  if (error) error.textContent = "";

  input.classList.remove("valido", "invalido");

  if (input.required && input.value.trim() === "") {
    if (error) error.textContent = "Este campo es obligatorio";
    input.classList.add("invalido");
    return false;
  }

  if (id === "password" && input.value.length < 8) {
    if (error) error.textContent = "La contraseña debe tener al menos 8 caracteres";
    input.classList.add("invalido");
    return false;
  }

  if (input.validity.patternMismatch) {
    if (error) error.textContent = "Formato inválido";
    input.classList.add("invalido");
    return false;
  }

  if (input.validity.typeMismatch) {
    if (error) error.textContent = "Correo electrónico inválido";
    input.classList.add("invalido");
    return false;
  }

  input.classList.add("valido");
  return true;
}

campos.forEach((id) => {
  const input = document.getElementById(id);

  if (!input) return;

  input.addEventListener("blur", () => validarCampo(id));
  input.addEventListener("input", () => validarCampo(id));
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let valido = true;

  campos.forEach((id) => {
    if (!validarCampo(id)) {
      valido = false;
    }
  });

  const respuesta = document.getElementById("respuestaRecuperacion");

  if (!respuesta || respuesta.value.trim() === "") {
    mostrarModal("La respuesta de recuperación es obligatoria");
    return;
  }

  if (!valido) return;

  const data = {
    nombre: document.getElementById("nombre").value.trim(),
    correo: document.getElementById("correo").value.trim(),
    contrasena: document.getElementById("password").value,
    preguntarc: document.getElementById("preguntaRecuperacion").value,
    respuestarc: respuesta.value.trim(),
  };

  console.log("ENVIANDO A SQL SERVER:");
  console.log(data);

  try {
    const res = await fetch("http://localhost:5000/api/sqlserver/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    console.log("STATUS:", res.status);
    console.log("RESPUESTA:", result);

    if (res.ok) {
      mostrarModal("Usuario registrado correctamente en SQL Server");
      form.reset();
    } else {
      mostrarModal(result.error || "No se pudo registrar el usuario");
    }
  } catch (error) {
    console.error("ERROR FETCH:", error);
    mostrarModal("Error al conectar con el servidor");
  }
});