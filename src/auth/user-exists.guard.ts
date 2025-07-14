import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
  forwardRef,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class UserExistsGuard implements CanActivate {
  private readonly logger = new Logger(UserExistsGuard.name);

  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const cognitoUser = (request as any).cognitoUser;

    if (!cognitoUser) {
      this.logger.warn('UserExistsGuard: No Cognito user found in request');
      throw new UnauthorizedException('No Cognito user found');
    }

    const userAttributes = cognitoUser.UserAttributes || [];
    const userId = userAttributes.find((attr) => attr.Name === 'sub')?.Value;

    if (!userId) {
      this.logger.warn(
        'UserExistsGuard: No user identifier found in Cognito token',
      );
      throw new UnauthorizedException('No user identifier in token');
    }

    try {
      const user = await this.usersService.findById(userId);

      if (!user) {
        this.logger.warn(
          `UserExistsGuard: User not found in database for userId: ${userId}`,
        );
        throw new UnauthorizedException('User not found in DB');
      }

      this.logger.log(
        `UserExistsGuard: User validated successfully for userId: ${userId}`,
      );
      (request as any).user = user;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      this.logger.error(
        `UserExistsGuard: Database error while finding user ${userId}: ${error.message}`,
        error.stack,
      );
      throw new UnauthorizedException('Database error during user validation');
    }
  }
}
