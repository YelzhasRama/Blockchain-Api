import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../entities/account.entity';

@Injectable()
export class AccountRepository {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async createAccount(walletAddress: string): Promise<Account> {
    const newAccount = this.accountRepository.create({ walletAddress });
    return await this.accountRepository.save(newAccount);
  }

  async findById(id: number): Promise<Account | null> {
    return await this.accountRepository.findOne({ where: { id } });
  }

  async findByWalletAddress(walletAddress: string): Promise<Account | null> {
    return await this.accountRepository.findOne({ where: { walletAddress } });
  }

  async updateAccount(
    id: number,
    walletAddress: string,
  ): Promise<Account | null> {
    const account = await this.findById(id);
    if (!account) {
      return null;
    }

    account.walletAddress = walletAddress;
    return await this.accountRepository.save(account);
  }

  async deleteAccount(id: number): Promise<boolean> {
    const result = await this.accountRepository.delete(id);
    return result.affected > 0;
  }

  async findAll(): Promise<Account[]> {
    return await this.accountRepository.find();
  }
}
