'use strict'

document.addEventListener("DOMContentLoaded", () => {
    console.log('Скрипт отработал корректно');

    // --- ПРЕДЗАГРУЗЧИК (ПРЕЛОАДЕР) СТРАНИЦЫ ---
    const preloader = document.getElementById('preloader');
    const minPreloaderDisplayTime = 1000; // Минимальное время отображения прелоадера в мс (1 секунда)
    let pageContentLoaded = false; // Флаг, что весь необходимый контент загружен
    let minTimeElapsed = false; // Флаг, что прошло минимальное время отображения

    // !!! ВАЖНО: Явно показываем прелоадер сразу после загрузки DOM
    if (preloader) {
        preloader.classList.add('show'); // Добавляем класс 'show' для отображения
        console.log('Preloader должен быть виден.');
    }
    // !!! КОНЕЦ ВАЖНОЙ ЧАСТИ


    // Функция, которая будет скрывать прелоадер
    const hidePreloader = () => {
        if (pageContentLoaded && minTimeElapsed && preloader) {
            preloader.classList.remove('show'); // Убираем 'show'
            preloader.classList.add('fade-out'); // Запускаем анимацию исчезновения
            // Удаляем прелоадер из DOM после завершения анимации, чтобы он не мешал
            preloader.addEventListener('transitionend', function handler() {
                preloader.style.display = 'none';
                preloader.removeEventListener('transitionend', handler); // Удаляем слушатель после выполнения
                preloader.remove(); // Окончательно удаляем элемент
            }, { once: true }); // Слушатель сработает только один раз
        }
    };

    // Устанавливаем флаг, что минимальное время прошло
    setTimeout(() => {
        minTimeElapsed = true;
        hidePreloader();
    }, minPreloaderDisplayTime);

    // --- Плавный скролл для навигации ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            const header = document.querySelector('.main-header');
            const headerOffset = header ? header.offsetHeight : 0;
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerOffset - 20;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });

            const navLinksContainer = document.getElementById('mainNav')?.querySelector('.main-nav__list');
            if (navLinksContainer && navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
            }
        });
    });

    // --- Эффект шапки при скролле ---
    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Переключение бургер-меню ---
    const burgerMenu = document.getElementById('burgerMenu');
    const navLinks = document.getElementById('mainNav')?.querySelector('.main-nav__list');

    if (burgerMenu && navLinks) {
        burgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // --- Функциональность аккордеона ---
    const accordionHeaders = document.querySelectorAll('.accordion__header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentItem = header.parentElement;
            const content = header.nextElementSibling;

            accordionHeaders.forEach(otherHeader => {
                const otherItem = otherHeader.parentElement;
                const otherContent = otherHeader.nextElementSibling;
                if (otherItem !== currentItem && otherContent && otherContent.classList.contains('active')) {
                    otherContent.classList.remove('active');
                    otherHeader.classList.remove('active');
                    otherContent.style.maxHeight = '0px';
                }
            });

            if (content) {
                content.classList.toggle('active');
                header.classList.toggle('active');
                if (content.classList.contains('active')) {
                    content.style.maxHeight = (content.scrollHeight + 40) + "px";
                } else {
                    content.style.maxHeight = '0px';
                }
            }
        });
    });

    // --- Функциональность викторины ---
    const quizQuestions = [
        {
            question: "В каком году произошло Крещение Руси?",
            options: ["980", "988", "1000", "962"],
            correct: "988"
        },
        {
            question: "Кто был первым императором Римской империи?",
            options: ["Юлий Цезарь", "Нерон", "Октавиан Август", "Константин Великий"],
            correct: "Октавиан Август"
        },
        {
            question: "Какой документ подписали в 1215 году, ограничивший власть английского короля?",
            options: ["Билль о правах", "Великая хартия вольностей", "Магдебургское право", "Каролингский устав"],
            correct: "Великая хартия вольностей"
        },
        {
            question: "Когда пала Константинополь?",
            options: ["1453", "1204", "1054", "1571"],
            correct: "1453"
        },
        {
            question: "Кто открыл Америку?",
            options: ["Фернан Магеллан", "Васко да Гама", "Христофор Колумб", "Америго Веспуччи"],
            correct: "Христофор Колумб"
        }
    ];

    let currentQuestionIndex = 0;
    let selectedOption = null;

    const quizQuestionEl = document.getElementById('quiz-question');
    const quizOptionsEl = document.getElementById('quiz-options');
    const quizSubmitBtn = document.getElementById('quiz-submit');
    const quizFeedbackEl = document.getElementById('quiz-feedback');
    const quizNextBtn = document.getElementById('quiz-next');

    const quizElementsExist = quizQuestionEl && quizOptionsEl && quizSubmitBtn && quizFeedbackEl && quizNextBtn;

    if (quizElementsExist) {
        function loadQuestion() {
            if (currentQuestionIndex < quizQuestions.length) {
                const questionData = quizQuestions[currentQuestionIndex];
                quizQuestionEl.textContent = questionData.question;
                quizOptionsEl.innerHTML = '';
                quizFeedbackEl.textContent = '';
                quizFeedbackEl.className = 'quiz-block__feedback';
                quizSubmitBtn.style.display = 'block';
                quizNextBtn.style.display = 'none';
                selectedOption = null;

                questionData.options.forEach(option => {
                    const button = document.createElement('button');
                    button.textContent = option;
                    button.classList.add('quiz-block__option-button');
                    button.addEventListener('click', () => selectOption(button, option));
                    quizOptionsEl.appendChild(button);
                });
            } else {
                quizQuestionEl.textContent = "Викторина завершена! Отличная работа!";
                quizOptionsEl.innerHTML = '';
                quizSubmitBtn.style.display = 'none';
                quizNextBtn.style.display = 'none';
                quizFeedbackEl.textContent = 'Поздравляем!';
                quizFeedbackEl.classList.add('correct');
            }
        }

        function selectOption(button, optionValue) {
            document.querySelectorAll('.quiz-block__option-button').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            selectedOption = optionValue;
            quizFeedbackEl.textContent = '';
            quizFeedbackEl.classList.remove('correct', 'incorrect');
        }

        quizSubmitBtn.addEventListener('click', () => {
            if (selectedOption !== null) {
                const correctAnswer = quizQuestions[currentQuestionIndex].correct;
                const optionButtons = document.querySelectorAll('.quiz-block__option-button');

                optionButtons.forEach(button => {
                    button.disabled = true;
                    if (button.textContent === correctAnswer) {
                        button.classList.add('correct');
                    } else if (button.classList.contains('selected')) {
                        button.classList.add('incorrect');
                    }
                });

                if (selectedOption === correctAnswer) {
                    quizFeedbackEl.textContent = "Верно! Отлично!";
                    quizFeedbackEl.classList.add('correct');
                } else {
                    quizFeedbackEl.textContent = `Неверно. Правильный ответ: ${correctAnswer}`;
                    quizFeedbackEl.classList.add('incorrect');
                }
                quizSubmitBtn.style.display = 'none';
                quizNextBtn.style.display = 'block';
            } else {
                quizFeedbackEl.textContent = "Пожалуйста, выберите ответ, прежде чем нажать 'Ответить'!";
                quizFeedbackEl.classList.remove('correct', 'incorrect');
            }
        });

        quizNextBtn.addEventListener('click', () => {
            currentQuestionIndex++;
            loadQuestion();
            document.querySelectorAll('.quiz-block__option-button').forEach(btn => btn.disabled = false);
        });

        loadQuestion();
    } else {
        console.warn('Один или несколько элементов викторины не найдены. Викторина не будет инициализирована.');
    }

    // --- Факт дня ---
    const historicalFacts = [
        "Знаете ли вы, что у Древнего Египта было более 30 династий фараонов за 3000 лет?",
        "Монгольская империя, основанная Чингисханом, была крупнейшей сухопутной империей в истории.",
        "Римская империя достигла своего максимального размера в 117 году н.э. под правлением императора Траяна.",
        "Великая Китайская стена строилась на протяжении более 2000 лет различными династиями.",
        "Черная смерть (чума) в XIV веке уничтожила около трети населения Европы.",
        "Первая Мировая война была названа 'войной, которая покончит со всеми войнами'.",
        "Всемирно известный Стоунхендж в Англии старше египетских пирамид.",
        "Древние римляне изобрели бетон, который использовался для строительства Пантеона и Колизея."
    ];

    const dailyFactEl = document.getElementById('daily-fact');
    if (dailyFactEl) {
        const randomFact = historicalFacts[Math.floor(Math.random() * historicalFacts.length)];
        dailyFactEl.textContent = randomFact;
    }

    // --- Кнопка "Наверх" ---
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // --- Появление секций при прокрутке с IntersectionObserver ---
    const sectionsToReveal = document.querySelectorAll('.reveal-on-scroll');
    const cardsToPopIn = document.querySelectorAll('.animate-pop-in');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sectionsToReveal.forEach(section => {
        sectionObserver.observe(section);
    });

    const popInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    cardsToPopIn.forEach(card => {
        popInObserver.observe(card);
    });

    // =================================================================
    //         Карусель с помощью Swiper.js
    // =================================================================
    const testimonialsSwiperEl = document.getElementById('testimonialsSwiper');
    if (testimonialsSwiperEl && typeof Swiper !== 'undefined') {
        new Swiper(testimonialsSwiperEl, {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            grabCursor: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: 1,
                },
                1024: {
                    slidesPerView: 1,
                }
            }
        });
        console.log('Карусель отзывов Swiper инициализирована.');
    } else {
        console.warn('Элемент Swiper-карусели отзывов не найден или библиотека Swiper не загружена. Карусель не будет инициализирована.');
    }
    // =================================================================
    //         КОНЕЦ ЛОГИКИ: Карусель с помощью Swiper.js
    // =================================================================


    // =================================================================
    //         Доработка форм с LocalStorage
    // =================================================================

    // --- Форма контактов (Contact Form) ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        // Функция для загрузки данных из LocalStorage
        const loadFormData = () => {
            try {
                if (nameInput) nameInput.value = localStorage.getItem('contactName') || '';
                if (emailInput) emailInput.value = localStorage.getItem('contactEmail') || '';
                if (messageInput) messageInput.value = localStorage.getItem('contactMessage') || '';
                console.log('Данные формы контактов загружены из LocalStorage.');
            } catch (e) {
                console.error('Ошибка при загрузке данных формы контактов из LocalStorage:', e);
            }
        };

        // Функция для сохранения данных в LocalStorage
        const saveFormData = () => {
            try {
                if (nameInput) localStorage.setItem('contactName', nameInput.value);
                if (emailInput) localStorage.setItem('contactEmail', emailInput.value);
                if (messageInput) localStorage.setItem('contactMessage', messageInput.value);
            } catch (e) {
                console.error('Ошибка при сохранении данных формы контактов в LocalStorage:', e);
            }
        };

        // Функция для очистки данных из LocalStorage
        const clearFormData = () => {
            try {
                localStorage.removeItem('contactName');
                localStorage.removeItem('contactEmail');
                localStorage.removeItem('contactMessage');
                console.log('Данные формы контактов очищены из LocalStorage.');
            } catch (e) {
                console.error('Ошибка при очистке данных формы контактов из LocalStorage:', e);
            }
        };

        // Привязываем слушатели событий для сохранения данных при изменении полей
        if (nameInput) nameInput.addEventListener('input', saveFormData);
        if (emailInput) emailInput.addEventListener('input', saveFormData);
        if (messageInput) messageInput.addEventListener('input', saveFormData);

        // Обработка отправки формы
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Предотвращаем фактическую отправку формы

            alert('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');

            this.reset(); // Очищаем поля формы
            clearFormData(); // Очищаем данные из LocalStorage после успешной отправки
        });

        // Загружаем данные формы при первой загрузке страницы
        loadFormData();
    } else {
        console.warn('Форма контактов (.contact-form) не найдена. Функционал LocalStorage для нее не будет инициализирован.');
    }
    // =================================================================
    //         КОНЕЦ ЛОГИКИ: Доработка форм с LocalStorage
    // =================================================================


    // =================================================================
    //                 ЛОГИКА КУРСОВ И КОРЗИНЫ
    // =================================================================

    let coursesData = [];
    let cart = [];

    const coursesGrid = document.getElementById('coursesGrid');
    const purchaseModal = document.getElementById('purchaseModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const openCartBtn = document.getElementById('openCartBtn');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    const cartCountElement = document.getElementById('cartCount');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const emptyCartMessage = document.querySelector('.modal__empty-message');


    // Функция для загрузки данных курсов из data.json
    async function fetchCoursesData() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            const data = await response.json();
            coursesData = data.courses;
            renderCourses();
            displayCourseTitles();
        } catch (error) {
            console.error('Не удалось загрузить данные курсов:', error);
            if (coursesGrid) {
                coursesGrid.innerHTML = '<p style="text-align: center; color: var(--accent-color);">Не удалось загрузить курсы. Пожалуйста, попробуйте позже.</p>';
            }
            displayCourseTitles();
        }
    }

    const courseTitlesList = document.getElementById('courseTitlesList');

    function displayCourseTitles() {
        if (!courseTitlesList) {
            console.warn('Элемент #courseTitlesList не найден. Заголовки курсов не будут отображены.');
            return;
        }

        courseTitlesList.innerHTML = '';

        const titles = coursesData.map(course => course.name);

        if (titles.length === 0) {
            courseTitlesList.innerHTML = '<li>Курсы пока не загружены или отсутствуют.</li>';
        } else {
            titles.forEach(title => {
                const listItem = document.createElement('li');
                listItem.textContent = title;
                courseTitlesList.appendChild(listItem);
            });
        }
        console.log('Список названий курсов сформирован:', titles);
    }


    function renderCourses() {
        if (!coursesGrid) return;
        coursesGrid.innerHTML = '';
        coursesData.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.classList.add('card', 'course-card', 'animate-pop-in');
            courseCard.setAttribute('data-id', course.id);

            courseCard.innerHTML = `
                <img src="${course.image}" alt="${course.name}" loading="lazy" class="course-card__image">
                <h3 class="course-card__title">${course.name}</h3>
                <p class="course-card__description">${course.description}</p>
                <div class="course-card__price">${formatPriceRub(course.price)}</div>
                <button class="button button--primary course-card__add-to-cart" data-id="${course.id}">Добавить в корзину</button>
            `;
            coursesGrid.appendChild(courseCard);
            popInObserver.observe(courseCard);
        });

        document.querySelectorAll('.course-card__add-to-cart').forEach(button => {
            button.addEventListener('click', addToCart);
        });
    }

    function addToCart(event) {
        const courseId = parseInt(event.target.dataset.id);
        const existingItem = cart.find(item => item.courseId === courseId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ courseId: courseId, quantity: 1 });
        }
        updateCartUI();
        openModal();
    }

    function removeFromCart(event) {
        const courseId = parseInt(event.target.dataset.id);
        cart = cart.filter(item => item.courseId !== courseId);
        updateCartUI();
    }

    function updateCartUI() {
        if (!cartItemsContainer || !cartTotalElement || !cartCountElement || !checkoutBtn) {
            console.warn('Один или несколько элементов корзины не найдены. UI корзины не будет обновлен.');
            return;
        }

        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            if (emptyCartMessage) {
                emptyCartMessage.style.display = 'block';
            }
        } else {
            if (emptyCartMessage) {
                emptyCartMessage.style.display = 'none';
            }
            cart.forEach(item => {
                const course = coursesData.find(c => c.id === item.courseId);
                if (course) {
                    const cartItemEl = document.createElement('div');
                    cartItemEl.classList.add('modal__cart-list-item');
                    cartItemEl.innerHTML = `
                        <span class="modal__cart-item-name">${course.name} (x${item.quantity})</span>
                        <span class="modal__cart-item-price">${formatPriceRub(course.price * item.quantity)}</span>
                        <button class="modal__remove-item-button" data-id="${course.id}">&times;</button>
                    `;
                    cartItemsContainer.appendChild(cartItemEl);
                    total += course.price * item.quantity;
                }
            });
        }

