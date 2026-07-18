// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
  })()


// Fade-in-on-scroll reveal effect for elements with .reveal or .reveal-stagger classes
(function () {
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if (!revealEls.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => observer.observe(el));
})();

// Wishlist heart — visual only, no backend call, no persistence
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.wishlist-btn');
  if (!btn) return;
  e.preventDefault();
  e.stopPropagation();
  btn.classList.toggle('active');
  const icon = btn.querySelector('i');
  icon.classList.toggle('fa-regular');
  icon.classList.toggle('fa-solid');
});

// Category filter pills — visual active state only
document.addEventListener('click', (e) => {
  const filter = e.target.closest('.filter');
  if (!filter) return;
  document.querySelectorAll('.filter').forEach(f => f.classList.remove('active'));
  filter.classList.add('active');
});

document.addEventListener('change', (e) => {
  if (e.target.matches('input[type="file"][name="listing[image]"]')) {
    const file = e.target.files[0];
    const maxSize = 10 * 1024 * 1024;
    const errorId = e.target.id + '-size-error';
    let errorEl = document.getElementById(errorId);
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.id = errorId;
      errorEl.className = 'invalid-feedback d-block';
      e.target.parentNode.appendChild(errorEl);
    }
    if (file && file.size > maxSize) {
      errorEl.textContent = `Image is too large (${(file.size / (1024*1024)).toFixed(1)} MB). Maximum allowed is 10 MB.`;
      e.target.value = '';
    } else {
      errorEl.textContent = '';
    }
  }
});