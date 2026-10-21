/**
 * MedToken - Local Clinic Doctor Appointment and Token Booking System
 * Script Logic & Interactive Features
 * CSE326 Internet Programming Project - Lovely Professional University
 * Authors: Team Elite (Rohit, Harsh, Abhay)
 */

document.addEventListener('DOMContentLoaded', () => {
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
  // 2. Specialty Interactive Filter UI
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const doctorCards = document.querySelectorAll('.doctor-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const specialty = btn.getAttribute('data-specialty');

      doctorCards.forEach((card) => {
        const cardSpecialty = card.getAttribute('data-specialty');
        if (specialty === 'all' || cardSpecialty === specialty) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInCard 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

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

      // Open Modal
      openModal();
      showToast(`Appointment Confirmed! Token ${tokenNumberStr} generated successfully.`, 'success');
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
