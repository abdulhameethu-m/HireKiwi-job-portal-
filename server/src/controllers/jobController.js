import { dbStore } from '../models/Store.js';
import { jobSchema } from '../utils/validators.js';

export const getJobs = (req, res) => {
  const {
    keyword,
    q,
    location,
    experience,
    type,
    category,
    status = 'active',
    sort = 'newest',
    page = 1,
    limit = 10
  } = req.query;

  // Keyword can come from query param keyword or q
  const query = keyword || q || '';

  // If user is admin and specifies status='all', let status be null
  const statusFilter = (req.user?.role === 'admin' && status === 'all') ? null : (status || 'active');

  const result = dbStore.getJobs({
    query,
    location,
    experience,
    type,
    category,
    status: statusFilter,
    sort,
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10
  });

  return res.status(200).json(result);
};

export const getJobById = (req, res) => {
  const { id } = req.params;
  const job = dbStore.findJobById(id);

  if (!job) {
    return res.status(404).json({
      error: {
        code: 'JOB_NOT_FOUND',
        message: 'The requested job listing was not found or has been removed.'
      }
    });
  }

  // Find up to 3 related jobs from the same category or location
  const related = dbStore.getJobs({
    category: job.category,
    status: 'active',
    limit: 4
  }).jobs.filter(j => j.id !== job.id).slice(0, 3);

  return res.status(200).json({
    job,
    relatedJobs: related
  });
};

export const createJob = (req, res, next) => {
  try {
    const validated = jobSchema.parse(req.body);
    const created = dbStore.createJob(validated);
    return res.status(201).json({
      message: 'Job listing published successfully.',
      job: created
    });
  } catch (err) {
    next(err);
  }
};

export const updateJob = (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = dbStore.findJobById(id);
    if (!existing) {
      return res.status(404).json({
        error: {
          code: 'JOB_NOT_FOUND',
          message: 'Job listing not found.'
        }
      });
    }

    const updated = dbStore.updateJob(id, req.body);
    return res.status(200).json({
      message: 'Job listing updated successfully.',
      job: updated
    });
  } catch (err) {
    next(err);
  }
};

export const deleteJob = (req, res) => {
  const { id } = req.params;
  const deleted = dbStore.deleteJob(id);
  if (!deleted) {
    return res.status(404).json({
      error: {
        code: 'JOB_NOT_FOUND',
        message: 'Job listing not found.'
      }
    });
  }

  return res.status(200).json({
    message: 'Job listing deleted successfully.'
  });
};