cartTotalElement.textContent = formatPriceRub(total);

        const prevCount = parseInt(cartCountElement.textContent);
        cartCountElement.textContent = cart.length;
        if (cart.length !== prevCount) {
            cartCountElement.classList.remove('updated');
            void cartCountElement.offsetWidth;
            cartCountElement.classList.add('updated');
        }

        if (cart.length === 0) {
            checkoutBtn.disabled = true;
            checkoutBtn.style.opacity = 0.5;
            checkoutBtn.style.cursor = 'not-allowed';
        } else {
            checkoutBtn.disabled = false;
            checkoutBtn.style.opacity = 1;
            checkoutBtn.style.cursor = 'pointer';
        }
    }

    function openModal() {
        if (purchaseModal) {
            purchaseModal.style.display = 'flex';
            setTimeout(() => {
                purchaseModal.classList.add('active');
            }, 10);
            updateCartUI();
        }
    }

    function closeModal() {
        if (purchaseModal) {
            purchaseModal.classList.remove('active');
            purchaseModal.addEventListener('transitionend', function handler() {
                purchaseModal.style.display = 'none';
                purchaseModal.removeEventListener('transitionend', handler);
            });
        }
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (openCartBtn) openCartBtn.addEventListener('click', openModal);

    window.addEventListener('click', (event) => {
        if (event.target === purchaseModal && purchaseModal.classList.contains('active')) {
            closeModal();
        }
    });

    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal__remove-item-button')) {
                removeFromCart(event);
            }
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                alert('Поздравляем! Ваша покупка успешно оформлена на сумму ' + formatPriceRub(parseFloat(cartTotalElement.textContent)) + '.');
                cart = [];
                updateCartUI();
                closeModal();
            } else {
                alert('Ваша корзина пуста. Добавьте курсы перед оформлением покупки.');
            }
        });
    }


    function formatPriceRub(value) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 2
    }).format(value);
}


    // =================================================================
    //         Динамическая генерация блока из объекта для секции "Почему История Важна?" (через for...in)
    // =================================================================

    // Объект с данными для динамического блока "Почему История Важна?"
    const whyHistoryData = {
        understandWorld: {
            title: "Понимать Мир",
            description: "История объясняет, почему общество, культура и политика устроены именно так. Без знания прошлого невозможно осмыслить настоящее и предвидеть будущее.",
            iconClass: "fas fa-globe-americas" // Font Awesome icon: глобус
        },
        criticalThinking: {
            title: "Развивать Критическое Мышление",
            description: "Изучение истории учит анализировать источники, сопоставлять факты, видеть причинно-следственные связи и формировать собственное, обоснованное мнение.",
            iconClass: "fas fa-brain" // Font Awesome icon: мозг
        },
        avoidMistakes: {
            title: "Избегать Ошибок",
            description: "Как говорил Уинстон Черчилль: 'Народ, забывший свое прошлое, не имеет будущего'. История — это бесценный источник уроков, помогающих не повторять прошлых ошибок человечества.",
            iconClass: "fas fa-history" // Font Awesome icon: история/повторение
        }
    };

    const aboutSectionGrid = document.querySelector('.about-section__grid'); // Получаем контейнер для карточек внутри секции "about"

    if (aboutSectionGrid) {
        // Очищаем содержимое контейнера перед добавлением нового
        aboutSectionGrid.innerHTML = '';

        // Итерируемся по объекту whyHistoryData с помощью for...in
        for (const key in whyHistoryData) {
            // Убеждаемся, что свойство принадлежит самому объекту, а не унаследовано от прототипа
            if (Object.prototype.hasOwnProperty.call(whyHistoryData, key)) {
                const data = whyHistoryData[key]; // Получаем объект с данными для текущего элемента

                const cardElement = document.createElement('div');
                cardElement.classList.add('card', 'about-section__item', 'animate-pop-in');

                cardElement.innerHTML = `
                    ${data.iconClass ? `<div class="about-section__item-icon"><i class="${data.iconClass}"></i></div>` : ''}
                    <h3 class="card__title">${data.title}</h3>
                    <p class="card__description">${data.description}</p>
                `;

                aboutSectionGrid.appendChild(cardElement);

                popInObserver.observe(cardElement);
            }
        }
        console.log('Динамический блок для секции "Почему История Важна?" сформирован и добавлен на страницу.');
    } else {
        console.warn('Элемент .about-section__grid не найден. Динамический блок для секции "Почему История Важна?" не будет отображен.');
    }

    // =================================================================
    //         КОНЕЦ ЛОГИКИ
    // =================================================================


    // Вызываем все асинхронные операции по загрузке данных
    // и ждем их выполнения, прежде чем скрыть прелоадер.
    Promise.all([
        fetchCoursesData() // Загрузка данных курсов
        // Здесь могут быть другие fetch-запросы, если есть
    ]).then(() => {
        // Когда все fetch-операции завершены, устанавливаем флаг
        pageContentLoaded = true;
        hidePreloader(); // И пытаемся скрыть прелоадер
    }).catch(error => {
        // Если при загрузке данных произошла ошибка, все равно скрываем прелоадер
        console.error("Ошибка при загрузке основных данных страницы:", error);
        pageContentLoaded = true; // Убеждаемся, что прелоадер скроется даже при ошибке
        hidePreloader();
    });

});