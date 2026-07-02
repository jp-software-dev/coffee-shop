/* Café Rústico - Lógica Central Unificada y Optimizada */

/* Espera a que la estructura del documento HTML esté completamente cargada antes de ejecutar la lógica */
document.addEventListener('DOMContentLoaded', () => {
    
    /* 1. INICIALIZAR ÍCONOS */
    
    /* Verifica si la librería Lucide está disponible e inyecta los íconos SVG en el DOM */
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* 2. LÓGICA DEL NAVBAR */
    
    /* Selecciona la barra de navegación principal */
    const navbar = document.getElementById('navbar');
    
    /* Escucha el evento de desplazamiento y aplica o quita la clase 'scrolled' si se baja más de 50px */
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
        
        /* Cierra el menú móvil al navegar (hacer scroll hacia arriba o abajo) */
        if (navLinks && navLinks.classList.contains('mobile-active')) {
            closeMobileMenu();
        }
    }, { passive: true });

    /* Selecciona los elementos del menú móvil: el botón, el contenedor de enlaces y los enlaces individuales */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-links a');

    /* Alterna el menú mobile: muestra/oculta el dropdown y cambia el ícono (menú a x) */
    const toggleMobileMenu = () => {
        const isOpen = navLinks.classList.toggle('mobile-active');
        navbar.classList.toggle('menu-open', isOpen);
        mobileToggle.setAttribute('aria-expanded', isOpen);

        const icon = mobileToggle.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    };

    /* Fuerza el cierre del menú móvil y reinicia sus íconos a su estado original */
    const closeMobileMenu = () => {
        navLinks.classList.remove('mobile-active');
        navbar.classList.remove('menu-open');
        mobileToggle.setAttribute('aria-expanded', 'false');

        const icon = mobileToggle.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', 'menu');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    };

    /* Si existen los elementos del menú móvil, asigna los eventos de clic al botón y a cada enlace */
    if (mobileToggle && navLinks) {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.addEventListener('click', toggleMobileMenu);
        links.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    /* 3. ANIMACIONES FLUIDAS (Scroll reveal) */
    
    /* Configura un observador que añade la clase 'active' a los elementos justo cuando entran en la pantalla */
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.1 });

    /* Selecciona todos los elementos con clases de animación y los asigna al observador */
    document.querySelectorAll('.reveal, .slide-in-right').forEach(el => observer.observe(el));

    /* 4. LÓGICA DE FILTROS PARA EL MENÚ (Con animaciones y Accesibilidad) */
    
    /* Selecciona todos los botones de categorías y todas las tarjetas de platillos */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    /* Añade un evento de clic a cada botón de filtrado del menú */
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            /* Manejo Visual y Accesibilidad (aria-pressed): desactiva todos los botones primero */
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            
            /* Activa visual y semánticamente el botón que fue presionado */
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            
            /* Obtiene el valor de la categoría que se desea filtrar */
            const filter = btn.getAttribute('data-filter');

            /* Filtrado de las tarjetas: recorre cada platillo para mostrarlo u ocultarlo */
            menuCards.forEach(card => {
                const category = card.getAttribute('data-category');
                card.classList.remove('fade-in');
                
                /* Si el filtro es 'all' o coincide con la categoría, muestra la tarjeta y reinicia su animación CSS */
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    void card.offsetWidth; // Forzar reflow para reiniciar CSS animation
                    card.classList.add('fade-in');
                } else {
                    /* Oculta la tarjeta si no pertenece a la categoría seleccionada */
                    card.classList.add('hidden');
                }
            });
        });
    });

    /* 5. LÓGICA DE RESERVAS CON UX/FEEDBACK VISUAL Y PROTECCIÓN ANTI-BOTS */
    
    /* Obtiene las referencias del formulario y sus campos principales */
    const bookingForm = document.getElementById('bookingForm');
    const fechaInput = document.getElementById('fecha');
    const telefonoInput = document.getElementById('telefono');

    /* TRAMPA DE TIEMPO: Registra el momento exacto en que se carga el script en el navegador del usuario */
    const formLoadTime = new Date().getTime();

    /* Establece fecha mínima a hoy para evitar que los usuarios seleccionen días en el pasado */
    if (fechaInput) {
        const today = new Date().toISOString().split('T')[0];
        fechaInput.setAttribute('min', today);
    }

    /* El teléfono mexicano son 10 dígitos: se bloquea cualquier letra/símbolo en tiempo real
       y se corta el valor si el usuario intenta pegar o escribir más de 10 caracteres */
    if (telefonoInput) {
        telefonoInput.setAttribute('maxlength', '10');
        telefonoInput.setAttribute('inputmode', 'numeric');
        telefonoInput.addEventListener('input', () => {
            telefonoInput.value = telefonoInput.value.replace(/\D/g, '').slice(0, 10);
        });
    }

    /* Valida que el correo tenga una estructura básica válida: texto@texto.dominio */
    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    /* Valida que el teléfono tenga exactamente 10 dígitos numéricos (estándar de México) */
    const isValidPhone = (value) => /^\d{10}$/.test(value);

    /* Maneja el proceso de envío del formulario de reserva */
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            /* Evita que la página se recargue al enviar los datos */
            e.preventDefault();

            /* VALIDACIÓN HONEYPOT: Verifica si el campo invisible fue llenado por un bot */
            const honeypot = document.getElementById('validacion_bot');
            if (honeypot && honeypot.value !== '') {
                console.warn('Bloqueo de seguridad: Actividad sospechosa detectada (Honeypot).');
                return;
            }

            /* VALIDACIÓN TRAMPA DE TIEMPO: Calcula los segundos transcurridos desde que cargó la página */
            const formSubmitTime = new Date().getTime();
            const timeToFill = (formSubmitTime - formLoadTime) / 1000;
            
            /* Bloquea la ejecución si el formulario se llenó en menos de 3 segundos */
            if (timeToFill < 3) {
                console.warn('Bloqueo de seguridad: Formulario completado demasiado rápido.');
                return;
            }
            
            /* Lista de los campos que son obligatorios revisar */
            const fields = ['nombre', 'email', 'telefono', 'personas', 'fecha', 'hora'];
            let isValid = true;

            /* Validación básica de campos vacíos: añade una clase de error temporal si falta información */
            fields.forEach(fieldId => {
                const input = document.getElementById(fieldId);
                if (!input.value) {
                    input.classList.add('input-error');
                    isValid = false;
                    setTimeout(() => input.classList.remove('input-error'), 400);
                }
            });

            /* Validación de formato de correo: debe contener arroba y dominio */
            const emailInput = document.getElementById('email');
            if (emailInput.value && !isValidEmail(emailInput.value)) {
                emailInput.classList.add('input-error');
                isValid = false;
                setTimeout(() => emailInput.classList.remove('input-error'), 400);
            }

            /* Validación de teléfono: exige exactamente 10 dígitos y bloquea envío si no cumple */
            if (telefonoInput.value && !isValidPhone(telefonoInput.value)) {
                telefonoInput.classList.add('input-error');
                isValid = false;
                setTimeout(() => telefonoInput.classList.remove('input-error'), 400);
            }

            /* Detiene la ejecución de la reserva si algún campo falló las validaciones visuales */
            if (!isValid) return;

            /* Recopilar Datos: Extrae los valores finales listos para ser enviados */
            const data = {
                nombre: document.getElementById('nombre').value,
                email: document.getElementById('email').value,
                telefono: document.getElementById('telefono').value,
                personas: document.getElementById('personas').value,
                fecha: document.getElementById('fecha').value,
                hora: document.getElementById('hora').value,
                mensaje: document.getElementById('mensaje').value || 'Sin comentarios adicionales.'
            };

            /* Formatea los datos recopilados en un mensaje legible y estructurado para WhatsApp */
            const whatsappMessage = `Hola, quiero hacer una reservación:\n\n` +
                `*Nombre:* ${data.nombre}\n` +
                `*Correo:* ${data.email}\n` +
                `*Teléfono:* ${data.telefono}\n` +
                `*Personas:* ${data.personas}\n` +
                `*Fecha:* ${data.fecha}\n` +
                `*Hora:* ${data.hora}\n` +
                `*Mensaje:* ${data.mensaje}`;

            /* Genera la URL con el número de teléfono y el mensaje codificado */
            const waUrl = `https://wa.me/527298369274?text=${encodeURIComponent(whatsappMessage)}`;
            
            /* Lógica de Feedback: Selecciona botón y mensaje de éxito */
            const btnSubmit = document.getElementById('submitBtn');
            const successMsg = document.getElementById('form-success-msg');

            /* Bloquea el botón visualmente para evitar envíos múltiples y muestra el mensaje de éxito */
            btnSubmit.disabled = true;
            btnSubmit.style.opacity = '0.5';
            successMsg.style.display = 'block';

            /* Pequeña pausa antes de abrir WhatsApp para que el usuario procese el mensaje visual de éxito */
            setTimeout(() => {
                window.open(waUrl, '_blank');
                
                /* Restaurar formulario a su estado original vaciando campos y rehabilitando botón */
                bookingForm.reset();
                btnSubmit.disabled = false;
                btnSubmit.style.opacity = '1';
                successMsg.style.display = 'none';
            }, 1500);
        });
    }

    /* 6. INTEGRACIÓN DEL MAPA GENERAL DE CDMX (Performance: inyección limpia) */
    
    /* Ubica el contenedor destinado al mapa de Google */
    const mapContainer = document.getElementById('map');
    
    /* Inyecta el iframe dinámicamente solo si el contenedor está vacío para evitar consumir recursos extra */
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