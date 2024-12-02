import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Account } from '../entities/account.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private readonly userRepository: Repository<Account>,
    private readonly jwtService: JwtService,
  ) {}

  async generateNonce(walletAddress: string): Promise<string> {
    const nonce = Math.random().toString(36).substring(2);
    let user = await this.userRepository.findOne({ where: { walletAddress } });

    if (!user) {
      user = this.userRepository.create({ walletAddress, nonce });
    } else {
      user.nonce = nonce;
    }

    await this.userRepository.save(user);
    return nonce;
  }

  async getUserByWalletAddress(walletAddress: string): Promise<Account | null> {
    return await this.userRepository.findOne({ where: { walletAddress } });
  }

  async generateJwt(user: Account): Promise<string> {
    const payload = { walletAddress: user.walletAddress, sub: user.id };
    return this.jwtService.sign(payload);
  }
}
