import { ZodError } from 'zod';
import multer from 'multer';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    const formattedErrors = {};
    err.errors.forEach(e => {
      const field = e.path.join('.') || 'form';
      formattedErrors[field] = e.message;
    });

    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data.',
        details: formattedErrors
      }
    });
  }

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: {
          code: 'FILE_TOO_LARGE',
          message: 'Resume file size cannot exceed 5MB.'
        }
      });
    }
    return res.status(400).json({
      error: {
        code: 'UPLOAD_ERROR',
        message: err.message
      }
    });
  }

  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({
      error: {
        code: 'INVALID_FILE_TYPE',
        message: err.message
      }
    });
  }

  console.error('[API Error]:', err);

  const status = err.status || 500;
  return res.status(status).json({
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred. Please try again later.'
    }
  });
};
