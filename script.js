// =========================================
// 1. FULL-PAGE INTERACTIVE DATA PARTICLE NETWORK
// =========================================
const canvas = document.getElementById("dataCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;

if (canvas && ctx) {
    let particles = [];
    const mouse = { x: null, y: null, radius: 140 };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener("mouseout", () => {
        mouse.x = null;
        mouse.y = null;
    });

    class DataNode {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.vx = (Math.random() - 0.5) * 0.55;
            this.vy = (Math.random() - 0.5) * 0.55;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.hypot(dx, dy);
                if (dist < mouse.radius && dist > 0) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= (dx / dist) * force * 1.4;
                    this.y -= (dy / dist) * force * 1.4;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(246, 155, 92, 0.55)";
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 18000), 85);
        for (let i = 0; i < count; i++) {
            particles.push(new DataNode());
        }
    }

    function connectParticles() {
        const maxDist = 135;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = Math.hypot(dx, dy);

                if (dist < maxDist) {
                    const opacity = (1 - dist / maxDist) * 0.22;
                    ctx.strokeStyle = `rgba(232, 107, 44, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animateCanvas);
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animateCanvas();
}

// =========================================
// 2. MOBILE NAVIGATION TOGGLE
// =========================================
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-link");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        menuToggle.classList.toggle("open", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navItems.forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuToggle.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}

// =========================================
// 3. ROTATING HERO ROLE PHRASE
// =========================================
const changingWord = document.getElementById("changingWord");
const phrases = [
    "Problem Solver",
    "Insight Explorer",
    "Data Storyteller",
    "Data Analyst"
];
let phraseIndex = 0;

if (changingWord) {
    setInterval(() => {
        changingWord.style.opacity = "0";
        changingWord.style.transform = "translateY(-6px)";

        setTimeout(() => {
            phraseIndex = (phraseIndex + 1) % phrases.length;
            changingWord.textContent = phrases[phraseIndex];
            changingWord.style.opacity = "1";
            changingWord.style.transform = "translateY(0)";
        }, 250);
    }, 2800);
}

// =========================================
// 4. SCROLL PROGRESS, HEADER & ACTIVE LINKS
// =========================================
const scrollProgress = document.getElementById("scrollProgress");
const siteHeader = document.getElementById("siteHeader");
const backToTop = document.getElementById("backToTop");
const sections = document.querySelectorAll("main section[id]");

window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollProgress && docHeight > 0) {
        scrollProgress.style.width = `${(scrollTop / docHeight) * 100}%`;
    }

    if (siteHeader) {
        siteHeader.classList.toggle("scrolled", scrollTop > 30);
    }

    if (backToTop) {
        backToTop.classList.toggle("show", scrollTop > 400);
    }

    let currentSectionId = "home";
    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 130;
        if (scrollTop >= sectionTop) {
            currentSectionId = section.getAttribute("id");
        }
    });

    navItems.forEach((link) => {
        const href = link.getAttribute("href");
        link.classList.toggle("active", href === `#${currentSectionId}`);
    });
});

if (backToTop) {
    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// =========================================
// 5. STAGGERED SCROLL REVEAL ANIMATION
// =========================================
const skillCards = document.querySelectorAll(".skill-card");
skillCards.forEach((card, index) => {
    card.style.transitionDelay = `${(index % 4) * 80}ms`;
});

const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12 }
);

revealElements.forEach((el) => revealObserver.observe(el));

// =========================================
// 6. 3D INTERACTIVE TILT EFFECT ON CARDS
// =========================================
const tiltCards = document.querySelectorAll(".tilt-card");
tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)";
    });
});

// =========================================
// 7. CONTACT FORM (FORMSPREE) & FOOTER YEAR
// =========================================
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const formData = new FormData(contactForm);

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";
        }

        try {
            const response = await fetch(contactForm.action, {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json"
                }
            });

            if (response.ok) {
                contactForm.reset();
                if (formStatus) {
                    formStatus.textContent = "Thank you! Your message has been sent.";
                    formStatus.style.color = "#F69B5C";
                }
            } else {
                if (formStatus) {
                    formStatus.textContent = "Oops! Something went wrong. Please email me directly.";
                    formStatus.style.color = "#ff7b7b";
                }
            }
        } catch (error) {
            if (formStatus) {
                formStatus.textContent = "Network error. Please try again or email me directly.";
                formStatus.style.color = "#ff7b7b";
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message <span>↗</span>';
            }
        }
    });
}

const currentYearEl = document.getElementById("currentYear");
if (currentYearEl) {
    currentYearEl.textContent = String(new Date().getFullYear());
}