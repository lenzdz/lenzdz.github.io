const navSlide = () => {
    const burger = document.querySelector(".burger");
    const nav = document.querySelector(".nav-links");
    const navLinks = document.querySelectorAll(".nav-links li");

    burger.addEventListener("click",()=>{
        // Mostrar y ocultar menú responsive
        nav.classList.toggle("nav-active");

        // Animar enlaces
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = ""
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 5 + 0.3}s`;
            }
        });

        // Animación de hamburguesita uwu
        burger.classList.toggle("toggle");
    });
}

navSlide ();