// Global variables
let currentUser = null
let currentRating = 0
let ymaps // Declare the ymaps variable

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

// Initialize Application
function initializeApp() {
  setupEventListeners()
  setupAccordions()
  setupModals()
  setupRating()
  initializeMap()

  // Check if we're on cabinet page
  if (window.location.pathname.includes("cabinet.html")) {
    initializeCabinet()
  }

  // Add scroll animations
  setupScrollAnimations()
}

// Event Listeners Setup
function setupEventListeners() {
  // Header buttons
  const callBtn = document.getElementById("callBtn")
  const chatBtn = document.getElementById("chatBtn")
  const loginBtn = document.getElementById("loginBtn")
  const heroContactBtn = document.getElementById("heroContactBtn")

  if (callBtn) callBtn.addEventListener("click", () => showContactModal("call"))
  if (chatBtn) chatBtn.addEventListener("click", () => showContactModal("chat"))
  if (loginBtn) loginBtn.addEventListener("click", showAuthModal)
  if (heroContactBtn) heroContactBtn.addEventListener("click", () => showContactModal("question"))

  // Service buttons
  const serviceButtons = document.querySelectorAll(".btn-service")
  serviceButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const service = e.target.getAttribute("data-service")
      showServiceModal(service)
    })
  })

  // Forms
  const contactForm = document.getElementById("contactForm")
  const serviceForm = document.getElementById("serviceForm")
  const authForm = document.getElementById("authForm")
  const reviewForm = document.getElementById("reviewForm")

  if (contactForm) contactForm.addEventListener("submit", handleContactForm)
  if (serviceForm) serviceForm.addEventListener("submit", handleServiceForm)
  if (authForm) authForm.addEventListener("submit", handleAuthForm)
  if (reviewForm) reviewForm.addEventListener("submit", handleReviewForm)

  // City selector
  const citySelect = document.getElementById("citySelect")
  if (citySelect) citySelect.addEventListener("change", handleCityChange)

  // Footer links
  const privacyLink = document.getElementById("privacyLink")
  const agreementLink = document.getElementById("agreementLink")
  const termsLink = document.getElementById("termsLink")

  if (privacyLink)
    privacyLink.addEventListener("click", (e) => {
      e.preventDefault()
      showInfoModal("privacy")
    })
  if (agreementLink)
    agreementLink.addEventListener("click", (e) => {
      e.preventDefault()
      showInfoModal("agreement")
    })
  if (termsLink)
    termsLink.addEventListener("click", (e) => {
      e.preventDefault()
      showInfoModal("terms")
    })
}

// Accordion Setup
function setupAccordions() {
  const accordionHeaders = document.querySelectorAll(".accordion-header")

  accordionHeaders.forEach((header) => {
    header.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target")
      const accordionItem = this.parentElement
      const content = document.getElementById(targetId)

      // Close other accordion items in the same accordion
      const accordion = accordionItem.parentElement
      const otherItems = accordion.querySelectorAll(".accordion-item")
      otherItems.forEach((item) => {
        if (item !== accordionItem) {
          item.classList.remove("active")
        }
      })

      // Toggle current item
      accordionItem.classList.toggle("active")
    })
  })
}

// Modal Setup
function setupModals() {
  const modals = document.querySelectorAll(".modal")
  const closeButtons = document.querySelectorAll(".close")

  // Close modal when clicking close button
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const modal = this.closest(".modal")
      closeModal(modal)
    })
  })

  // Close modal when clicking outside
  modals.forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeModal(this)
      }
    })
  })

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const openModal = document.querySelector('.modal[style*="block"]')
      if (openModal) {
        closeModal(openModal)
      }
    }
  })
}

// Rating Setup
function setupRating() {
  const stars = document.querySelectorAll(".star")

  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      currentRating = index + 1
      updateStarDisplay()
    })

    star.addEventListener("mouseenter", () => {
      highlightStars(index + 1)
    })
  })

  const rating = document.querySelector(".rating")
  if (rating) {
    rating.addEventListener("mouseleave", () => {
      updateStarDisplay()
    })
  }
}

function updateStarDisplay() {
  const stars = document.querySelectorAll(".star")
  stars.forEach((star, index) => {
    if (index < currentRating) {
      star.classList.add("active")
    } else {
      star.classList.remove("active")
    }
  })
}

