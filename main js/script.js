// script.js — динамическое переключение между разделами, мобильное меню, работа с формой

document.addEventListener('DOMContentLoaded', function() {
    // ========== 1. ПОЛУЧАЕМ ЭЛЕМЕНТЫ ==========
    const homeSection = document.getElementById('homeSection');
    const contactsSection = document.getElementById('contactsSection');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileToggle = document.getElementById('mobileToggle');
    const mainNav = document.querySelector('.main-nav');
    const body = document.body;
    
    // ========== 2. ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ СЕКЦИЙ ==========
    function switchSection(sectionId) {
        // Скрываем обе секции
        if (homeSection) homeSection.style.display = 'none';
        if (contactsSection) contactsSection.style.display = 'none';
        
        // Показываем нужную
        if (sectionId === 'home') {
            if (homeSection) homeSection.style.display = 'flex';
        } else if (sectionId === 'contacts') {
            if (contactsSection) contactsSection.style.display = 'flex';
        }
        
        // Обновляем активный класс в навигации
        navLinks.forEach(link => {
            const page = link.getAttribute('data-page');
            if (page === sectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Сохраняем текущий раздел в localStorage, чтобы при обновлении страницы остаться там же
        localStorage.setItem('currentSection', sectionId);
        
        // Закрываем мобильное меню после клика (на мобилках удобно)
        if (window.innerWidth <= 680) {
            closeMobileMenu();
        }
    }
    
    // ========== 3. ОБРАБОТЧИКИ КЛИКОВ ПО ССЫЛКАМ ==========
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // отменяем переход по якорю
            const page = this.getAttribute('data-page');
            if (page === 'home') {
                switchSection('home');
                // обновляем URL без перезагрузки (опционально)
                history.pushState({ section: 'home' }, '', '#home');
            } else if (page === 'contacts') {
                switchSection('contacts');
                history.pushState({ section: 'contacts' }, '', '#contacts');
            }
        });
    });
    
    // ========== 4. ВОССТАНОВЛЕНИЕ ПОСЛЕДНЕЙ АКТИВНОЙ СЕКЦИИ ==========
    const savedSection = localStorage.getItem('currentSection');
    // Проверяем также hash в URL (например, site.ru#contacts)
    const hash = window.location.hash.slice(1); // убираем #
    
    let initialSection = 'home'; // по умолчанию
    if (hash === 'contacts' || savedSection === 'contacts') {
        initialSection = 'contacts';
    } else if (hash === 'home' || savedSection === 'home') {
        initialSection = 'home';
    }
    
    switchSection(initialSection);
    
    // Обрабатываем кнопки "Назад/Вперед" в браузере
    window.addEventListener('popstate', function(event) {
        const hash = window.location.hash.slice(1);
        if (hash === 'home' || hash === 'contacts') {
            switchSection(hash);
        } else {
            // Если нет хэша, показываем сохранённый или home
            const saved = localStorage.getItem('currentSection');
            switchSection(saved === 'contacts' ? 'contacts' : 'home');
        }
    });
    
    // ========== 5. МОБИЛЬНОЕ МЕНЮ (ГАМБУРГЕР) ==========
    function openMobileMenu() {
        if (mainNav) {
            mainNav.classList.add('open');
            body.classList.add('menu-open');
            if (mobileToggle) mobileToggle.classList.add('active');
        }
    }
    
    function closeMobileMenu() {
        if (mainNav) {
            mainNav.classList.remove('open');
            body.classList.remove('menu-open');
            if (mobileToggle) mobileToggle.classList.remove('active');
        }
    }
    
    function toggleMobileMenu() {
        if (mainNav && mainNav.classList.contains('open')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Закрываем меню при клике вне его области (на больших экранах не мешает, на мобилках удобно)
    document.addEventListener('click', function(event) {
        const isMobile = window.innerWidth <= 680;
        if (isMobile && mainNav && mainNav.classList.contains('open')) {
            // Проверяем, кликнули ли не по меню и не по кнопке-гамбургеру
            const isClickInsideNav = mainNav.contains(event.target);
            const isClickOnToggle = mobileToggle && mobileToggle.contains(event.target);
            if (!isClickInsideNav && !isClickOnToggle) {
                closeMobileMenu();
            }
        }
    });
    
    // При изменении размера окна закрываем мобильное меню, если ширина стала больше 680px
    window.addEventListener('resize', function() {
        if (window.innerWidth > 680 && mainNav && mainNav.classList.contains('open')) {
            closeMobileMenu();
        }
    });
    
    // ========== 6. ОБРАБОТКА ФОРМЫ КОНТАКТОВ (без перезагрузки) ==========
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // предотвращаем реальную отправку и перезагрузку
            
            // Получаем данные из полей
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';
            
            // Простая валидация
            if (!name) {
                showFormFeedback('Пожалуйста, введите ваше имя', 'error');
                return;
            }
            
            if (!email) {
                showFormFeedback('Пожалуйста, введите email', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showFormFeedback('Введите корректный email (например, name@domain.ru)', 'error');
                return;
            }
            
            if (!message) {
                showFormFeedback('Пожалуйста, напишите сообщение', 'error');
                return;
            }
            
            // Имитация отправки на сервер (здесь можно заменить на реальный fetch)
            // В реальном проекте: fetch('/api/send', { method: 'POST', body: JSON.stringify({name, email, message}) })
            setTimeout(() => {
                showFormFeedback('✅ Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
                contactForm.reset(); // очищаем форму
            }, 500);
            
            // Альтернатива: показать данные в консоли для демонстрации
            console.log('Отправлено:', { name, email, message });
        });
    }
    
    // Функция показа сообщения обратной связи
    function showFormFeedback(message, type) {
        if (!formFeedback) return;
        
        formFeedback.textContent = message;
        formFeedback.style.display = 'block';
        
        // Стилизуем в зависимости от типа
        if (type === 'error') {
            formFeedback.style.backgroundColor = '#fee2e2';
            formFeedback.style.color = '#991b1b';
            formFeedback.style.borderLeftColor = '#dc2626';
        } else {
            formFeedback.style.backgroundColor = '#dcfce7';
            formFeedback.style.color = '#166534';
            formFeedback.style.borderLeftColor = '#22c55e';
        }
        
        // Автоматически скрываем через 4 секунды
        setTimeout(() => {
            if (formFeedback) {
                formFeedback.style.opacity = '0';
                setTimeout(() => {
                    if (formFeedback) {
                        formFeedback.style.display = 'none';
                        formFeedback.style.opacity = '1';
                    }
                }, 300);
            }
        }, 4000);
    }
    
    // Вспомогательная функция валидации email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // ========== 7. ДОПОЛНИТЕЛЬНО: ПЛАВНАЯ ПРОКРУТКА ДЛЯ ССЫЛОК ИЗ ПОДВАЛА ==========
    const footerContactsLink = document.querySelector('.footer-contacts-link');
    if (footerContactsLink) {
        footerContactsLink.addEventListener('click', function(e) {
            e.preventDefault();
            switchSection('contacts');
            // Прокручиваем к началу контента (опционально)
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Обработка ссылок в сайдбаре, если они ведут на якоря внутри сайта
    // (для целостности можно сделать, но не обязательно)
    console.log('✅ JavaScript загружен. Работают: переключение секций, меню-гамбургер, отправка формы без перезагрузки');
});