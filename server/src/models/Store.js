import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getSeedData } from '../config/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

class LocalStore {
  constructor() {
    this.data = {
      users: [],
      jobs: [],
      applications: []
    };
    this.initialized = false;
  }

  async init(forceReset = false) {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!forceReset && fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        this.initialized = true;
        return;
      } catch (err) {
        console.warn('Corrupt DB file encountered, reseeding...', err.message);
      }
    }

    await this.resetToSeed();
    this.initialized = true;
  }

  async resetToSeed() {
    const seed = await getSeedData();
    this.data = JSON.parse(JSON.stringify(seed));
    this.persist();
  }

  persist() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist DB to file:', err.message);
    }
  }

  // --- Users ---
  findUserByEmail(email) {
    if (!email) return null;
    return this.data.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  }

  findUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  createUser(userData) {
    const newUser = {
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      role: 'applicant',
      headline: '',
      skills: [],
      ...userData
    };
    this.data.users.push(newUser);
    this.persist();
    return newUser;
  }

  updateUser(id, updates) {
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    this.data.users[index] = { ...this.data.users[index], ...updates };
    this.persist();
    return this.data.users[index];
  }

  // --- Jobs ---
  getJobs({ query = '', location = '', experience = '', type = '', category = '', status = 'active', page = 1, limit = 10, sort = 'newest' } = {}) {
    let filtered = [...this.data.jobs];

    // Status filter: if null, return all (for admin); if 'active', return active only
    if (status) {
      filtered = filtered.filter(j => j.status === status);
    }

    if (query) {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        (Array.isArray(j.skills) && j.skills.some(s => s.toLowerCase().includes(q))) ||
        (j.description && j.description.toLowerCase().includes(q))
      );
    }

    if (location && location !== 'All' && location !== 'All locations') {
      filtered = filtered.filter(j => j.location.toLowerCase() === location.toLowerCase().trim());
    }

    if (experience && experience !== 'All') {
      filtered = filtered.filter(j => j.experience.toLowerCase() === experience.toLowerCase().trim());
    }

    if (type && type !== 'All') {
      filtered = filtered.filter(j => j.type.toLowerCase() === type.toLowerCase().trim());
    }

    if (category && category !== 'All') {
      filtered = filtered.filter(j => j.category && j.category.toLowerCase() === category.toLowerCase().trim());
    }

    if (sort === 'id') {
      filtered.sort((a, b) => Number(a.id) - Number(b.id));
    } else if (sort === 'newest') {
      filtered.sort((a, b) => new Date(b.postedDate || 0) - new Date(a.postedDate || 0));
    } else if (sort === 'oldest') {
      filtered.sort((a, b) => new Date(a.postedDate || 0) - new Date(b.postedDate || 0));
    }

    const total = filtered.length;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = filtered.slice(startIndex, startIndex + limitNum);

    return {
      jobs: paginated,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1
    };
  }

  findJobById(id) {
    const numericId = Number(id);
    return this.data.jobs.find(j => j.id === numericId || String(j.id) === String(id));
  }

  createJob(jobData) {
    const nextId = this.data.jobs.length ? Math.max(...this.data.jobs.map(j => Number(j.id) || 0)) + 1 : 1;
    const newJob = {
      id: nextId,
      status: 'active',
      postedDate: new Date().toISOString().split('T')[0],
      responsibilities: [],
      skills: [],
      ...jobData
    };
    this.data.jobs.unshift(newJob);
    this.persist();
    return newJob;
  }

  updateJob(id, updates) {
    const numericId = Number(id);
    const index = this.data.jobs.findIndex(j => j.id === numericId || String(j.id) === String(id));
    if (index === -1) return null;
    this.data.jobs[index] = { ...this.data.jobs[index], ...updates };
    this.persist();
    return this.data.jobs[index];
  }

  deleteJob(id) {
    const numericId = Number(id);
    const index = this.data.jobs.findIndex(j => j.id === numericId || String(j.id) === String(id));
    if (index === -1) return false;
    this.data.jobs.splice(index, 1);
    this.persist();
    return true;
  }

  // --- Applications ---
  getApplications({ userId = null, jobId = null, status = null } = {}) {
    let list = [...this.data.applications];
    if (userId) {
      list = list.filter(a => a.userId === userId || a.email.toLowerCase() === String(userId).toLowerCase());
    }
    if (jobId) {
      const numId = Number(jobId);
      list = list.filter(a => a.jobId === numId || String(a.jobId) === String(jobId));
    }
    if (status) {
      list = list.filter(a => a.status.toLowerCase() === status.toLowerCase());
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  findApplicationById(id) {
    return this.data.applications.find(a => a.id === id || a.referenceId === id);
  }

  hasApplied(jobId, email) {
    const numId = Number(jobId);
    return this.data.applications.some(
      a => (a.jobId === numId || String(a.jobId) === String(jobId)) &&
           a.email.toLowerCase() === email.trim().toLowerCase()
    );
  }

  createApplication(appData) {
    const refSuffix = Math.floor(1000000 + Math.random() * 9000000);
    const newApp = {
      id: `app-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      referenceId: `CN-${refSuffix}`,
      status: 'Submitted',
      statusHistory: [
        { status: 'Submitted', timestamp: new Date().toISOString(), note: 'Application submitted successfully' }
      ],
      createdAt: new Date().toISOString(),
      ...appData
    };
    this.data.applications.unshift(newApp);
    this.persist();
    return newApp;
  }

  updateApplicationStatus(id, newStatus, note = '') {
    const app = this.findApplicationById(id);
    if (!app) return null;
    app.status = newStatus;
    if (!app.statusHistory) app.statusHistory = [];
    app.statusHistory.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to ${newStatus}`
    });
    this.persist();
    return app;
  }
}

export const dbStore = new LocalStore();
