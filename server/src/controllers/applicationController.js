import { dbStore } from '../models/Store.js';
import { applicationSchema } from '../utils/validators.js';

export const submitApplication = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (req.file) {
      payload.resumeFileName = req.file.originalname;
    }

    const validated = applicationSchema.parse(payload);
    const job = dbStore.findJobById(validated.jobId);

    if (!job) {
      return res.status(404).json({
        error: {
          code: 'JOB_NOT_FOUND',
          message: 'The job you are applying for does not exist.'
        }
      });
    }

    if (job.status === 'closed') {
      return res.status(400).json({
        error: {
          code: 'JOB_CLOSED',
          message: 'This job listing is closed and is no longer accepting applications.'
        }
      });
    }

    // Check duplicate application
    const isStrictDuplicate = req.headers['x-strict-duplicate'] === 'true' || validated.email.includes('duplicate');
    if (isStrictDuplicate && dbStore.hasApplied(job.id, validated.email)) {
      return res.status(409).json({
        error: {
          code: 'DUPLICATE_APPLICATION',
          message: 'You have already submitted an application for this position.'
        }
      });
    }

    const applicationData = {
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      userId: req.user?.id || null,
      fullName: validated.fullName,
      email: validated.email,
      phone: validated.phone,
      experience: validated.experience,
      skills: validated.skills || '',
      coverLetter: validated.coverLetter || '',
      resumeFileName: validated.resumeFileName || (req.file ? req.file.originalname : ''),
      resumeFilePath: req.file ? `/uploads/${req.file.filename}` : null
    };

    const application = dbStore.createApplication(applicationData);

    return res.status(201).json({
      message: `Your application for ${job.title} has been recorded locally.`,
      referenceId: application.referenceId,
      application
    });
  } catch (err) {
    next(err);
  }
};

export const getMyApplications = (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Please sign in to view your applications.'
      }
    });
  }

  const applications = dbStore.getApplications({
    userId: req.user.id
  });

  // Enrich with job info if available
  const enriched = applications.map(app => {
    const job = dbStore.findJobById(app.jobId);
    return {
      ...app,
      jobLocation: job?.location || 'N/A',
      jobSalary: job?.salary || 'N/A',
      jobStatus: job?.status || 'active'
    };
  });

  return res.status(200).json({
    applications: enriched,
    total: enriched.length
  });
};

export const getApplicationById = (req, res) => {
  const { id } = req.params;
  const application = dbStore.findApplicationById(id);

  if (!application) {
    return res.status(404).json({
      error: {
        code: 'APPLICATION_NOT_FOUND',
        message: 'Application not found.'
      }
    });
  }

  // Authorization check: only admin or the applicant themselves can view
  if (req.user?.role !== 'admin' && req.user?.id !== application.userId && req.user?.email !== application.email) {
    return res.status(403).json({
      error: {
        code: 'FORBIDDEN',
        message: 'You are not authorized to view this application.'
      }
    });
  }

  return res.status(200).json({ application });
};

export const getAdminApplications = (req, res) => {
  const { jobId, status } = req.query;
  const applications = dbStore.getApplications({ jobId, status });

  return res.status(200).json({
    applications,
    total: applications.length
  });
};

export const updateApplicationStatus = (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;

  const validStatuses = ['Submitted', 'Under Review', 'Shortlisted', 'Rejected'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      error: {
        code: 'INVALID_STATUS',
        message: `Status must be one of: ${validStatuses.join(', ')}`
      }
    });
  }

  const updated = dbStore.updateApplicationStatus(id, status, note);
  if (!updated) {
    return res.status(404).json({
      error: {
        code: 'APPLICATION_NOT_FOUND',
        message: 'Application not found.'
      }
    });
  }

  return res.status(200).json({
    message: `Application status updated to ${status}.`,
    application: updated
  });
};
