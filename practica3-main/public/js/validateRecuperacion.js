console.log("JS recuperación cargado");

import { mostrarModal } from "./modal.js";

const correoInput = document.getElementById("correo");
const preguntaTexto = document.getElementById("preguntaTexto");
const form = document.getElementById("formRecuperacion");

const preguntas = {
  mascota: "¿Nombre de tu primera mascota?",
  escuela: "¿Nombre de tu escuela primaria?",
  comida: "¿Comida favorita?"
};

correoInput.addEventListener("blur", async () => {
  const correo = correoInput.value.trim();

  if (!correo) return;

  try {
    const res = await fetch("http://localhost:5000/api/sqlserver/pregunta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correo }),
    });

    const data = await res.json();

    if (res.ok) {
      preguntaTexto.textContent = preguntas[data.pregunta] || data.pregunta;
    } else {
      preguntaTexto.textContent = data.msg || "Usuario no encontrado";
    }

  } catch (error) {
    console.error("ERROR PREGUNTA:", error);
    preguntaTexto.textContent = "Error al conectar con el servidor";
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    correo: correoInput.value.trim(),
    respuesta: document.getElementById("respuestaRecuperacion").value.trim(),
    nuevaContrasena: document.getElementById("nuevaPassword").value,
  };

  try {
    const res = await fetch("http://localhost:5000/api/sqlserver/recuperar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      mostrarModal(result.msg || "Contraseña actualizada correctamente");
      form.reset();
      preguntaTexto.textContent = "";
    } else {
      mostrarModal(result.msg || result.error || "No se pudo recuperar la cuenta");
    }

  } catch (error) {
    console.error("ERROR RECUPERAR:", error);
    mostrarModal("Error al conectar con el servidor");
  }
});