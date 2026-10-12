import './style.css';

const jobs = [
  { id: 1, title: 'Junior Java Developer', company: 'Northstar Digital', location: 'Coimbatore', experience: '0–2 years', salary: '₹3–5 LPA', type: 'Full-time', description: 'Build and maintain Java services, write unit tests, and collaborate with the engineering team.', skills: ['Java', 'SQL', 'Git'] },
  { id: 2, title: 'QA Engineer', company: 'BrightPath Systems', location: 'Chennai', experience: '0–2 years', salary: '₹3–4.5 LPA', type: 'Full-time', description: 'Design test cases, report defects, and automate important web workflows.', skills: ['Manual Testing', 'Playwright', 'API Testing'] },
  { id: 3, title: 'Technical Support Associate', company: 'CloudBridge Services', location: 'Bengaluru', experience: '0–1 years', salary: '₹2.5–3.5 LPA', type: 'Full-time', description: 'Help customers troubleshoot technical issues and document solutions.', skills: ['Communication', 'Troubleshooting', 'SQL'] },
  { id: 4, title: 'Business Analyst Trainee', company: 'BluePeak Consulting', location: 'Remote', experience: 'Fresher', salary: '₹3–4 LPA', type: 'Hybrid', description: 'Gather requirements, prepare process documentation, and support stakeholder reviews.', skills: ['Excel', 'Documentation', 'Analysis'] },
  { id: 5, title: 'Frontend Developer Intern', company: 'PixelWorks Studio', location: 'Coimbatore', experience: 'Fresher', salary: '₹12,000–18,000/month', type: 'Internship', description: 'Create responsive interfaces and work with designers and developers.', skills: ['HTML', 'CSS', 'JavaScript'] },
  { id: 6, title: 'IT Operations Associate', company: 'Evergreen Tech', location: 'Hyderabad', experience: '0–2 years', salary: '₹2.8–4 LPA', type: 'Full-time', description: 'Monitor IT systems, resolve service requests, and maintain operational records.', skills: ['Windows', 'Networking', 'Service Desk'] }
];

const state = { query: '', location: '', jobId: null };
const app = document.querySelector('#app');

function header() {
  return `<header class="topbar"><a class="brand" href="#" data-home><span class="brand-mark">C</span> CareerNest</a><nav><a href="#jobs" data-jobs-link>Find jobs</a><a href="#about">Career advice</a><button class="btn btn-outline" id="profileBtn">Sign in</button></nav></header>`;
}

function render() {
  const filtered = jobs.filter(j =>
    `${j.title} ${j.company} ${j.skills.join(' ')}`.toLowerCase().includes(state.query.toLowerCase()) &&
    (!state.location || j.location.toLowerCase() === state.location.toLowerCase())
  );
  app.innerHTML = `${header()}
  <main>
    <section class="hero">
      <div class="hero-copy"><p class="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p><h1>Find work that<br><span>moves you forward.</span></h1><p class="hero-sub">Explore opportunities from companies building what comes next.</p>
      <form id="searchForm" class="search-panel">
        <label class="search-field"><span>⌕</span><input id="keyword" name="keyword" placeholder="Job title, skill, or company" value="${escapeHtml(state.query)}" aria-label="Job title, skill, or company"></label>
        <label class="search-field"><span>⌖</span><select id="location" name="location" aria-label="Location"><option value="">All locations</option>${['Coimbatore','Chennai','Bengaluru','Hyderabad','Remote'].map(l=>`<option ${state.location===l?'selected':''} value="${l}">${l}</option>`).join('')}</select></label>
        <button class="btn btn-primary" type="submit">Search jobs</button>
      </form>
      <p class="popular">Popular: <button class="text-link" data-query="Java">Java</button><button class="text-link" data-query="QA">QA testing</button><button class="text-link" data-query="Support">Technical support</button></p></div>
      <div class="hero-art" aria-hidden="true"><div class="art-circle"></div><div class="art-card card-one"><span class="mini-icon purple">✦</span><div><b>Find your fit</b><small>Opportunities for you</small></div></div><div class="art-card card-two"><span class="mini-icon green">✓</span><div><b>Career growth</b><small>Take the next step</small></div></div><div class="art-person">✧</div></div>
    </section>
    <section class="jobs-section" id="jobs"><div class="section-heading"><div><p class="eyebrow">CURATED FOR YOUR CAREER</p><h2>Recommended jobs</h2><p class="muted">Explore roles that match your next move.</p></div><span class="result-count" id="resultCount">${filtered.length} jobs found</span></div>
      <div class="jobs-layout"><aside class="filter-panel"><h3>Filters</h3><label for="filterLocation">Location</label><select id="filterLocation"><option value="">All locations</option>${['Coimbatore','Chennai','Bengaluru','Hyderabad','Remote'].map(l=>`<option ${state.location===l?'selected':''} value="${l}">${l}</option>`).join('')}</select><button id="clearFilters" class="text-link clear-link">Clear filters</button><div class="filter-note"><b>💡 Job search tip</b><p>Use a specific role or skill to narrow your results.</p></div></aside>
      <div class="job-list" id="jobList">${filtered.length ? filtered.map(jobCard).join('') : `<div class="empty-state"><div class="empty-icon">⌕</div><h3>No jobs found</h3><p>Try a different keyword or location.</p><button class="btn btn-outline" id="resetSearch">Clear search</button></div>`}</div></div>
    </section>
    <section class="bottom-cta" id="about"><div><p class="eyebrow">READY FOR WHAT'S NEXT?</p><h2>Your next opportunity is out there.</h2><p>Keep exploring, learning, and moving forward.</p></div><a href="#jobs" class="btn btn-primary">Explore jobs</a></section>
  </main><footer><a class="brand" href="#" data-home><span class="brand-mark">C</span> CareerNest</a><span>Mock portal for QA testing · No real applications are sent.</span></footer>
  <div id="modalRoot"></div>`;
  bindEvents();
}

