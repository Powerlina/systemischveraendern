// ==== Mobiles Menü ====
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });

    // Menü schließt automatisch, wenn Link geklickt wird
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('show');
        });
    });
};


// ==== Accordion für Systemischer Ansatz ====
document.addEventListener("DOMContentLoaded", () => {
    const accordions = document.querySelectorAll('.accordion-item');

    accordions.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');

        content.style.maxHeight = "0px";
        content.style.overflow = "hidden";

        header.addEventListener('click', () => {
            accordions.forEach(i => {
                if (i !== item) {
                    i.classList.remove('active');
                    i.querySelector('.accordion-content').style.maxHeight = "0px";
                    i.style.background = 'transparent';
                }
            });

            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
                item.style.background = 'var(--offwhite)';
            } else {
                content.style.maxHeight = "0px";
                item.style.background = 'transparent';
            }
        });
    });

    // Intersection Observer für Animation
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    accordions.forEach(item => observer.observe(item));
});

// ==== Testimonials Slider ====
let testimonialIndex = 0;
const testimonials = document.querySelectorAll('.testimonial');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

function showTestimonial(index) {
    testimonials.forEach((t, i) => {
        t.classList.toggle('active', i === index);
    });
}

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        testimonialIndex = (testimonialIndex - 1 + testimonials.length) % testimonials.length;
        showTestimonial(testimonialIndex);
    });

    nextBtn.addEventListener('click', () => {
        testimonialIndex = (testimonialIndex + 1) % testimonials.length;
        showTestimonial(testimonialIndex);
    });
}

// Starte mit dem ersten Testimonial
showTestimonial(testimonialIndex);

// ==== Smooth Scrolling mit dynamischem Offset ====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 0;
            const elementPosition = target.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - navbarHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==== EmailJS Kontaktformular ====
(function() {
  emailjs.init("XngsvXwjlOTTTpu4A"); // Dein Public Key
})();

const contactForm = document.getElementById("contact-form");
if(contactForm) {
    contactForm.addEventListener("submit", function(e) {
        e.preventDefault();

        emailjs.sendForm("contact_systemisch", "Anfrage", this)
        .then(() => {
            alert("Danke für deine Nachricht! Ich melde mich bald bei dir.");
            contactForm.reset();
        }, (error) => {
            console.error("Fehler:", error);
            alert("Leider gab es ein Problem beim Senden. Bitte versuche es erneut.");
        });
    });
};

// ==== Blog Views ====

document.addEventListener("DOMContentLoaded", async () => {
  // =====================
  // Views zählen
  // =====================
  const counters = document.querySelectorAll(".views");
  counters.forEach(counter => {
    const id = counter.dataset.id;
    const isDetail = counter.dataset.detail === "true";

    let views = parseInt(localStorage.getItem("views-" + id)) || 0;

    if (isDetail) {
      views++;
      localStorage.setItem("views-" + id, views);
      console.log(`[Views] Artikel ${id} auf Detailseite geöffnet → neue Views: ${views}`);
    } else {
      console.log(`[Views] Artikel ${id} auf Übersicht → aktuelle Views: ${views}`);
    }

    counter.textContent = views;
  });


  // =====================
  // Weitere Artikel laden
  // =====================
  const relatedContainer = document.querySelector(".related-articles .blog-articles");
  if (!relatedContainer) {
    console.log("[Related] Keine .related-articles gefunden → Script bricht hier ab");
    return;
  }

  try {
    console.log("[Related] Versuche blog.html von GitHub zu laden...");
    const response = await fetch("https://powerlina.github.io/systemischveraendern/blog.html");
    if (!response.ok) throw new Error("Blogseite konnte nicht geladen werden");

    const htmlText = await response.text();
    console.log("[Related] Blogseite erfolgreich geladen, Länge:", htmlText.length);

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");

    const allArticles = doc.querySelectorAll(".blog-section .blog-card");
    console.log("[Related] Gefundene Artikel:", allArticles.length);

    const currentUrl = window.location.pathname.split("/").pop();
    console.log("[Related] Aktuelle Seite:", currentUrl);

    let count = 0;
    const maxRelated = 3;

    allArticles.forEach(article => {
      const href = article.getAttribute("href");
      console.log("[Related] Prüfe Artikel:", href);

      if (!href.includes(currentUrl) && count < maxRelated) {
        console.log("   ➝ Wird als Related hinzugefügt");
        const clone = article.cloneNode(true);
        relatedContainer.appendChild(clone);
        count++;
      } else {
        console.log("   ➝ Übersprungen (ist aktuelle Seite oder Limit erreicht)");
      }
    });

    if (count === 0) {
      console.log("[Related] Keine weiteren Artikel gefunden");
      relatedContainer.innerHTML = "<p>Keine weiteren Artikel verfügbar.</p>";
    }
  } catch (err) {
    console.error("[Related] Fehler beim Laden:", err);
    relatedContainer.innerHTML = "<p>Artikel konnten nicht geladen werden.</p>";
  }
});