function highlightStars(count) {
  const stars = document.querySelectorAll(".star")
  stars.forEach((star, index) => {
    if (index < count) {
      star.style.opacity = "1"
      star.style.transform = "scale(1.1)"
    } else {
      star.style.opacity = "0.3"
      star.style.transform = "scale(1)"
    }
  })
}

// Map Initialization
function initializeMap() {
  if (typeof ymaps !== "undefined") {
    ymaps.ready(() => {
      const map = new ymaps.Map("map", {
        center: [56.018, 92.8932], // Красноярск, Дачная 37
        zoom: 16,
        controls: ["zoomControl", "fullscreenControl"],
      })

      const placemark = new ymaps.Placemark(
        [56.018, 92.8932],
        {
          balloonContent: "<strong>ИКИТ СИЛА</strong><br>г. Красноярск, ул. Дачная, 37<br>Тел: +7 (391) 123-45-67",
        },
        {
          preset: "islands#redDotIcon",
        },
      )

      map.geoObjects.add(placemark)
    })
  }
}

// Cabinet Initialization
function initializeCabinet() {
  const navItems = document.querySelectorAll(".nav-item")
  const sections = document.querySelectorAll(".cabinet-section")
  const uploadBtn = document.getElementById("uploadBtn")
  const logoutBtn = document.getElementById("logoutBtn")

  // Navigation
  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault()
      const targetSection = this.getAttribute("data-section")
      showCabinetSection(targetSection)

      // Update active nav item
      navItems.forEach((nav) => nav.classList.remove("active"))
      this.classList.add("active")
    })
  })

  // Upload button
  if (uploadBtn) {
    uploadBtn.addEventListener("click", () => {
      showModal(document.getElementById("uploadModal"))
    })
  }

  // Logout button
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout)
  }

  // Cabinet forms
  const messageForm = document.getElementById("messageForm")
  const profileForm = document.getElementById("profileForm")
  const uploadForm = document.getElementById("uploadForm")

  if (messageForm) messageForm.addEventListener("submit", handleMessageForm)
  if (profileForm) profileForm.addEventListener("submit", handleProfileForm)
  if (uploadForm) uploadForm.addEventListener("submit", handleUploadForm)
}

function showCabinetSection(sectionId) {
  const sections = document.querySelectorAll(".cabinet-section")
  sections.forEach((section) => {
    section.classList.remove("active")
  })

  const targetSection = document.getElementById(sectionId)
  if (targetSection) {
    targetSection.classList.add("active")
  }
}

// Scroll Animations
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe elements for animation
  const animatedElements = document.querySelectorAll(".service-card, .stat-card, .accordion-item")
  animatedElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })
}

// Modal Functions
function showModal(modal) {
  modal.style.display = "block"
  document.body.style.overflow = "hidden"
}

function closeModal(modal) {
  modal.style.display = "none"
  document.body.style.overflow = "auto"
}

function showContactModal(type) {
  const modal = document.getElementById("contactModal")
  const title = modal.querySelector("h2")

  switch (type) {
    case "call":
      title.textContent = "Заказать звонок"
      break
    case "chat":
      title.textContent = "Написать сообщение"
      break
    case "question":
      title.textContent = "Задать вопрос"
      break
  }

  showModal(modal)
}

function showServiceModal(service) {
  const modal = document.getElementById("serviceModal")
  const serviceInput = document.getElementById("serviceType")

  const serviceNames = {
    accounting: "Бухгалтерский учет",
    salary: "Расчет заработной платы",
    tax: "Налоговый учет",
    other: "Ведение любых учетов",
  }

  serviceInput.value = serviceNames[service] || "Консультация"
  showModal(modal)
}

function showAuthModal() {
  const modal = document.getElementById("authModal")
  showModal(modal)
}

