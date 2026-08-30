document.addEventListener("DOMContentLoaded", () => {
<<<<<<< HEAD
            function showToast(message, type = "info", duration = 3500) {
                let container = document.querySelector(".toast-container");
                if (!container) {
                    container = document.createElement("div");
                    container.className = "toast-container";
                    document.body.appendChild(container);
                }
=======

  function showToast(message, type = "info", duration = 3500) {
    let container = document.querySelector(".toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      document.body.appendChild(container);
    }
>>>>>>> f254df9b154396dfea6dccbcc5ad0bd83174fe05

                const toast = document.createElement("div");
                toast.className = `toast toast-${type}`;
                toast.textContent = message;
                container.appendChild(toast);

<<<<<<< HEAD
                requestAnimationFrame(() => toast.classList.add("toast-show"));

                const removeToast = () => {
                    toast.classList.remove("toast-show");
                    let cleanedUp = false;
=======

    requestAnimationFrame(() => {
      toast.classList.add("toast-show");
    });

    const removeToast = () => {
      toast.classList.remove("toast-show");
      const onEnd = () => {
        toast.remove();
        if (container.children.length === 0) {
          container.remove();
        }
      };
      toast.addEventListener("transitionend", onEnd, { once: true });
      setTimeout(onEnd, 400); 
    };
>>>>>>> f254df9b154396dfea6dccbcc5ad0bd83174fe05

                    const cleanup = () => {
                        if (cleanedUp) return;
                        cleanedUp = true;
                        toast.remove();
                        if (container.children.length === 0) container.remove();
                    };

<<<<<<< HEAD
                    toast.addEventListener("transitionend", cleanup, { once: true });
                    setTimeout(cleanup, 400);
                };
=======
  function showModal(title, bodyHtml) {
    let backdrop = document.querySelector(".modal-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "modal-backdrop";
      backdrop.innerHTML = `
        <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
          <button class="modal-close" aria-label="Close modal">&times;</button>
          <h3 class="modal-title" id="modalTitle"></h3>
          <div class="modal-body"></div>
        </div>
      `;
      document.body.appendChild(backdrop);
    }
>>>>>>> f254df9b154396dfea6dccbcc5ad0bd83174fe05

                setTimeout(removeToast, duration);
            }

            function showModal(title, bodyHtml) {
                let backdrop = document.querySelector(".modal-backdrop");
                if (!backdrop) {
                    backdrop = document.createElement("div");
                    backdrop.className = "modal-backdrop";
                    backdrop.innerHTML = `
                <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
                  <button class="modal-close" aria-label="Close modal">&times;</button>
                  <h3 class="modal-title" id="modalTitle"></h3>
                  <div class="modal-body"></div>
                </div>
            `;
                    document.body.appendChild(backdrop);
                }

                const titleEl = backdrop.querySelector(".modal-title");
                const bodyEl = backdrop.querySelector(".modal-body");
                const closeBtn = backdrop.querySelector(".modal-close");

                titleEl.textContent = title;
                bodyEl.innerHTML = bodyHtml;

                document.body.style.overflow = "hidden";
                backdrop.classList.add("active");

                const closeModal = () => {
                    backdrop.classList.remove("active");
                    document.body.style.overflow = "";
                    document.removeEventListener("keydown", onKeydown);
                    closeBtn.removeEventListener("click", closeModal);
                    backdrop.removeEventListener("click", onBackdropClick);
                };

                const onBackdropClick = (e) => {
                    if (e.target === backdrop) closeModal();
                };

<<<<<<< HEAD
                const onKeydown = (e) => {
                    if (e.key === "Escape" && backdrop.classList.contains("active")) {
                        closeModal();
                    }
                };

                closeBtn.addEventListener("click", closeModal);
                backdrop.addEventListener("click", onBackdropClick);
                document.addEventListener("keydown", onKeydown);
            }
=======
  const header = document.querySelector(".site-header");
  if (header) {
    const handleHeaderScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleHeaderScroll, { passive: true });
    handleHeaderScroll();
  }

  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav a");
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const isMatch =
      href === currentPath ||
      (currentPath === "" && href === "index.html") ||
      (currentPath === "index.html" && href === "index.html");
>>>>>>> f254df9b154396dfea6dccbcc5ad0bd83174fe05

            const header = document.querySelector(".site-header");
            if (header) {
                const handleHeaderScroll = () => {
                    header.classList.toggle("scrolled", window.scrollY > 40);
                };
                window.addEventListener("scroll", handleHeaderScroll, { passive: true });
                handleHeaderScroll();
            }

<<<<<<< HEAD
            const currentPath = window.location.pathname.split("/").pop() || "index.html";
            document.querySelectorAll(".nav a").forEach((link) => {
                const href = link.getAttribute("href");
                const isMatch = href === currentPath || (currentPath === "" && href === "index.html");
=======
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  let navBackdrop = document.querySelector(".nav-backdrop");
>>>>>>> f254df9b154396dfea6dccbcc5ad0bd83174fe05

                if (isMatch) {
                    link.classList.add(link.classList.contains("nav-cta") ? "active-cta" : "active");
                }
            });

            const toggle = document.querySelector(".nav-toggle");
            const nav = document.querySelector(".nav");
            if (toggle && nav) {
                let navBackdrop = document.querySelector(".nav-backdrop");
                if (!navBackdrop) {
                    navBackdrop = document.createElement("div");
                    navBackdrop.className = "nav-backdrop";
                    document.body.appendChild(navBackdrop);
                }

                const openNav = () => {
                    nav.classList.add("open");
                    navBackdrop.classList.add("open");
                    toggle.textContent = "✕";
                    toggle.setAttribute("aria-expanded", "true");
                    toggle.setAttribute("aria-label", "Close menu");
                };

                const closeNav = () => {
                    nav.classList.remove("open");
                    navBackdrop.classList.remove("open");
                    toggle.textContent = "☰";
                    toggle.setAttribute("aria-expanded", "false");
                    toggle.setAttribute("aria-label", "Open menu");
                };

                toggle.addEventListener("click", () => {
                    nav.classList.contains("open") ? closeNav() : openNav();
                });

                navBackdrop.addEventListener("click", closeNav);
                nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));
                document.addEventListener("keydown", (e) => {
                    if (e.key === "Escape" && nav.classList.contains("open")) closeNav();
                });
            }

            const heroScrollBtn = document.querySelector(".hero-scroll");
            if (heroScrollBtn) {
                heroScrollBtn.addEventListener("click", () => {
                    const targetSection = document.querySelector(".intro") || document.querySelector("main section:nth-of-type(2)");
                    if (targetSection) targetSection.scrollIntoView({ behavior: "smooth" });
                });
            }

<<<<<<< HEAD
            const filters = document.querySelectorAll(".filter");
            const menuItems = document.querySelectorAll(".menu-item");
            const menuSearchInput = document.getElementById("menuSearch");
            const clearMenuSearchBtn = document.getElementById("clearMenuSearch");
            const menuListContainer = document.querySelector(".menu-list");

            if (menuItems.length > 0) {
                let currentCategory = "all";
                let searchQuery = "";
=======
  const heroScrollBtn = document.querySelector(".hero-scroll");
  if (heroScrollBtn) {
    heroScrollBtn.addEventListener("click", () => {
      const targetSection =
        document.querySelector(".intro") ||
        document.querySelector("main section:nth-of-type(2)");
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  const filters = document.querySelectorAll(".filter");
  const menuItems = document.querySelectorAll(".menu-item");
  const menuSearchInput = document.getElementById("menuSearch");
  const clearMenuSearchBtn = document.getElementById("clearMenuSearch");
  const menuListContainer = document.querySelector(".menu-list");
>>>>>>> f254df9b154396dfea6dccbcc5ad0bd83174fe05

                const categoryCounts = { all: menuItems.length };
                menuItems.forEach((item) => {
                    const cat = item.dataset.category;
                    if (cat) categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
                });

<<<<<<< HEAD
                filters.forEach((filter) => {
                    const cat = filter.dataset.filter;
                    if (cat && categoryCounts[cat] !== undefined) {
                        const badge = document.createElement("span");
                        badge.className = "filter-badge";
                        badge.textContent = categoryCounts[cat];
                        filter.appendChild(badge);
                    }
                });
=======
    const categoryCounts = { all: menuItems.length };
    menuItems.forEach((item) => {
      const cat = item.dataset.category;
      if (cat) {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      }
    });
>>>>>>> f254df9b154396dfea6dccbcc5ad0bd83174fe05

                let noResultsEl = document.querySelector(".no-menu-results");
                if (!noResultsEl && menuListContainer) {
                    noResultsEl = document.createElement("div");
                    noResultsEl.className = "no-menu-results";
                    noResultsEl.style.display = "none";
                    noResultsEl.innerHTML = "<p>No dishes found matching your selection.</p>";
                    menuListContainer.appendChild(noResultsEl);
                }

<<<<<<< HEAD
                const filterMenuItems = () => {
                    let visibleCount = 0;
                    menuItems.forEach((item) => {
                        const matchesCategory = currentCategory === "all" || item.dataset.category === currentCategory;
                        const matchesSearch = !searchQuery || item.textContent.toLowerCase().includes(searchQuery);
=======
    let noResultsEl = document.querySelector(".no-menu-results");
    if (!noResultsEl && menuListContainer) {
      noResultsEl = document.createElement("div");
      noResultsEl.className = "no-menu-results";
      noResultsEl.style.display = "none";
      noResultsEl.innerHTML =
        "<p>No dishes found matching your selection.</p>";
      menuListContainer.appendChild(noResultsEl);
    }
>>>>>>> f254df9b154396dfea6dccbcc5ad0bd83174fe05

                        if (matchesCategory && matchesSearch) {
                            item.style.display = "flex";
                            visibleCount++;
                        } else {
                            item.style.display = "none";
                        }
                    });

                    if (noResultsEl) {
                        noResultsEl.style.display = visibleCount === 0 ? "block" : "none";
                    }
                };

                filters.forEach((filter) => {
                    filter.addEventListener("click", () => {
                        filters.forEach((btn) => btn.classList.remove("active"));
                        filter.classList.add("active");
                        currentCategory = filter.dataset.filter;
                        filterMenuItems();
                    });
                });

                if (menuSearchInput) {
                    menuSearchInput.addEventListener("input", (e) => {
                        searchQuery = e.target.value.trim().toLowerCase();
                        if (clearMenuSearchBtn) {
                            clearMenuSearchBtn.classList.toggle("visible", searchQuery.length > 0);
                        }
                        filterMenuItems();
                    });
                }

                if (clearMenuSearchBtn && menuSearchInput) {
                    clearMenuSearchBtn.addEventListener("click", () => {
                        menuSearchInput.value = "";
                        searchQuery = "";
                        clearMenuSearchBtn.classList.remove("visible");
                        filterMenuItems();
                    });
                }
            }

            document.querySelectorAll(".food-card, .menu-item").forEach((card) => {
                card.style.cursor = "pointer";
                card.addEventListener("click", () => {
                    const title = card.querySelector("h3") ? .textContent || "Dish Details";
                    const desc = card.querySelector("p") ? .textContent || "Prepared fresh daily with authentic ingredients.";
                    const price = card.querySelector("strong") ? .textContent || "";
                    const category = card.dataset.category || "Specialty";

<<<<<<< HEAD
                    const modalHtml = `
                <div class="dish-modal-content">
                  <div class="dish-modal-header">
                    <span class="dish-modal-badge">${category.toUpperCase()}</span>
                    <span class="dish-modal-price">${price}</span>
                  </div>
                  <p class="lead" style="font-size: 16px; margin: 16px 0;">${desc}</p>
                  <div class="modal-details">
                    <p><strong>Ingredients & Preparation:</strong> Handcrafted in-house with imported Italian flour, San Marzano tomatoes, and extra virgin olive oil.</p>
                    <p><strong>Dietary Info:</strong> Vegetarian options & gluten-free crust available upon request.</p>
                  </div>
                  <div style="margin-top: 24px; text-align: right;">
                    <a href="reservation.html" class="btn btn-primary">Reserve a table to try this ↗</a>
                  </div>
                </div>
            `;
                    showModal(title, modalHtml);
                });
            });
=======
  const foodCards = document.querySelectorAll(".food-card, .menu-item");
  foodCards.forEach((card) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      const title =
        card.querySelector("h3")?.textContent || "Dish Details";
      const desc =
        card.querySelector("p")?.textContent ||
        "Prepared fresh daily with authentic Italian ingredients.";
      const price =
        card.querySelector("strong")?.textContent || "";
      const category = card.dataset.category || "Specialty";
>>>>>>> f254df9b154396dfea6dccbcc5ad0bd83174fe05

            const dateInput = document.querySelector('input[type="date"]');
            if (dateInput) {
                const todayStr = new Date().toISOString().split("T")[0];
                dateInput.min = todayStr;

                const maxDate = new Date();
                maxDate.setDate(maxDate.getDate() + 90);
                dateInput.max = maxDate.toISOString().split("T")[0];
            }

<<<<<<< HEAD
            const reservationForm = document.getElementById("reservationForm");
            if (reservationForm) {
                const inputs = reservationForm.querySelectorAll("input, select, textarea");
                inputs.forEach((input) => {
                    input.addEventListener("input", () => input.classList.remove("invalid"));
                });

                reservationForm.addEventListener("submit", (e) => {
                            e.preventDefault();
                            const formData = new FormData(reservationForm);

                            const requiredFields = ["name", "email", "date", "time", "guests"];
                            let valid = true;
=======
  const dateInput = document.querySelector('input[type="date"]');
  if (dateInput) {
    const todayStr = new Date().toISOString().split("T")[0];
    dateInput.min = todayStr;

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 90);
    dateInput.max = maxDate.toISOString().split("T")[0];
  }

  const reservationForm = document.getElementById("reservationForm");
  if (reservationForm) {

    const inputs = reservationForm.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        input.classList.remove("invalid");
      });
    });
>>>>>>> f254df9b154396dfea6dccbcc5ad0bd83174fe05

                            requiredFields.forEach((field) => {
                                const inputEl = reservationForm.querySelector(`[name="${field}"]`);
                                const val = formData.get(field) ? .toString().trim();
                                if (!val) {
                                    inputEl ? .classList.add("invalid");
                                    valid = false;
                                }
                            });

                            if (!valid) {
                                showToast("Please fill in all required fields.", "error");
                                return;
                            }

                            const email = formData.get("email") ? .toString().trim();
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if (!emailRegex.test(email)) {
                                reservationForm.querySelector('[name="email"]') ? .classList.add("invalid");
                                showToast("Please provide a valid email address.", "error");
                                return;
                            }

<<<<<<< HEAD
                            const date = formData.get("date") ? .toString();
                            const dateParts = date.split("-");
                            const dateObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                            const formattedDate = dateObj.toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric"
                            });

                            const summaryHtml = `
                <p>Thank you, <strong>${formData.get("name")}</strong>! Your reservation request has been received.</p>
                <div class="modal-details">
                  <p><strong>Date:</strong> ${formattedDate}</p>
                  <p><strong>Time:</strong> ${formData.get("time")}</p>
                  <p><strong>Party Size:</strong> ${formData.get("guests")}</p>
                  <p><strong>Confirmation Sent To:</strong> ${email}</p>
                  ${formData.get("notes") ? `<p><strong>Special Notes:</strong> ${formData.get("notes")}</p>` : ""}
                </div>
                <p style="font-size: 12px; color: var(--muted); margin-bottom: 0;">We will email you shortly if any adjustments are needed.</p>
            `;
=======

      inputs.forEach((input) => input.classList.remove("invalid"));


      if (!name) {
        reservationForm.querySelector('[name="name"]')?.classList.add("invalid");
        valid = false;
      }
      if (!email) {
        reservationForm.querySelector('[name="email"]')?.classList.add("invalid");
        valid = false;
      }
      if (!date) {
        reservationForm.querySelector('[name="date"]')?.classList.add("invalid");
        valid = false;
      }
      if (!time) {
        reservationForm.querySelector('[name="time"]')?.classList.add("invalid");
        valid = false;
      }
      if (!guests) {
        reservationForm.querySelector('[name="guests"]')?.classList.add("invalid");
        valid = false;
      }
>>>>>>> f254df9b154396dfea6dccbcc5ad0bd83174fe05

            showModal("Table Reserved!", summaryHtml);
            showToast("Reservation request sent!", "success");

<<<<<<< HEAD
            reservationForm.reset();
            if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];
        });
