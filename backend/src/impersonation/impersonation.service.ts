import { Injectable } from '@nestjs/common';
import { Impersonation } from './entities/impersonation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../BaseEntities/users/users.service';

@Injectable()
export class ImpersonationService {
  constructor(
    @InjectRepository(Impersonation)
    private impersonationRepository: Repository<Impersonation>,
    private readonly userService: UsersService,
  ) {}

  async createImpersonation(
    adminId: number,
    userId: number,
    token: string,
    exchangeBefore: Date,
  ): Promise<Impersonation> {
    const adminUser = await this.userService.findAdminUser(adminId);
    if (!adminUser) {
      throw new Error('Only admin users can create impersonation tokens');
    }

    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const impersonation = this.impersonationRepository.create({
      adminUser,
      user,
      token,
      exchangeBefore,
      used: false,
    });

    return this.impersonationRepository.save(impersonation);
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
}
