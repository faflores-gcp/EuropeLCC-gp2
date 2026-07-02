document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById("navbar");
    const alertBtn = document.getElementById("alertBtn");

    // Efecto de scroll en el Navbar
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.style.padding = "5px 0";
            navbar.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
        } else {
            navbar.style.padding = "0";
            navbar.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
        }
    });

    // Interacción básica de prueba
    alertBtn.addEventListener("click", () => {
        alert("¡Gracias por tu interés! El sistema de suscripciones de Travel Europe LLC está actualmente en mantenimiento.");
    });
});
