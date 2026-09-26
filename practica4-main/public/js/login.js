console.log("login JS cargado");

import { mostrarModal } from "./modal.js";

const formLogin = document.getElementById("formLogin");

formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    correo: document.getElementById("correo").value.trim(),
    contrasena: document.getElementById("password").value,
  };

  try {
    const res = await fetch("http://localhost:5000/api/sqlserver/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      mostrarModal(result.msg || "Inicio de sesión exitoso");

      setTimeout(() => {
        window.location.href = "/bienvenida";
      }, 1000);

    } else {
      mostrarModal(result.msg || result.error || "Correo o contraseña incorrectos");
    }

    document.getElementById("resultado").textContent =
      result.msg || result.error || "";

  } catch (error) {
    console.error("ERROR LOGIN:", error);
    mostrarModal("Error al conectar con el servidor");
  }
});