document.addEventListener('DOMContentLoaded', function() {

    const modal = document.getElementById('login-modal');
    const loginTriggers = document.querySelectorAll('.login-trigger');
    const protectedLinks = document.querySelectorAll('.protected-link');
    const closeButton = document.querySelector('.close-button');
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');
    // Referencia al botón de submit para cambiar su estilo
    const loginSubmitButton = loginForm ? loginForm.querySelector('button[type="submit"]') : null;

    let pendingRedirectUrl = null;

    const showModal = () => {
        if (modal) modal.classList.add('show');
    };

    const closeModal = () => {
        if (modal) modal.classList.remove('show');
        if (loginError) loginError.style.display = 'none';
        if (loginForm) {
            loginForm.reset();
            // Al cerrar, resetear el botón a su estado original azul
            if(loginSubmitButton) loginSubmitButton.classList.remove('btn-ready');
        }
    };

    loginTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(event) {
            event.preventDefault();
            pendingRedirectUrl = null;
            showModal();
        });
    });

    protectedLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const destination = this.dataset.href;
            if (sessionStorage.getItem('isLoggedIn') === 'true') {
                window.location.href = destination;
            } else {
                pendingRedirectUrl = destination;
                showModal();
            }
        });
    });

    if (closeButton) closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeModal();
    });

    // --- LÓGICA PARA CAMBIAR EL COLOR DEL BOTÓN DE LOGIN ---
    const checkFormFields = () => {
        if (usernameInput && passwordInput && loginSubmitButton) {
            // Si ambos campos tienen texto (después de quitar espacios), añade la clase
            if (usernameInput.value.trim() !== '' && passwordInput.value.trim() !== '') {
                loginSubmitButton.classList.add('btn-ready');
            } else {
                loginSubmitButton.classList.remove('btn-ready');
            }
        }
    };

    // Escuchar cada vez que el usuario teclea en los campos
    if (usernameInput) usernameInput.addEventListener('input', checkFormFields);
    if (passwordInput) passwordInput.addEventListener('input', checkFormFields);
    // --- Fin de la lógica del color del botón ---


    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            
            const validUser = 'cliente';
            const validPass = '1234';

            if (username.toLowerCase() === validUser && password === validPass) {
                loginError.style.display = 'none';
                sessionStorage.setItem('isLoggedIn', 'true');
                closeModal();
                setTimeout(() => {
                    if (pendingRedirectUrl) {
                        window.location.href = pendingRedirectUrl;
                    } else {
                        window.location.href = 'marcas.html';
                    }
                }, 100);
            } else {
                loginError.style.display = 'block';
            }
        });
    }
});