=======

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        reservationForm.querySelector('[name="email"]')?.classList.add("invalid");
        showToast("Please provide a valid email address.", "error");
        return;
      }

     
      const dateParts = date.split("-");
      const dateObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      const formattedDate = dateObj.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      const summaryHtml = `
        <p>Thank you, <strong>${name}</strong>! Your reservation request has been received.</p>
        <div class="modal-details">
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Party Size:</strong> ${guests}</p>
          <p><strong>Confirmation Sent To:</strong> ${email}</p>
          ${notes ? `<p><strong>Special Notes:</strong> ${notes}</p>` : ""}
        </div>
        <p style="font-size: 12px; color: var(--muted); margin-bottom: 0;">We will email you shortly if any adjustments are needed.</p>
      `;

      showModal("Table Reserved!", summaryHtml);
      showToast("Reservation request sent!", "success");

      reservationForm.reset();
      if (dateInput) {
        const todayStr = new Date().toISOString().split("T")[0];
        dateInput.min = todayStr;
      }
    });
  }


  document.querySelectorAll("form:not(#reservationForm)").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const message = form.querySelector(".form-message");
      if (message) {
        message.textContent = "Thanks! Your message has been sent.";
      }
      showToast("Message sent successfully!", "success");
      form.reset();
    });
  });

 
  const revealElements = document.querySelectorAll(
    ".food-card, .menu-item, .story-grid > div, .intro-grid > div, .review-grid > blockquote, .gallery-photo"
  );

  if ("IntersectionObserver" in window && revealElements.length > 0) {
    revealElements.forEach((el) => el.classList.add("reveal"));

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-active");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  
  const statElements = document.querySelectorAll(".number-grid strong");
  if ("IntersectionObserver" in window && statElements.length > 0) {
    const animateStat = (el) => {
      const rawText = el.textContent.trim();
      const numberMatch = rawText.match(/\d+/);
      if (!numberMatch) return;

      const targetValue = parseInt(numberMatch[0], 10);
      const suffix = rawText.replace(numberMatch[0], "");
      const duration = 1500; // ms
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = progress * (2 - progress);
        const currentValue = Math.floor(easeProgress * targetValue);

        el.textContent = currentValue + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = targetValue + suffix;
        }
      };

      requestAnimationFrame(updateCounter);
    };

    const statObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateStat(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statElements.forEach((el) => statObserver.observe(el));
  }


  const backToTopBtn = document.createElement("button");
  backToTopBtn.id = "backToTop";
  backToTopBtn.setAttribute("aria-label", "Scroll back to top");
  backToTopBtn.innerHTML = "&#8593;";
  document.body.appendChild(backToTopBtn);

  const toggleBackToTop = () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
