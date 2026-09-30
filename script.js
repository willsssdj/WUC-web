document.addEventListener('DOMContentLoaded', () => {
 
  const header = document.getElementById('site-header');
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('[data-target]');
  const sections = document.querySelectorAll('main .section, .hero');
 
  /* ---------- smooth-scroll to in-page sections ----------
     Buttons never navigate to another page/URL — they just
     scroll the current page down to the matching section,
     offset so the sticky header never covers the heading. */
  function scrollToTarget(id){
    const target = document.getElementById(id);
    if (!target) return;
    const headerHeight = header.offsetHeight;
    const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  }
 
  navLinks.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-target');
      scrollToTarget(id);
      // close mobile menu after choosing a section
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
 
  /* ---------- mobile nav toggle ---------- */
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });
 
  /* ---------- highlight the active nav button on scroll ---------- */
  const sectionIds = ['about', 'services', 'coverage', 'contact'];
  const navByTarget = {};
  navLinks.forEach(btn => {
    const id = btn.getAttribute('data-target');
    if (!navByTarget[id]) navByTarget[id] = [];
    navByTarget[id].push(btn);
  });
 
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      if (!sectionIds.includes(id)) return;
      navLinks.forEach(btn => btn.classList.remove('active'));
      (navByTarget[id] || []).forEach(btn => btn.classList.add('active'));
    });
  }, {
    rootMargin: '-45% 0px -50% 0px',
    threshold: 0
  });
 
  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
 
  /* ---------- header gains a stronger shadow once page scrolls ---------- */
  window.addEventListener('scroll', () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }, { passive: true });
 
  /* ---------- footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
 
  /* ---------- waybill number, generated once per page load ---------- */
  const waybillEl = document.getElementById('waybill-no');
  if (waybillEl){
    const now = new Date();
    const stamp = now.getFullYear().toString()
      + String(now.getMonth() + 1).padStart(2, '0')
      + String(now.getDate()).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    waybillEl.textContent = `NO. MF-${stamp}-${random}`;
  }
 
  /* ---------- contact form: client-side validation + fake submit ----------
     There is no backend here, so this just validates the fields,
     shows a confirmation message, and resets the form. Wire the
     fetch() call below up to a real endpoint when one exists. */
  const form = document.getElementById('quote-form');
  const statusEl = document.getElementById('form-status');
 
  function setFieldValid(row, isValid){
    row.classList.toggle('invalid', !isValid);
  }
 
  function validateForm(){
    let valid = true;
 
    const name = document.getElementById('name');
    const nameRow = name.closest('.form-row');
    const nameOk = name.value.trim().length > 0;
    setFieldValid(nameRow, nameOk);
    valid = valid && nameOk;
 
    const email = document.getElementById('email');
    const emailRow = email.closest('.form-row');
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    setFieldValid(emailRow, emailOk);
    valid = valid && emailOk;
 
    const message = document.getElementById('message');
    const messageRow = message.closest('.form-row');
    const messageOk = message.value.trim().length > 0;
    setFieldValid(messageRow, messageOk);
    valid = valid && messageOk;
 
    return valid;
  }
 
  if (form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
 
      if (!validateForm()){
        statusEl.textContent = 'Please fix the highlighted fields.';
        statusEl.classList.remove('success');
        return;
      }
 
      // Placeholder for a real submission, e.g.:
      // fetch('/api/quote', { method: 'POST', body: new FormData(form) })
      statusEl.textContent = 'Request received — a coordinator will reply within one business day.';
      statusEl.classList.add('success');
      form.reset();
    });
 
    // clear the error state on a field as soon as the visitor fixes it
    form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', () => {
        field.closest('.form-row')?.classList.remove('invalid');
      });
    });
  }
 
});