function showInfoModal(type) {
  // Create dynamic modal for info pages
  const modal = document.createElement("div")
  modal.className = "modal"
  modal.style.display = "block"

  const content = document.createElement("div")
  content.className = "modal-content"

  const close = document.createElement("span")
  close.className = "close"
  close.innerHTML = "&times;"
  close.onclick = () => {
    document.body.removeChild(modal)
    document.body.style.overflow = "auto"
  }

  const title = document.createElement("h2")
  const text = document.createElement("div")

  switch (type) {
    case "privacy":
      title.textContent = "Политика конфиденциальности"
      text.innerHTML = `
                <p>Настоящая Политика конфиденциальности определяет порядок обработки персональных данных пользователей сайта ИКИТ СИЛА.</p>
                <h3>1. Общие положения</h3>
                <p>Мы обязуемся защищать конфиденциальность персональных данных наших клиентов в соответствии с ФЗ-152.</p>
                <h3>2. Сбор информации</h3>
                <p>Мы собираем только необходимую информацию для предоставления качественных услуг.</p>
                <h3>3. Использование данных</h3>
                <p>Персональные данные используются исключительно для связи с клиентами и предоставления услуг.</p>
            `
      break
    case "agreement":
      title.textContent = "Согласие на обработку персональных данных"
      text.innerHTML = `
                <p>Заполняя формы на данном сайте, вы даете согласие на обработку ваших персональных данных.</p>
                <h3>Цели обработки:</h3>
                <ul>
                    <li>Связь с клиентами</li>
                    <li>Предоставление услуг</li>
                    <li>Информирование о новых услугах</li>
                </ul>
                <p>Вы можете отозвать согласие в любое время, направив письменное уведомление.</p>
            `
      break
    case "terms":
      title.textContent = "Пользовательское соглашение"
      text.innerHTML = `
                <p>Настоящее соглашение регулирует отношения между пользователем и компанией ИКИТ СИЛА.</p>
                <h3>1. Предмет соглашения</h3>
                <p>Компания предоставляет информацию о своих услугах через данный сайт.</p>
                <h3>2. Права и обязанности</h3>
                <p>Пользователь обязуется предоставлять достоверную информацию при заполнении форм.</p>
            `
      break
  }

  content.appendChild(close)
  content.appendChild(title)
  content.appendChild(text)
  modal.appendChild(content)
  document.body.appendChild(modal)
  document.body.style.overflow = "hidden"
}

// Form Handlers
function handleContactForm(e) {
  e.preventDefault()
  const formData = new FormData(e.target)

  // Simulate form submission
  showLoading(e.target)

  setTimeout(() => {
    hideLoading(e.target)
    showMessage("Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.", "success")
    e.target.reset()
    closeModal(document.getElementById("contactModal"))
  }, 2000)
}

function handleServiceForm(e) {
  e.preventDefault()
  const formData = new FormData(e.target)

  showLoading(e.target)

  setTimeout(() => {
    hideLoading(e.target)
    showMessage("Заявка принята! Наш менеджер свяжется с вами в течение часа.", "success")
    e.target.reset()
    closeModal(document.getElementById("serviceModal"))
  }, 2000)
}

function handleAuthForm(e) {
  e.preventDefault()
  const formData = new FormData(e.target)

  showLoading(e.target)

  setTimeout(() => {
    hideLoading(e.target)
    // Simulate successful login
    currentUser = {
      name: "Иван Петрович",
      email: formData.get("email"),
    }

    showMessage("Вход выполнен успешно! Перенаправляем в личный кабинет...", "success")

    setTimeout(() => {
      window.location.href = "cabinet.html"
    }, 1500)
  }, 2000)
}

function handleReviewForm(e) {
  e.preventDefault()
  const formData = new FormData(e.target)

  if (currentRating === 0) {
    showMessage("Пожалуйста, поставьте оценку", "error")
    return
  }

  showLoading(e.target)

  setTimeout(() => {
    hideLoading(e.target)
    showMessage("Спасибо за ваш отзыв! Он будет опубликован после модерации.", "success")
    e.target.reset()
    currentRating = 0
    updateStarDisplay()
  }, 2000)
}

function handleMessageForm(e) {
  e.preventDefault()
  const formData = new FormData(e.target)
  const messageText = formData.get("message")

  if (!messageText.trim()) return

  // Add message to chat
  const messagesContainer = document.querySelector(".messages-container")
  const messageItem = document.createElement("div")
  messageItem.className = "message-item sent"
  messageItem.innerHTML = `
        <div class="message-header">
            <strong>Вы</strong>
            <span class="message-date">${new Date().toLocaleString("ru-RU")}</span>
        </div>
        <div class="message-content">
            <p>${messageText}</p>
        </div>
    `

  messagesContainer.appendChild(messageItem)
  messagesContainer.scrollTop = messagesContainer.scrollHeight

  e.target.reset()
  showMessage("Сообщение отправлено", "success")
}

