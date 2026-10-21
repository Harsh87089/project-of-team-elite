# MedToken - Local Clinic Doctor Appointment & Token Booking System

**Academic Coursework:** CSE326 - Internet Programming  
**Institution:** Lovely Professional University (LPU)  
**Project Team:** Team Elite (Rohit, Harsh, Abhay)  
**Live Demo:** Hosted on GitHub Pages  

---

## 📌 Project Overview
**MedToken** is a web-based local clinic Outpatient Department (OPD) appointment scheduling and token booking portal. Designed to eliminate crowded clinic waiting rooms and reduce patient waiting times, the system provides:
1. An interactive **Specialist Doctor Directory** with category filters.
2. **Doctor Profile Cards** displaying qualifications, OPD timings, consultation fees, and chamber locations.
3. An interactive **Date and Time-Slot Grid Picker** with live availability indicators.
4. A semantic **Patient Registration Form** with HTML5 client-side validation.
5. An instant **Digital Medical Token Pass Generator** featuring a scannable QR representation, priority tagging, and print/save capability.
6. A **Live OPD Queue Monitor** that simulates real-time patient queue movement.

---

## 👥 Team Work Breakdown & Git Branching Strategy
To maintain a clean repository and prevent merge conflicts, each member was assigned an isolated feature branch matching their role:

| Team Member | Branch Name | Assigned Feature Module |
| :--- | :--- | :--- |
| **Rohit Kumar** (Team Lead) | `feature-directory-filters` | Header navigation, Hero banner with live counters, and Semantic Specialist Directory with interactive filters. |
| **Harsh** | `feature-profile-cards` | Doctor Profile Cards using CSS Flexbox & CSS Grid, custom card hover effects, badges, and pricing layouts. |
| **Abhay** | `feature-booking-system` | Interactive Time-Slot Picker, HTML5 Patient Form with CSS validation pseudo-classes, and printable Digital Token Modal. |

---

## 🛠️ Technology Stack & Syllabus Alignment
This project is built according to the **CSE326 Internet Programming** curriculum guidelines:

- **Unit I & II (HTML5 & Semantic Structure):**
  - Semantic tags: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`.
  - Accessible form controls: `<input type="text|number|tel|email|checkbox">`, `<select>`, `<textarea>`, `<button>`.
  - HTML5 Form constraints: `required`, `minlength`, `maxlength`, `min`, `max`, `pattern="[0-9]{10}"`.
- **Unit III (Advanced CSS Architecture):**
  - **CSS Custom Properties (Variables):** Theme colors (`--primary-color`, `--secondary-color`), shadows, and smooth transitions.
  - **CSS Grid Layout:** Multi-column doctor cards grid and 3-column time slot layout.
  - **CSS Flexbox:** App header alignment, filter controls, booking container columns, and footer arrangement.
  - **CSS Pseudo-classes & States:** `:hover`, `:focus`, `:active`, `:disabled`, `:valid`, `:invalid`, `:checked`.
  - **CSS Keyframes & Micro-animations:** Pulse animations on live indicators and modal slide transitions.
  - **Responsive Design:** CSS Media Queries for mobile (`max-width: 480px`), tablet (`max-width: 768px`), and desktop.
- **Client-Side Interactions (Vanilla JavaScript):**
  - Live specialty filter logic without page reloads.
  - Pre-selection sync between Doctor cards and booking form.
  - Dynamic token numbering and printable pass modal with `window.print()`.

---

## 📂 Repository Directory Structure
```
project-of-team-elite/
├── index.html        # Main semantic HTML5 webpage
├── style.css         # Advanced CSS stylesheet (Variables, Flexbox, Grid, Media Queries)
├── script.js         # Interactive filtering, slot selection & token generation logic
├── assets/           # Local media assets
│   ├── doctor1.jpg   # Dr. Rohit Kumar (General Physician)
│   ├── doctor2.jpg   # Dr. Priya Sharma (Pediatrician)
│   ├── doctor3.jpg   # Dr. Rahul Sharma (Dermatologist)
│   └── doctor4.jpg   # Dr. Ananya Sen (Dentist)
└── README.md         # Comprehensive project documentation
```

---

## 💻 Git Command Line Workflow for Collaborators

### 1. Clone the Shared Repository
```bash
git clone https://github.com/Harsh87089/project-of-team-elite.git
cd project-of-team-elite
```

### 2. Create and Switch to Your Designated Feature Branch
```bash
# For Rohit:
git checkout -b feature-directory-filters

# For Harsh:
git checkout -b feature-profile-cards

# For Abhay:
git checkout -b feature-booking-system
```

### 3. Stage, Commit and Push Your Work
```bash
git add .
git commit -m "Feat: Complete responsive doctor profile cards using CSS Grid"
git push origin <your-feature-branch>
```

### 4. Create Pull Request (PR) & Merge
1. Open GitHub repository in your browser.
2. Click **Compare & pull request** for your branch.
3. Request code review from teammates.
4. Merge into `main` branch once approved.

---

## 🌐 Evaluation & GitHub Pages Deployment Guide
To make the live project visible to evaluators:
1. Navigate to your GitHub repository on `github.com`.
2. Go to **Settings** > **Pages** (under the "Code and automation" sidebar).
3. Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
4. Select `main` branch and `/ (root)` directory, then click **Save**.
5. Within 1-2 minutes, your live site URL will be ready at:  
   `https://<your-username>.github.io/project-of-team-elite/`

---

## ✅ W3C Markup & Validation Compliance
The HTML and CSS have been structured to comply with W3C standards:
- Valid `<!DOCTYPE html>` declaration.
- UTF-8 encoding and responsive viewport meta tag.
- All image elements include explicit `alt`, `width`/`height` or CSS aspect ratio rules.
- Accessible ARIA labels (`aria-label`, `role="group"`, `role="dialog"`).

---
© 2026 MedToken Clinic • Team Elite (Rohit, Harsh, Abhay) • Lovely Professional University
