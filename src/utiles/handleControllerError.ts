import { Logger } from '@nestjs/common';

export function handleControllerError(
  error: any,
  logger: Logger,
  context?: string,
  validationMsg?: string,
  generalMsg?: string,
) {
  if (error?.name === 'ValidationError' && validationMsg) {
    logger.warn(`${validationMsg}: ${error.message}`);
  } else if (generalMsg) {
    logger.error(`${generalMsg}: ${error.message}`);
  } else {
    logger.error(error.message);
  }
}