function handleProfileForm(e) {
  e.preventDefault()
  showLoading(e.target)

  setTimeout(() => {
    hideLoading(e.target)
    showMessage("Профиль обновлен успешно!", "success")
  }, 1500)
}

function handleUploadForm(e) {
  e.preventDefault()
  const formData = new FormData(e.target)
  const file = formData.get("file")

  if (!file || file.size === 0) {
    showMessage("Выберите файл для загрузки", "error")
    return
  }

  showLoading(e.target)

  setTimeout(() => {
    hideLoading(e.target)
    showMessage("Файл успешно загружен!", "success")
    e.target.reset()
    closeModal(document.getElementById("uploadModal"))

    // Add document to list
    const documentsList = document.querySelector(".documents-list")
    const documentItem = document.createElement("div")
    documentItem.className = "document-item"
    documentItem.innerHTML = `
            <div class="document-icon">📄</div>
            <div class="document-info">
                <h4>${file.name}</h4>
                <span class="document-date">${new Date().toLocaleDateString("ru-RU")}</span>
            </div>
            <div class="document-actions">
                <button class="btn-secondary">Скачать</button>
            </div>
        `

    documentsList.insertBefore(documentItem, documentsList.firstChild)
  }, 2000)
}

function handleCityChange(e) {
  const selectedCity = e.target.value
  showMessage(`Выбран город: ${e.target.options[e.target.selectedIndex].text}`, "success")

  // Update contact information based on city
  // This is a placeholder for real functionality
}

function handleLogout() {
  if (confirm("Вы уверены, что хотите выйти?")) {
    currentUser = null
    showMessage("Вы вышли из системы", "success")
    setTimeout(() => {
      window.location.href = "index.html"
    }, 1500)
  }
}

// Utility Functions
function showLoading(form) {
  const submitBtn = form.querySelector('button[type="submit"]')
  submitBtn.disabled = true
  submitBtn.textContent = "Отправка..."
  form.classList.add("loading")
}

function hideLoading(form) {
  const submitBtn = form.querySelector('button[type="submit"]')
  submitBtn.disabled = false

  // Restore original button text
  const originalTexts = {
    contactForm: "Отправить",
    serviceForm: "Отправить заявку",
    authForm: "Войти",
    reviewForm: "Отправить отзыв",
    messageForm: "Отправить",
    profileForm: "Сохранить изменения",
    uploadForm: "Загрузить",
  }

  submitBtn.textContent = originalTexts[form.id] || "Отправить"
  form.classList.remove("loading")
}

function showMessage(text, type) {
  const message = document.createElement("div")
  message.className = `message-${type}`
  message.textContent = text
  message.style.position = "fixed"
  message.style.top = "20px"
  message.style.right = "20px"
  message.style.zIndex = "3000"
  message.style.padding = "1rem 2rem"
  message.style.borderRadius = "4px"
  message.style.fontWeight = "bold"
  message.style.animation = "slideIn 0.3s ease"

  document.body.appendChild(message)

  setTimeout(() => {
    message.style.animation = "fadeOut 0.3s ease"
    setTimeout(() => {
      if (document.body.contains(message)) {
        document.body.removeChild(message)
      }
    }, 300)
  }, 3000)
}

// Add fadeOut animation to CSS
const style = document.createElement("style")
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100%); }
    }
`
document.head.appendChild(style)

// Smooth scroll for anchor links
document.addEventListener("click", (e) => {
  if (e.target.tagName === "A" && e.target.getAttribute("href").startsWith("#")) {
    e.preventDefault()
    const targetId = e.target.getAttribute("href").substring(1)
    const targetElement = document.getElementById(targetId)

    if (targetElement) {
      const headerHeight = document.querySelector(".header").offsetHeight
      const targetPosition = targetElement.offsetTop - headerHeight - 20

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    }
  }
})

// Header scroll effect
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header")
  if (window.scrollY > 100) {
    header.style.background = "rgba(255, 255, 255, 0.95)"
    header.style.backdropFilter = "blur(10px)"
  } else {
    header.style.background = "#fff"
    header.style.backdropFilter = "none"
  }
})
