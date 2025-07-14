import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const REGION = process.env.COGNITO_REGION || 'eu-north-1';

const cognitoClient = new CognitoIdentityProviderClient({
  region: REGION,
});

@Injectable()
export class CognitoGuard implements CanActivate {
  private readonly logger = new Logger(CognitoGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      this.logger.warn('Authentication attempt without Authorization header');
      throw new UnauthorizedException('No Authorization header');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const command = new GetUserCommand({
        AccessToken: token,
      });

      const response = await cognitoClient.send(command);
      this.logger.log(`User authenticated successfully: ${response.Username}`);

      (request as any).cognitoUser = response;
      return true;
    } catch (err) {
      this.logger.error(
        `Cognito token verification failed: ${err.message}`,
        err.stack,
      );
      throw new UnauthorizedException('Invalid token');
    }
  }
}