function jobCard(j) {
  return `<article class="job-card" data-job-card="${j.id}"><div class="company-logo logo-${j.id}">${j.company.split(' ').map(x=>x[0]).slice(0,2).join('')}</div><div class="job-info"><button class="job-title" data-details="${j.id}">${j.title}</button><p class="company">${j.company}</p><div class="job-meta"><span>⌖ ${j.location}</span><span>◷ ${j.experience}</span><span>₹ ${j.salary}</span></div><p class="job-description">${j.description}</p><div class="skills">${j.skills.map(s=>`<span>${s}</span>`).join('')}</div></div><button class="btn btn-outline view-btn" data-details="${j.id}">View details</button></article>`;
}

function showDetails(id) {
  const j = jobs.find(x => x.id === Number(id));
  if (!j) return;
  document.querySelector('#modalRoot').innerHTML = `<div class="modal-backdrop" id="modalBackdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="detailTitle"><button class="modal-close" id="closeModal" aria-label="Close">×</button><p class="eyebrow">JOB DETAILS</p><h2 id="detailTitle">${j.title}</h2><p class="company">${j.company}</p><div class="detail-pills"><span>⌖ ${j.location}</span><span>◷ ${j.experience}</span><span>₹ ${j.salary}</span><span>${j.type}</span></div><h3>About the role</h3><p>${j.description}</p><h3>Skills</h3><div class="skills">${j.skills.map(s=>`<span>${s}</span>`).join('')}</div><div class="modal-actions"><button class="btn btn-outline" id="closeDetails">Back to jobs</button><button class="btn btn-primary" id="applyNow" data-apply="${j.id}">Apply now</button></div></section></div>`;
  document.querySelector('#closeModal').onclick = closeModal;
  document.querySelector('#closeDetails').onclick = closeModal;
  document.querySelector('#modalBackdrop').onclick = e => { if (e.target.id === 'modalBackdrop') closeModal(); };
  document.querySelector('#applyNow').onclick = () => showApplication(j.id);
}

function showApplication(id) {
  const j = jobs.find(x => x.id === Number(id));
  document.querySelector('#modalRoot').innerHTML = `<div class="modal-backdrop" id="modalBackdrop"><section class="modal application-modal" role="dialog" aria-modal="true" aria-labelledby="applicationTitle"><button class="modal-close" id="closeModal" aria-label="Close">×</button><p class="eyebrow">TAKE THE NEXT STEP</p><h2 id="applicationTitle">Apply for ${j.title}</h2><p class="muted">All fields marked * are required. This is a simulated application for testing.</p><form id="applicationForm" novalidate data-job-id="${j.id}">
      <div class="form-grid"><div class="form-field"><label for="fullName">Full name *</label><input id="fullName" name="fullName" autocomplete="name" required minlength="2" maxlength="80" placeholder="Enter your full name"><small class="field-error" data-error="fullName"></small></div>
      <div class="form-field"><label for="email">Email address *</label><input id="email" name="email" autocomplete="email" required type="email" maxlength="120" placeholder="you@example.com"><small class="field-error" data-error="email"></small></div>
      <div class="form-field"><label for="phone">Phone number *</label><input id="phone" name="phone" inputmode="numeric" required placeholder="10-digit mobile number" maxlength="10"><small class="field-error" data-error="phone"></small></div>
      <div class="form-field"><label for="experience">Experience *</label><select id="experience" name="experience" required><option value="">Select experience</option><option>Fresher</option><option>0–1 years</option><option>1–2 years</option><option>2+ years</option></select><small class="field-error" data-error="experience"></small></div>
      <div class="form-field full-width"><label for="resume">Resume file name (optional)</label><input id="resume" name="resume" placeholder="e.g. resume.pdf"><small class="hint">Demo only; no file is uploaded.</small></div>
      <div class="form-field full-width"><label for="coverLetter">Why are you a good fit? (optional)</label><textarea id="coverLetter" name="coverLetter" maxlength="500" rows="3" placeholder="Briefly describe your skills"></textarea><small class="hint"><span id="charCount">0</span>/500 characters</small></div></div>
      <div class="form-alert" id="formAlert" role="alert" hidden></div><div class="modal-actions"><button type="button" class="btn btn-outline" id="cancelApplication">Cancel</button><button type="submit" class="btn btn-primary" id="submitApplication">Submit application</button></div></form></section></div>`;
  document.querySelector('#closeModal').onclick = closeModal;
  document.querySelector('#cancelApplication').onclick = closeModal;
  document.querySelector('#modalBackdrop').onclick = e => { if (e.target.id === 'modalBackdrop') closeModal(); };
  document.querySelector('#coverLetter').addEventListener('input', e => document.querySelector('#charCount').textContent = e.target.value.length);
  document.querySelector('#applicationForm').addEventListener('submit', submitApplication);
}

