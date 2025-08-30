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

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyBDldnZMkQnOmC_wtJ0p6tt6ADadkUzRak",
  authDomain: "systemischveraendern.firebaseapp.com",
  projectId: "systemischveraendern",
  storageBucket: "systemischveraendern.firebasestorage.app",
  messagingSenderId: "937662984790",
  appId: "1:937662984790:web:b15591f5ccb9d892bf41f7",
  measurementId: "G-PPL2L5R0JP"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// === Views Zähler ===
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".views").forEach(async el => {
    const blogId = el.dataset.id;
    const isDetail = el.dataset.detail === "true";
    const ref = doc(db, "blogViews", blogId);

    onSnapshot(ref, (docSnap) => {
      if (docSnap.exists()) {
        el.textContent = docSnap.data().views;
      } else {
        el.textContent = 0;
      }
    });

    if (isDetail) {
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const currentViews = snap.data().views || 0;
        await updateDoc(ref, { views: currentViews + 1 });
      } else {
        await setDoc(ref, { views: 1 });
      }
    }
  });
});


  // =====================
  // Weitere Artikel laden
  // =====================
  // script.js
document.addEventListener("DOMContentLoaded", async () => {
  const relatedSection = document.querySelector(".related-articles .blog-articles");

  if (!relatedSection) {
    console.log("👉 Keine Related-Articles-Section gefunden – Script läuft nur auf Detailseiten.");
    return;
  }

  try {
    console.log("👉 Versuche Blogübersicht zu laden…");
    const response = await fetch("https://powerlina.github.io/systemischveraendern/blog.html");

    if (!response.ok) throw new Error("Fehler beim Laden der Blogübersicht");

    const text = await response.text();
    console.log("👉 Blogübersicht erfolgreich geladen.");

    // HTML parsen
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    // Alle Artikel auf der Übersicht holen
    const articles = Array.from(doc.querySelectorAll(".blog-articles .blog-card"));
    console.log(`👉 ${articles.length} Artikel auf der Blogübersicht gefunden.`);

    if (articles.length === 0) {
      relatedSection.innerHTML = "<p>Keine weiteren Artikel gefunden.</p>";
      return;
    }

    // Aktuelle Seite erkennen (Dateiname)
    const currentPage = window.location.pathname.split("/").pop();
    console.log("👉 Aktuelle Seite:", currentPage);

    // Filter: Nur Artikel, die NICHT die aktuelle Seite sind
    const filtered = articles.filter(a => {
      const href = a.getAttribute("href");
      return href !== currentPage;
    });

    console.log(`👉 ${filtered.length} Artikel nach Filter (exkl. aktuelle Seite).`);

    // Maximal 3 Artikel einfügen
    filtered.slice(0, 3).forEach(article => {
      relatedSection.appendChild(article.cloneNode(true));
    });

    console.log("👉 Artikel erfolgreich eingefügt:", relatedSection.querySelectorAll(".blog-card").length);

  } catch (err) {
    console.error("❌ Fehler beim Laden der weiteren Artikel:", err);
    relatedSection.innerHTML = "<p>Artikel konnten nicht geladen werden.</p>";
  }
});
