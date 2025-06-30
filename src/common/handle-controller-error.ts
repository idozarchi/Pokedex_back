import {
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ControllerErrorType } from './controller-error-type.enum';

export function handleControllerError(
  error: Error,
  logger: Logger,
  notFoundMsg?: string,
  badRequestMsg?: string,
  internalMsg?: string,
): never {
  logger.error(error.message, error.stack);
  switch (error.name) {
    case ControllerErrorType.CastError:
    case ControllerErrorType.ValidationError:
      throw new BadRequestException(
        badRequestMsg || 'Invalid request parameters',
      );
    case ControllerErrorType.NotFoundException:
      throw new NotFoundException(notFoundMsg || 'Resource not found');
    default:
      throw new InternalServerErrorException(
        internalMsg || 'Internal server error',
      );
  }
}