function validate(form) {
  const values = Object.fromEntries(new FormData(form).entries());
  const errors = {};
  if (!values.fullName.trim()) errors.fullName = 'Full name is required.';
  else if (values.fullName.trim().length < 2) errors.fullName = 'Enter at least 2 characters.';
  else if (values.fullName.trim().length > 80) errors.fullName = 'Name must be 80 characters or fewer.';
  if (!values.email.trim()) errors.email = 'Email address is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Enter a valid email address.';
  if (!values.phone.trim()) errors.phone = 'Phone number is required.';
  else if (!/^\d{10}$/.test(values.phone.trim())) errors.phone = 'Enter exactly 10 digits.';
  if (!values.experience) errors.experience = 'Select your experience.';
  return errors;
}

function submitApplication(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const errors = validate(form);
  form.querySelectorAll('.field-error').forEach(el => el.textContent = '');
  Object.entries(errors).forEach(([field, message]) => {
    const el = form.querySelector(`[data-error="${field}"]`);
    if (el) el.textContent = message;
  });
  const alert = document.querySelector('#formAlert');
  if (Object.keys(errors).length) {
    alert.hidden = false;
    alert.textContent = 'Please correct the highlighted fields and try again.';
    form.querySelector('.field-error:not(:empty)')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    return;
  }
  const jobId = Number(form.dataset.jobId);
  const values = Object.fromEntries(new FormData(form).entries());
  const applicationId = `CN-${Date.now().toString().slice(-7)}`;
  document.querySelector('#modalRoot').innerHTML = `<div class="modal-backdrop"><section class="modal success-modal" role="dialog" aria-modal="true" aria-labelledby="successTitle"><div class="success-check">✓</div><p class="eyebrow">APPLICATION RECEIVED</p><h2 id="successTitle">You're all set, ${escapeHtml(values.fullName.trim())}!</h2><p>Your demo application for <b>${escapeHtml(jobs.find(j=>j.id===jobId).title)}</b> has been recorded locally.</p><div class="confirmation-id">Reference ID: <b>${applicationId}</b></div><p class="muted small">This is a mock portal. No application was sent to a real employer.</p><button class="btn btn-primary" id="doneBtn">Back to jobs</button></section></div>`;
  document.querySelector('#doneBtn').onclick = closeModal;
}

function closeModal() { document.querySelector('#modalRoot').innerHTML = ''; }
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }

function bindEvents() {
  document.querySelector('#searchForm').addEventListener('submit', e => {
    e.preventDefault(); state.query = document.querySelector('#keyword').value.trim(); state.location = document.querySelector('#location').value; render(); document.querySelector('#jobs').scrollIntoView({behavior:'smooth'});
  });
  document.querySelector('#filterLocation').addEventListener('change', e => { state.location = e.target.value; render(); document.querySelector('#jobs').scrollIntoView({behavior:'smooth'}); });
  document.querySelector('#clearFilters').onclick = () => { state.query = ''; state.location = ''; render(); };
  document.querySelector('#resetSearch')?.addEventListener('click', () => { state.query = ''; state.location = ''; render(); });
  document.querySelectorAll('[data-details]').forEach(el => el.addEventListener('click', () => showDetails(el.dataset.details)));
  document.querySelectorAll('[data-query]').forEach(el => el.addEventListener('click', () => { state.query = el.dataset.query; render(); document.querySelector('#jobs').scrollIntoView({behavior:'smooth'}); }));
  document.querySelectorAll('[data-home], [data-jobs-link]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); state.query=''; state.location=''; render(); window.scrollTo({top:0,behavior:'smooth'}); }));
  document.querySelector('#profileBtn').onclick = () => {
    document.querySelector('#modalRoot').innerHTML = `<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="signinTitle"><button class="modal-close" id="closeModal" aria-label="Close">×</button><p class="eyebrow">WELCOME BACK</p><h2 id="signinTitle">Sign in</h2><p class="muted">Sign-in is not implemented in this mock assessment portal.</p><button class="btn btn-primary" id="signinClose">Got it</button></section></div>`;
    document.querySelector('#closeModal').onclick = closeModal; document.querySelector('#signinClose').onclick = closeModal;
  };
}
render();
