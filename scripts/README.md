В данной папке размещаем скриптовые файлы *.js



## Динамические и интерактивные компоненты UI (Папка: `scripts/`)

Значительная часть пользовательского интерфейса (UI) в этом проекте генерируется или управляется с помощью JavaScript, используя данные из локальных массивов/объектов или внешнего `data.json`. Ниже описаны ключевые динамические и интерактивные компоненты:

### 1. Предзагрузчик страницы (`#preloader`)
*   **Описание:** Полноэкранное анимационное наложение, отображаемое в начале загрузки страницы для индикации процесса и улучшения пользовательского опыта.
*   **Источник данных:** Отсутствует (управляется таймерами и событиями JS).
*   **Основные функции управления:**
    *   Инициализация в `DOMContentLoaded`.
    *   `hidePreloader()`: плавно скрывает прелоадер после загрузки контента и истечения минимального времени.
    *   `setTimeout()`: для контроля минимального времени отображения.
    *   `Promise.all()`: для ожидания загрузки всех критически важных данных (`fetchCoursesData()`).
*   **Интерактивность:** Автоматическое отображение и скрытие, не требует прямого взаимодействия с пользователем.

### 2. Плавный скролл для навигации
*   **Описание:** Обеспечивает плавную прокрутку страницы к соответствующим секциям при клике на элементы навигационного меню.
*   **Источник данных:** HTML-атрибуты `href` навигационных ссылок.
*   **Основные функции управления:**
    *   `document.querySelectorAll('a[href^="#"]').forEach(anchor => { ... })`: Слушатель клика для всех якорных ссылок.
    *   `window.scrollTo()`: Метод для выполнения плавного скролла.
*   **Интерактивность:** Пользовательский клик по элементам меню.

### 3. Эффект шапки при скролле (`.main-header`)
*   **Описание:** Шапка сайта меняет свой стиль (например, добавляет тень или изменяет прозрачность) при прокрутке страницы вниз, сигнализируя о прокрутке.
*   **Источник данных:** Позиция скролла окна (`window.scrollY`).
*   **Основные функции управления:** `window.addEventListener('scroll')`.
*   **Интерактивность:** Пользовательская прокрутка страницы.

### 4. Переключение бургер-меню (`#burgerMenu`)
*   **Описание:** Реализует функциональность "бургер-меню" для мобильных устройств, позволяя открывать и закрывать навигационное меню.
*   **Источник данных:** Отсутствует.
*   **Основные функции управления:** `burgerMenu.addEventListener('click')`, `classList.toggle('active')`.
*   **Интерактивность:** Пользовательский клик по иконке бургер-меню.

### 5. Функциональность аккордеона (`.accordion`)
*   **Описание:** Позволяет раскрывать и сворачивать разделы контента (например, исторические периоды), при этом гарантируя, что только один раздел может быть открыт одновременно.
*   **Источник данных:** Статическая HTML-структура аккордеона.
*   **Основные функции управления:** `forEach(header => header.addEventListener('click'))`, `classList.toggle('active')`, `style.maxHeight` для плавной анимации.
*   **Интерактивность:** Пользовательский клик по заголовкам аккордеона.

### 6. Функциональность викторины (`#quiz`)
*   **Описание:** Интерактивная викторина с несколькими вопросами и вариантами ответов. Позволяет пользователю выбирать ответы, проверять их и переходить к следующему вопросу.
*   **Источник данных:** Локальный массив `quizQuestions` в `script.js`.
*   **Основные функции управления:**
    *   `loadQuestion()`: загружает текущий вопрос и его варианты.
    *   `selectOption()`: обрабатывает выбор пользователя.
    *   `quizSubmitBtn.addEventListener('click')`: проверяет ответ, подсвечивает правильный/неправильный.
    *   `quizNextBtn.addEventListener('click')`: переходит к следующему вопросу.
*   **Интерактивность:** Выбор варианта ответа, клик по кнопкам "Ответить" и "Следующий вопрос".

### 7. Факт дня (`#daily-fact`)
*   **Описание:** Динамически отображает случайный исторический факт при каждой загрузке страницы.
*   **Источник данных:** Локальный массив `historicalFacts` в `script.js`.
*   **Основные функции управления:** `Math.random()`, `textContent` assignment.
*   **Интерактивность:** Автоматическое обновление при перезагрузке страницы.

