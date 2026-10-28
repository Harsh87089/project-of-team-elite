/**
 * MedToken - Local Clinic Doctor Appointment and Token Booking System
 * Script Logic & Interactive Features
 * CSE326 Internet Programming Project - Lovely Professional University
 * Authors: Team Elite (Rohit, Harsh, Abhay)
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 0. Dark / Light Clinical Theme Toggle (Unit III)
  // ==========================================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const savedTheme = localStorage.getItem('medtoken_theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'light');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeIcon) {
      if (theme === 'dark') {
        themeIcon.className = 'fa-solid fa-sun';
      } else {
        themeIcon.className = 'fa-solid fa-moon';
      }
    }
    localStorage.setItem('medtoken_theme', theme);
  }

  applyTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(
        newTheme === 'dark' ? 'Clinical Dark Mode Enabled' : 'Clinical Light Mode Enabled',
        'info'
      );
    });
  }

  // ==========================================
  // 0.1 Responsive Mobile Navigation Drawer
  // ==========================================
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mainNav = document.getElementById('mainNav');

  if (hamburgerBtn && mainNav) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = hamburgerBtn.classList.toggle('active');
      mainNav.classList.toggle('active');
      hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when clicking on any navigation item
    mainNav.querySelectorAll('.nav-item').forEach((item) => {
      item.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        mainNav.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        hamburgerBtn.classList.remove('active');
        mainNav.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ==========================================
  // 1. Dynamic Date Calculation for Date Tabs
  // ==========================================
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);

  const formatDateShort = (d) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${months[d.getMonth()]}`;
  };

  const tabDateToday = document.getElementById('tabDateToday');
  const tabDateTomorrow = document.getElementById('tabDateTomorrow');
  const tabDateDayAfter = document.getElementById('tabDateDayAfter');

  if (tabDateToday) tabDateToday.textContent = formatDateShort(today);
  if (tabDateTomorrow) tabDateTomorrow.textContent = formatDateShort(tomorrow);
  if (tabDateDayAfter) tabDateDayAfter.textContent = formatDateShort(dayAfter);

  let selectedDayLabel = `Today (${formatDateShort(today)})`;

  // ==========================================
  // 2. Comprehensive Directory Search, Filter & Sort Engine
  // (Module: feature-directory-filters - Lead: Rohit Kumar)
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const doctorCards = Array.from(document.querySelectorAll('.doctor-card'));
  const doctorGrid = document.getElementById('doctorGrid');
  const doctorSearchInput = document.getElementById('doctorSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const doctorSortSelect = document.getElementById('doctorSortSelect');
  const doctorResultsCount = document.getElementById('doctorResultsCount');
  const noDoctorsMsg = document.getElementById('noDoctorsMsg');
  const symptomChips = document.querySelectorAll('.symptom-chip');
  const resetDirectoryFiltersBtn = document.getElementById('resetDirectoryFiltersBtn');

  let activeSpecialty = 'all';

  function filterAndSortDoctors() {
    const query = (doctorSearchInput ? doctorSearchInput.value : '').trim().toLowerCase();
    const sortMode = doctorSortSelect ? doctorSortSelect.value : 'default';

    // Toggle clear search button visibility
    if (clearSearchBtn) {
      clearSearchBtn.style.display = query.length > 0 ? 'flex' : 'none';
    }

    let visibleCount = 0;

    // Filter matching cards
    doctorCards.forEach((card) => {
      const cardSpecialty = (card.getAttribute('data-specialty') || '').toLowerCase();
      const cardName = (card.getAttribute('data-name') || '').toLowerCase();
      const cardSymptoms = (card.getAttribute('data-symptoms') || '').toLowerCase();
      const cardText = card.textContent.toLowerCase();

      const matchesSpecialty = activeSpecialty === 'all' || cardSpecialty === activeSpecialty;
      const matchesQuery = !query || cardName.includes(query) || cardSpecialty.includes(query) || cardSymptoms.includes(query) || cardText.includes(query);

      if (matchesSpecialty && matchesQuery) {
        card.style.display = 'flex';
        card.style.animation = 'fadeInCard 0.35s ease forwards';
        visibleCount += 1;
      } else {
        card.style.display = 'none';
      }
    });

    // Update results counter badge
    if (doctorResultsCount) {
      doctorResultsCount.innerHTML = `<i class="fa-solid fa-user-doctor"></i> Showing ${visibleCount} of ${doctorCards.length} Doctors`;
    }

    // Toggle empty state placeholder
    if (noDoctorsMsg) {
      noDoctorsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    // Apply Sorting on visible cards within doctorGrid
    if (doctorGrid && visibleCount > 0 && sortMode !== 'default') {
      const sortedCards = [...doctorCards].sort((a, b) => {
        const feeA = parseInt(a.getAttribute('data-fee') || '0', 10);
        const feeB = parseInt(b.getAttribute('data-fee') || '0', 10);
        const ratingA = parseFloat(a.getAttribute('data-rating') || '0');
        const ratingB = parseFloat(b.getAttribute('data-rating') || '0');
        const expA = parseInt(a.getAttribute('data-experience') || '0', 10);
        const expB = parseInt(b.getAttribute('data-experience') || '0', 10);

        if (sortMode === 'fee-asc') return feeA - feeB;
        if (sortMode === 'fee-desc') return feeB - feeA;
        if (sortMode === 'rating-desc') return ratingB - ratingA;
        if (sortMode === 'exp-desc') return expB - expA;
        return 0;
      });

      sortedCards.forEach((card) => doctorGrid.appendChild(card));
    }
  }

  // Filter Buttons Click
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeSpecialty = btn.getAttribute('data-specialty');
      filterAndSortDoctors();
    });
  });

  // Live Search Input with Instant Filtering
  if (doctorSearchInput) {
    doctorSearchInput.addEventListener('input', () => {
      filterAndSortDoctors();
    });
  }

  // Clear Search Query
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (doctorSearchInput) doctorSearchInput.value = '';
      filterAndSortDoctors();
      if (doctorSearchInput) doctorSearchInput.focus();
    });
  }

  // Quick Symptom Chips Click
  symptomChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const symptomQuery = chip.getAttribute('data-query');
      if (doctorSearchInput) {
        doctorSearchInput.value = symptomQuery;
        filterAndSortDoctors();
        showToast(`Filtered doctors for symptom: "${symptomQuery}"`, 'info');
      }
    });
  });

  // Sort Selection Change
  if (doctorSortSelect) {
    doctorSortSelect.addEventListener('change', () => {
      filterAndSortDoctors();
      const selectedText = doctorSortSelect.options[doctorSortSelect.selectedIndex].text;
      showToast(`Sorted by: ${selectedText}`, 'info');
    });
  }

  // Reset Filters Button
  if (resetDirectoryFiltersBtn) {
    resetDirectoryFiltersBtn.addEventListener('click', () => {
      if (doctorSearchInput) doctorSearchInput.value = '';
      if (doctorSortSelect) doctorSortSelect.value = 'default';
      activeSpecialty = 'all';
      filterButtons.forEach((b) => {
        b.classList.toggle('active', b.getAttribute('data-specialty') === 'all');
      });
      filterAndSortDoctors();
      showToast('Doctor directory filters reset', 'info');
    });
  }

  // ==========================================
  // 3. Doctor Selection Sync & Banner Updates
  // ==========================================
  const doctorSelect = document.getElementById('doctorSelect');
  const bannerDocName = document.getElementById('bannerDocName');
  const bannerDocSpec = document.getElementById('bannerDocSpec');
  const bannerDocFee = document.getElementById('bannerDocFee');
  const selectDocBtns = document.querySelectorAll('.select-doc-btn');

  function updateDoctorBanner(name, specialty, fee, room) {
    if (bannerDocName) bannerDocName.textContent = name;
    if (bannerDocSpec) bannerDocSpec.textContent = `${specialty} • ${room}`;
    if (bannerDocFee) bannerDocFee.textContent = `₹${fee}`;
  }

  // Handle "Select Doctor" button clicks on Doctor Cards
  selectDocBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name');
      const specialty = btn.getAttribute('data-specialty');
      const fee = btn.getAttribute('data-fee');
      const room = btn.getAttribute('data-room');

      // Update dropdown selection
      if (doctorSelect) {
        doctorSelect.value = name;
      }

      // Update preview banner
      updateDoctorBanner(name, specialty, fee, room);

      // Smooth scroll to booking section
      const bookingSection = document.getElementById('booking');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }

      showToast(`Selected ${name} (${specialty}). Choose your preferred time slot!`, 'success');
    });
  });

  // Handle direct changes in Doctor Dropdown
  if (doctorSelect) {
    doctorSelect.addEventListener('change', () => {
      const selectedOption = doctorSelect.options[doctorSelect.selectedIndex];
      const name = selectedOption.value;
      const specialty = selectedOption.getAttribute('data-specialty') || 'Specialist';
      const fee = selectedOption.getAttribute('data-fee') || '500';
      const room = selectedOption.getAttribute('data-room') || 'Room 101';

      updateDoctorBanner(name, specialty, fee, room);
      showToast(`Doctor updated: ${name}`, 'success');
    });
  }

  // ==========================================
  // 4. Date Tabs Selection
  // ==========================================
  const dateTabs = document.querySelectorAll('.date-tab');
  dateTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      dateTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const dateType = tab.getAttribute('data-date');
      if (dateType === 'today') {
        selectedDayLabel = `Today (${formatDateShort(today)})`;
      } else if (dateType === 'tomorrow') {
        selectedDayLabel = `Tomorrow (${formatDateShort(tomorrow)})`;
      } else {
        selectedDayLabel = `Day After (${formatDateShort(dayAfter)})`;
      }

      // Clear current slot selection to avoid stale slot
      clearSelectedSlot();
      showToast(`Switched date to ${selectedDayLabel}. Select your time slot.`, 'info');
    });
  });

  // ==========================================
  // 5. Interactive Time Slot Grid
  // ==========================================
  const slotBoxes = document.querySelectorAll('.slot-box.available');
  const selectedSlotInput = document.getElementById('selectedSlotInput');
  const slotFeedbackText = document.getElementById('slotFeedbackText');

  function clearSelectedSlot() {
    document.querySelectorAll('.slot-box').forEach((slot) => {
      slot.classList.remove('selected');
    });
    if (selectedSlotInput) selectedSlotInput.value = '';
    if (slotFeedbackText) {
      slotFeedbackText.textContent = `Please choose a time slot for ${selectedDayLabel}.`;
    }
  }

  slotBoxes.forEach((slot) => {
    slot.addEventListener('click', () => {
      // Remove selected class from all slots
      document.querySelectorAll('.slot-box').forEach((s) => s.classList.remove('selected'));
      
      // Select clicked slot
      slot.classList.add('selected');
      const time = slot.getAttribute('data-time');

      if (selectedSlotInput) {
        selectedSlotInput.value = `${time} [${selectedDayLabel}]`;
      }

      if (slotFeedbackText) {
        slotFeedbackText.innerHTML = `<strong>Selected Slot:</strong> ${time} on ${selectedDayLabel}`;
      }

      showToast(`Slot confirmed: ${time} on ${selectedDayLabel}`, 'success');
    });
  });

  // ==========================================
  // 6. Appointment Form & Digital Token Modal
  // ==========================================
  const appointmentForm = document.getElementById('appointmentForm');
  const tokenModal = document.getElementById('tokenModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const bookAnotherBtn = document.getElementById('bookAnotherBtn');
  const printTokenBtn = document.getElementById('printTokenBtn');

  let currentTokenCount = 108;

  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('patientName');
      const ageInput = document.getElementById('patientAge');
      const genderInput = document.getElementById('patientGender');
      const phoneInput = document.getElementById('patientPhone');
      const slotInput = document.getElementById('selectedSlotInput');
      const isEmergency = document.getElementById('isEmergency');

      // Validation Checks
      appointmentForm.classList.add('was-validated');

      if (!slotInput.value.trim()) {
        showToast('Please select a consultation time slot from the left grid.', 'warning');
        slotInput.focus();
        return;
      }

      if (!nameInput.checkValidity()) {
        showToast('Please enter a valid patient full name (at least 3 characters).', 'warning');
        nameInput.focus();
        return;
      }

      if (!ageInput.checkValidity()) {
        showToast('Please enter a valid patient age.', 'warning');
        ageInput.focus();
        return;
      }

      if (!genderInput.value) {
        showToast('Please select patient gender.', 'warning');
        genderInput.focus();
        return;
      }

      const phonePattern = /^[0-9]{10}$/;
      if (!phonePattern.test(phoneInput.value.trim())) {
        showToast('Please enter a valid 10-digit mobile phone number.', 'warning');
        phoneInput.focus();
        return;
      }

      // Generate Token Data
      currentTokenCount += 1;
      const tokenNumberStr = `#TK-${currentTokenCount}`;
      const randomUid = `MED-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const selectedDoctor = doctorSelect.value;
      const selectedOption = doctorSelect.options[doctorSelect.selectedIndex];
      const specialty = selectedOption.getAttribute('data-specialty') || 'General Medicine';
      const fee = selectedOption.getAttribute('data-fee') || '500';
      const room = selectedOption.getAttribute('data-room') || 'Room 102';

      // Populate Modal Fields
      document.getElementById('modalTokenNum').textContent = tokenNumberStr;
      document.getElementById('modalPatientName').textContent = nameInput.value.trim();
      document.getElementById('modalAgeGender').textContent = `${ageInput.value} Yrs / ${genderInput.value}`;
      document.getElementById('modalDoctor').textContent = selectedDoctor;
      document.getElementById('modalSpecialty').textContent = specialty;
      document.getElementById('modalRoom').textContent = room;
      document.getElementById('modalFee').textContent = `₹${fee} (Pay at desk)`;
      document.getElementById('modalDate').textContent = selectedDayLabel;
      document.getElementById('modalEstTime').textContent = slotInput.value.split('[')[0].trim();
      document.getElementById('modalUid').textContent = randomUid;

      const priorityBadge = document.getElementById('tokenPriorityBadge');
      const modalQueuePos = document.getElementById('modalQueuePos');

      if (isEmergency && isEmergency.checked) {
        priorityBadge.textContent = 'PRIORITY / URGENT';
        priorityBadge.className = 'pass-status-pill priority';
        modalQueuePos.textContent = 'Immediate Priority Queue';
        modalQueuePos.className = 'pass-val text-danger';
      } else {
        priorityBadge.textContent = 'CONFIRMED';
        priorityBadge.className = 'pass-status-pill';
        modalQueuePos.textContent = `${Math.floor(Math.random() * 4) + 2}nd in Line`;
        modalQueuePos.className = 'pass-val text-success';
      }

      // Save Token Record to LocalStorage
      const tokenRecord = {
        tokenNumber: tokenNumberStr,
        numericId: currentTokenCount,
        uid: randomUid,
        patientName: nameInput.value.trim(),
        ageGender: `${ageInput.value} Yrs / ${genderInput.value}`,
        phone: phoneInput.value.trim(),
        doctor: selectedDoctor,
        specialty: specialty,
        room: room,
        fee: `₹${fee}`,
        date: selectedDayLabel,
        estTime: slotInput.value.split('[')[0].trim(),
        isEmergency: isEmergency && isEmergency.checked,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      saveTokenToStorage(tokenRecord);

      // Open Modal
      openModal();
      showToast(`Appointment Confirmed! Token ${tokenNumberStr} saved to your device.`, 'success');
    });
  }

  function openModal() {
    if (tokenModal) {
      tokenModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (tokenModal) {
      tokenModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (bookAnotherBtn) {
    bookAnotherBtn.addEventListener('click', () => {
      closeModal();
      if (appointmentForm) {
        appointmentForm.reset();
        appointmentForm.classList.remove('was-validated');
      }
      clearSelectedSlot();
      const bookingSection = document.getElementById('booking');
      if (bookingSection) bookingSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Close modal when clicking outside card
  if (tokenModal) {
    tokenModal.addEventListener('click', (e) => {
      if (e.target === tokenModal) {
        closeModal();
      }
    });
  }

  // Print Token Pass
  if (printTokenBtn) {
    printTokenBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // ==========================================
  // 6.1 LocalStorage Booked Tokens & Tracking System
  // (Module: feature-directory-filters / Lead: Rohit Kumar)
  // ==========================================
  const myTokensModal = document.getElementById('myTokensModal');
  const trackTokenNavBtn = document.getElementById('trackTokenNavBtn');
  const closeMyTokensBtn = document.getElementById('closeMyTokensBtn');
  const myTokensListContainer = document.getElementById('myTokensListContainer');
  const lookupTokenInput = document.getElementById('lookupTokenInput');
  const refreshTokensBtn = document.getElementById('refreshTokensBtn');
  const trackModalServingToken = document.getElementById('trackModalServingToken');

  function getStoredTokens() {
    try {
      const data = localStorage.getItem('medtoken_booked_tokens');
      if (!data) {
        // Pre-seed with one default demonstration pass
        const sampleToken = [{
          tokenNumber: '#TK-108',
          numericId: 108,
          uid: 'MED-2026-8708',
          patientName: 'Rohit Kumar (Sample Patient)',
          ageGender: '22 Yrs / Male',
          phone: '9876543210',
          doctor: 'Dr. Rohit Kumar',
          specialty: 'General Physician',
          room: 'Room 102',
          fee: '₹500',
          date: `Today (${formatDateShort(today)})`,
          estTime: '10:30 AM',
          isEmergency: false,
          createdAt: '09:15 AM'
        }];
        localStorage.setItem('medtoken_booked_tokens', JSON.stringify(sampleToken));
        return sampleToken;
      }
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  function saveTokenToStorage(tokenObj) {
    const tokens = getStoredTokens();
    tokens.unshift(tokenObj);
    localStorage.setItem('medtoken_booked_tokens', JSON.stringify(tokens));
  }

  function deleteTokenFromStorage(tokenNumber) {
    const tokens = getStoredTokens().filter((t) => t.tokenNumber !== tokenNumber);
    localStorage.setItem('medtoken_booked_tokens', JSON.stringify(tokens));
  }

  function displayStoredTokenInModal(token) {
    document.getElementById('modalTokenNum').textContent = token.tokenNumber;
    document.getElementById('modalPatientName').textContent = token.patientName;
    document.getElementById('modalAgeGender').textContent = token.ageGender;
    document.getElementById('modalDoctor').textContent = token.doctor;
    document.getElementById('modalSpecialty').textContent = token.specialty;
    document.getElementById('modalRoom').textContent = token.room;
    document.getElementById('modalFee').textContent = `${token.fee} (Pay at desk)`;
    document.getElementById('modalDate').textContent = token.date;
    document.getElementById('modalEstTime').textContent = token.estTime;
    document.getElementById('modalUid').textContent = token.uid;

    const priorityBadge = document.getElementById('tokenPriorityBadge');
    const modalQueuePos = document.getElementById('modalQueuePos');

    if (token.isEmergency) {
      priorityBadge.textContent = 'PRIORITY / URGENT';
      priorityBadge.className = 'pass-status-pill priority';
      modalQueuePos.textContent = 'Immediate Priority Queue';
      modalQueuePos.className = 'pass-val text-danger';
    } else {
      priorityBadge.textContent = 'CONFIRMED';
      priorityBadge.className = 'pass-status-pill';
      modalQueuePos.textContent = `Queue Active`;
      modalQueuePos.className = 'pass-val text-success';
    }

    closeMyTokensModal();
    openModal();
  }

  function renderMyTokens(filterQuery = '') {
    if (!myTokensListContainer) return;
    const tokens = getStoredTokens();
    const query = filterQuery.trim().toLowerCase();

    const filtered = tokens.filter((t) => {
      if (!query) return true;
      return (
        t.tokenNumber.toLowerCase().includes(query) ||
        t.patientName.toLowerCase().includes(query) ||
        (t.phone && t.phone.includes(query)) ||
        t.doctor.toLowerCase().includes(query)
      );
    });

    if (trackModalServingToken) {
      trackModalServingToken.textContent = `#TK-0${currentServingNumber}`;
    }

    if (filtered.length === 0) {
      myTokensListContainer.innerHTML = `
        <div class="empty-tokens-view">
          <i class="fa-solid fa-ticket-simple"></i>
          <h4>No Booked Tokens Found</h4>
          <p>${query ? 'No token matches your search query.' : 'You have not booked any OPD tokens on this device yet.'}</p>
        </div>
      `;
      return;
    }

    myTokensListContainer.innerHTML = '';
    filtered.forEach((tok) => {
      const card = document.createElement('div');
      card.className = 'token-history-card';

      // Queue status calculation
      let statusHtml = '';
      const diff = tok.numericId - currentServingNumber;

      if (tok.numericId === currentServingNumber) {
        card.classList.add('active-now');
        statusHtml = `<span class="badge-status fast"><i class="fa-solid fa-bullhorn"></i> NOW CALLING in ${tok.room}</span>`;
      } else if (tok.numericId < currentServingNumber) {
        statusHtml = `<span class="badge-status" style="background:#e2e8f0; color:#475569;"><i class="fa-solid fa-check-double"></i> Consultation Completed</span>`;
      } else {
        const estMins = diff * 10;
        statusHtml = `<span class="badge-status wait"><i class="fa-regular fa-clock"></i> ${diff} patients ahead (~${estMins} mins wait)</span>`;
      }

      card.innerHTML = `
        <div class="token-card-top">
          <span class="token-id-badge">${tok.tokenNumber}</span>
          <span class="token-date-time"><i class="fa-regular fa-calendar"></i> ${tok.date} • ${tok.estTime}</span>
        </div>
        <div class="token-card-body">
          <div>
            <strong>Patient Name</strong>
            <span>${tok.patientName}</span>
          </div>
          <div>
            <strong>Doctor & Room</strong>
            <span>${tok.doctor} (${tok.room})</span>
          </div>
          <div>
            <strong>Department</strong>
            <span>${tok.specialty}</span>
          </div>
          <div>
            <strong>Consultation Fee</strong>
            <span>${tok.fee}</span>
          </div>
        </div>
        <div class="token-queue-status">
          <span>Live Queue Status:</span>
          ${statusHtml}
        </div>
        <div class="token-card-actions">
          <button type="button" class="btn btn-primary btn-sm view-pass-btn">
            <i class="fa-solid fa-qrcode"></i> View / Print Pass
          </button>
          <button type="button" class="btn btn-outline btn-sm delete-token-btn" style="color: var(--danger-color); border-color: var(--danger-color);">
            <i class="fa-solid fa-trash-can"></i> Cancel
          </button>
        </div>
      `;

      // Event listeners for card buttons
      const viewBtn = card.querySelector('.view-pass-btn');
      const delBtn = card.querySelector('.delete-token-btn');

      if (viewBtn) {
        viewBtn.addEventListener('click', () => {
          displayStoredTokenInModal(tok);
        });
      }

      if (delBtn) {
        delBtn.addEventListener('click', () => {
          if (confirm(`Are you sure you want to cancel token ${tok.tokenNumber}?`)) {
            deleteTokenFromStorage(tok.tokenNumber);
            renderMyTokens(lookupTokenInput ? lookupTokenInput.value : '');
            showToast(`Token ${tok.tokenNumber} cancelled successfully.`, 'info');
          }
        });
      }

      myTokensListContainer.appendChild(card);
    });
  }

  function openMyTokensModal() {
    if (myTokensModal) {
      renderMyTokens(lookupTokenInput ? lookupTokenInput.value : '');
      myTokensModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMyTokensModal() {
    if (myTokensModal) {
      myTokensModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  if (trackTokenNavBtn) trackTokenNavBtn.addEventListener('click', openMyTokensModal);
  if (closeMyTokensBtn) closeMyTokensBtn.addEventListener('click', closeMyTokensModal);
  if (refreshTokensBtn) {
    refreshTokensBtn.addEventListener('click', () => {
      renderMyTokens(lookupTokenInput ? lookupTokenInput.value : '');
      showToast('Queue tracking refreshed', 'info');
    });
  }

  if (lookupTokenInput) {
    lookupTokenInput.addEventListener('input', () => {
      renderMyTokens(lookupTokenInput.value);
    });
  }

  if (myTokensModal) {
    myTokensModal.addEventListener('click', (e) => {
      if (e.target === myTokensModal) {
        closeMyTokensModal();
      }
    });
  }

  // ==========================================
  // 7. Toast Notification System
  // ==========================================
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'warning') icon = 'fa-triangle-exclamation';

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ==========================================
  // 8. Live OPD Queue Monitor Simulation
  // ==========================================
  const liveServingToken = document.getElementById('liveServingToken');
  const nextServingToken = document.getElementById('nextServingToken');
  let currentServingNumber = 42;

  // Simulate queue movement every 60 seconds
  setInterval(() => {
    currentServingNumber += 1;
    if (liveServingToken) {
      liveServingToken.textContent = `#TK-0${currentServingNumber}`;
      liveServingToken.style.animation = 'pulseToken 0.6s ease';
      setTimeout(() => {
        liveServingToken.style.animation = '';
      }, 600);
    }
    if (nextServingToken) {
      nextServingToken.textContent = `#TK-0${currentServingNumber + 1}`;
    }
    if (trackModalServingToken) {
      trackModalServingToken.textContent = `#TK-0${currentServingNumber}`;
    }
  }, 60000);
});

// CSS Keyframe animation dynamically attached for smooth card filtering
const dynamicStyle = document.createElement('style');
dynamicStyle.innerHTML = `
  @keyframes fadeInCard {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes pulseToken {
    0% { transform: scale(1); }
    50% { transform: scale(1.08); color: #00769e; }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(dynamicStyle);
