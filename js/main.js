/* Café Rústico - Lógica Central Unificada y Optimizada */

document.addEventListener('DOMContentLoaded', () => {
    // 1. INICIALIZAR ÍCONOS
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. LÓGICA DEL NAVBAR
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    }, { passive: true });

    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-links a');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => navLinks.classList.toggle('mobile-active'));
        links.forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('mobile-active'));
        });
    }

    // 3. ANIMACIONES FLUIDAS (Scroll reveal)
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .slide-in-right').forEach(el => observer.observe(el));

    // 4. LÓGICA DE FILTROS PARA EL MENÚ (Con animaciones y Accesibilidad)
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Manejo Visual y Accesibilidad (aria-pressed)
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            
            const filter = btn.getAttribute('data-filter');

            // Filtrado de las tarjetas
            menuCards.forEach(card => {
                const category = card.getAttribute('data-category');
                card.classList.remove('fade-in');
                
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    void card.offsetWidth; // Forzar reflow para reiniciar CSS animation
                    card.classList.add('fade-in');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // 5. LÓGICA DE RESERVAS CON UX/FEEDBACK VISUAL
    const bookingForm = document.getElementById('bookingForm');
    const fechaInput = document.getElementById('fecha');

    if (fechaInput) {
        // Establecer fecha mínima a hoy para evitar reservas pasadas
        const today = new Date().toISOString().split('T')[0];
        fechaInput.setAttribute('min', today);
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const fields = ['nombre', 'email', 'telefono', 'personas', 'fecha', 'hora'];
            let isValid = true;

            // Validación básica de campos vacíos
            fields.forEach(fieldId => {
                const input = document.getElementById(fieldId);
                if (!input.value) {
                    input.classList.add('input-error');
                    isValid = false;
                    setTimeout(() => input.classList.remove('input-error'), 400);
                }
            });

            if (!isValid) return;

            // Recopilar Datos
            const data = {
                nombre: document.getElementById('nombre').value,
                email: document.getElementById('email').value,
                telefono: document.getElementById('telefono').value,
                personas: document.getElementById('personas').value,
                fecha: document.getElementById('fecha').value,
                hora: document.getElementById('hora').value,
                mensaje: document.getElementById('mensaje').value || 'Sin comentarios adicionales.'
            };

            const whatsappMessage = `Hola, quiero hacer una reservación:\n\n` +
                `👤 *Nombre:* ${data.nombre}\n` +
                `📧 *Correo:* ${data.email}\n` +
                `📞 *Teléfono:* ${data.telefono}\n` +
                `👥 *Personas:* ${data.personas}\n` +
                `📅 *Fecha:* ${data.fecha}\n` +
                `⏰ *Hora:* ${data.hora}\n` +
                `💬 *Mensaje:* ${data.mensaje}`;

            const waUrl = `https://wa.me/527211001122?text=${encodeURIComponent(whatsappMessage)}`;
            
            // Lógica de Feedback (Mejora de UX)
            const btnSubmit = document.getElementById('submitBtn');
            const successMsg = document.getElementById('form-success-msg');

            btnSubmit.disabled = true;
            btnSubmit.style.opacity = '0.5';
            successMsg.style.display = 'block';

            // Pequeña pausa antes de abrir WhatsApp para que el usuario procese el mensaje
            setTimeout(() => {
                window.open(waUrl, '_blank');
                
                // Restaurar formulario a su estado original
                bookingForm.reset();
                btnSubmit.disabled = false;
                btnSubmit.style.opacity = '1';
                successMsg.style.display = 'none';
            }, 1500);
        });
    }

    // 6. INTEGRACIÓN DEL MAPA GENERAL DE CDMX (Performance: inyección limpia)
    const mapContainer = document.getElementById('map');
    
    if (mapContainer && mapContainer.children.length === 0) {
        const iframe = document.createElement('iframe');
        iframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d240833.42867828068!2d-99.3146132470659!3d19.4326077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ce0026db097507%3A0x54061076265ee841!2sCiudad%20de%20M%C3%A9xico%2C%20CDMX!5e0!3m2!1ses-419!2smx!4v1710000000000!5m2!1ses-419!2smx";
        iframe.width = "100%";
        iframe.height = "100%";
        iframe.style.border = "0";
        iframe.title = "Ubicación de Ciudad de México";
        iframe.allowFullscreen = "";
        iframe.loading = "lazy";
        iframe.referrerPolicy = "no-referrer-when-downgrade";

        mapContainer.appendChild(iframe);
    }
});