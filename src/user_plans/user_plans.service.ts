import { Injectable } from '@nestjs/common';
import { CreateUserPlanDto } from './dto/create-user_plan.dto';
import { UpdateUserPlanDto } from './dto/update-user_plan.dto';
import { UserPlan } from './entities/user_plan.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserPlansService {

  constructor(
    @InjectRepository(UserPlan)
    private readonly userPlanRepository: Repository<UserPlan>,
  ) { 
  }

  create(createUserPlanDto: CreateUserPlanDto) {
    return 'This action adds a new userPlan';
  }

  findAll() {
    return `This action returns all userPlans`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userPlan`;
  }

  update(id: number, updateUserPlanDto: UpdateUserPlanDto) {
    return `This action updates a #${id} userPlan`;
  }

  remove(id: number) {
    return `This action removes a #${id} userPlan`;
  }

  async user_usage(userId: number): Promise<UserPlan[]> {

    let getUserPlan = this.userPlanRepository.createQueryBuilder('user_plan')
      .select([
        'SUM(user_plan.credit_tabs) - SUM(user_plan.debit_tabs) as tabs_total',
        'SUM(user_plan.credit_articles) - SUM(user_plan.debit_articles) as articles_total',
        'SUM(user_plan.credit_tabs) as month_tabs',
        'user_plan.user_id',
        'SUM(user_plan.credit_articles) as month_articles',
      ])
      .where('user_plan.user_id = :userId', { userId })
      .andWhere('user_plan.used = :used', { used: 0 })
      .andWhere('user_plan.expired = :expired', { expired: 0 })
      .andWhere('user_plan.invoice_payment_id != :invoicePaymentId', { invoicePaymentId: 0 })
      .groupBy('user_plan.user_id')
      .limit(1)
      .getRawOne();

      
    return getUserPlan; 
  }
  
}
