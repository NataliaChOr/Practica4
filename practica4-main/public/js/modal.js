export function mostrarModal(mensaje) {
  const modal = document.getElementById("modal");
  const texto = document.getElementById("modalMensaje");

  texto.textContent = mensaje;
  modal.style.display = "block";

  document.getElementById("cerrarModal").onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  };
}