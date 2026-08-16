document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", function (event) {
        event.preventDefault();

        const targetId = this.getAttribute("href");
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const headerHeight = document.querySelector(".header").offsetHeight;

            const targetPosition =
                targetSection.getBoundingClientRect().top +
                window.pageYOffset -
                headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });
        }
    });
});


document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("click", function () {
        this.style.transform = "scale(0.98)";

        setTimeout(() => {
            this.style.transform = "";
        }, 150);
    });
});