>>>>>>> f254df9b154396dfea6dccbcc5ad0bd83174fe05
    }

    document.querySelectorAll("form:not(#reservationForm)").forEach((form) => {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const message = form.querySelector(".form-message");
            if (message) message.textContent = "Thanks! Your message has been sent.";
            showToast("Message sent successfully!", "success");
            form.reset();
        });
    });

    const revealElements = document.querySelectorAll(".food-card, .menu-item, .story-grid > div, .intro-grid > div, .review-grid > blockquote, .gallery-photo");
    if ("IntersectionObserver" in window && revealElements.length > 0) {
        revealElements.forEach((el) => el.classList.add("reveal"));

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("reveal-active");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });

        revealElements.forEach((el) => observer.observe(el));
    }

    const statElements = document.querySelectorAll(".number-grid strong");
    if ("IntersectionObserver" in window && statElements.length > 0) {
        const animateStat = (el) => {
            const rawText = el.textContent.trim();
            const numberMatch = rawText.match(/\d+/);
            if (!numberMatch) return;

            const targetValue = parseInt(numberMatch[0], 10);
            const suffix = rawText.replace(numberMatch[0], "");
            const duration = 1500;
            const startTime = performance.now();

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = progress * (2 - progress);
                const currentValue = Math.floor(easeProgress * targetValue);

                el.textContent = currentValue + suffix;
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    el.textContent = targetValue + suffix;
                }
            };

            requestAnimationFrame(updateCounter);
        };

        const statObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateStat(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statElements.forEach((el) => statObserver.observe(el));
    }

    const backToTopBtn = document.createElement("button");
    backToTopBtn.id = "backToTop";
    backToTopBtn.setAttribute("aria-label", "Scroll back to top");
    backToTopBtn.innerHTML = "&#8593;";
    document.body.appendChild(backToTopBtn);

    window.addEventListener("scroll", () => {
        backToTopBtn.classList.toggle("visible", window.scrollY > 300);
    }, { passive: true });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});