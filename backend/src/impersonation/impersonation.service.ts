import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Impersonation } from './entities/impersonation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../BaseEntities/users/users.service';
import { v4 as uuidv4 } from 'uuid';
import { CustomLogger } from '../utils/Logger/CustomLogger.service';

@Injectable()
export class ImpersonationService {
  private readonly logger = new CustomLogger();

  constructor(
    @InjectRepository(Impersonation)
    private impersonationRepository: Repository<Impersonation>,
    private readonly userService: UsersService,
  ) {}

  async initiateImpersonation(
    adminUserId: number,
    userId: number,
  ): Promise<Impersonation> {
    try {
      // Check if admin user exists and is an admin
      const adminUser = await this.userService.findAdminUser(adminUserId);
      if (!adminUser) {
        throw new Error('Only admin users can create impersonation tokens');
      }

      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Create a new impersonation record
      const token = uuidv4();
      const exchangeBefore = new Date(Date.now() + 20 * 60 * 1000);

      const impersonation = this.impersonationRepository.create({
        adminUser,
        user,
        token,
        exchangeBefore,
        used: false,
      });

      return this.impersonationRepository.save(impersonation);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        'an error occurred while creating impersonation',
      );
    }
  }

  async validateToken(token: string): Promise<Impersonation> {
    const impersonation = await this.impersonationRepository.findOne({
      where: { token, used: false },
    });
    if (!impersonation || new Date() > impersonation.exchangeBefore) {
      throw new Error('Invalid or expired token');
    }

    return impersonation;
  }

  async revokeToken(impersonationId: string): Promise<void> {
    const impersonation = await this.impersonationRepository.findOne({
      where: { id: impersonationId },
    });
    if (!impersonation) {
      throw new Error('Impersonation record not found');
    }

    impersonation.used = true;
    await this.impersonationRepository.save(impersonation);
  }

  async markAsUsed(impersonationId: string): Promise<void> {
    const impersonation = await this.impersonationRepository.findOne({
      where: { id: impersonationId },
    });

    if (!impersonation) {
      throw new Error('Impersonation record not found');
    }

    impersonation.used = true;
    await this.impersonationRepository.save(impersonation);
  }

  getSessionDuration(): number {
    return 20 * 60 * 1000;
  }
}