### 8. Кнопка "Наверх" (`#scrollToTopBtn`)
*   **Описание:** Кнопка, которая появляется при прокрутке страницы вниз и позволяет быстро вернуться к началу страницы с плавной анимацией.
*   **Источник данных:** Позиция скролла окна (`window.scrollY`).
*   **Основные функции управления:** `window.addEventListener('scroll')`, `scrollToTopBtn.classList.add/remove('show')`, `scrollToTopBtn.addEventListener('click')`.
*   **Интерактивность:** Пользовательская прокрутка страницы, клик по кнопке.

### 9. Появление секций при прокрутке с IntersectionObserver
*   **Описание:** Элементы и секции (`.reveal-on-scroll`, `.animate-pop-in`) плавно появляются (становятся видимыми и/или смещаются) при входе в область видимости окна браузера.
*   **Источник данных:** Отсутствует (CSS-классы, управляемые JS).
*   **Основные функции управления:** `IntersectionObserver` API для отслеживания видимости элементов.
*   **Интерактивность:** Пользовательская прокрутка страницы.

### 10. Форма обратной связи с LocalStorage (`.contact-form`)
*   **Описание:** Форма для отправки сообщений, которая автоматически сохраняет введенные пользователем данные (имя, email, сообщение) в `localStorage`, чтобы они не терялись при перезагрузке страницы. Данные очищаются после успешной отправки формы.
*   **Источник данных:** Введенные пользователем данные, `localStorage`.
*   **Основные функции управления:**
    *   `loadFormData()`: загружает данные из `localStorage`.
    *   `saveFormData()`: сохраняет данные в `localStorage` при изменении поля.
    *   `clearFormData()`: удаляет данные из `localStorage`.
    *   `contactForm.addEventListener('submit')`: обрабатывает отправку формы.
*   **Интерактивность:** Ввод данных в поля формы, отправка формы.

### 11. Логика курсов и корзины (`#coursesGrid`, `#purchaseModal`)
*   **Описание:** Динамически отображает список курсов, загруженных из внешнего JSON-файла. Позволяет добавлять курсы в корзину, управлять количеством, удалять из корзины и симулировать процесс оформления покупки через модальное окно.
*   **Источник данных:** Внешний файл `data.json` (для информации о курсах), локальный массив `cart` (для содержимого корзины).
*   **Основные функции управления:**
    *   `fetchCoursesData()`: асинхронно загружает данные курсов.
    *   `renderCourses()`: динамически создает карточки курсов.
    *   `addToCart()`, `removeFromCart()`: управляют содержимым корзины.
    *   `updateCartUI()`: обновляет отображение корзины (счетчик, список, сумма).
    *   `openModal()`, `closeModal()`: управляют модальным окном корзины.
*   **Интерактивность:** Клик по кнопкам "Добавить в корзину", "Открыть корзину", "Удалить", "Оформить покупку".

### 12. Список названий курсов (`#courseTitlesList`)
*   **Описание:** Динамически формирует и отображает список всех доступных курсов по их названиям.
*   **Источник данных:** Массив `coursesData` (загруженный из `data.json`).
*   **Основная функция управления:** `displayCourseTitles()`.
*   **Интерактивность:** Автоматическое формирование списка после загрузки данных курсов.

### 13. Динамическая секция "Почему История Важна?" (`.about-section__grid`)
*   **Описание:** Секция, содержащая три карточки, объясняющие важность истории. Контент этих карточек (заголовки, описания, иконки) динамически генерируется из локального JavaScript-объекта.
*   **Источник данных:** Локальный JavaScript-объект `whyHistoryData` в `script.js`.
*   **Основная функция управления:** Цикл `for...in` для итерации по объекту `whyHistoryData` и создания соответствующих DOM-элементов (`div.card`).
*   **Интерактивность:** Автоматическое формирование контента при загрузке страницы, карточки имеют анимацию появления (`animate-pop-in`).

### 14. Слайдер отзывов (Swiper.js) (`#testimonialsSwiper`)
*   **Описание:** Интерактивный, сенсорный слайдер для демонстрации отзывов пользователей, использующий популярную библиотеку Swiper.js. Включает автоматическую прокрутку, навигационные стрелки и пагинацию.
*   **Источник данных:** Статическая HTML-структура слайдов внутри контейнера Swiper.
*   **Основные функции управления:** Инициализация экземпляра `new Swiper()`.
*   **Интерактивность:** Пользовательские свайпы, клики по навигационным стрелкам, пагинации, а также автоматическая смена слайдов.