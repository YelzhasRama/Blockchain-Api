import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { BlockchainService } from '../service/blockchain.service';
import { AuthService } from '../../auth/service/auth.service';
import Web3 from 'web3';
import { LoginDto } from '../../auth/dto/login.dto';
import { JwtAuthGuard } from '../../auth/startegies/jwt.auth.guard';

@Controller('orders')
export class BlockchainController {
  constructor(
    private readonly blockchainService: BlockchainService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('login')
  async login(@Body() body: LoginDto) {
    const { walletAddress, signature } = body;

    const user = await this.authService.getUserByWalletAddress(walletAddress);
    if (!user) {
      throw new Error('User not found');
    }

    const message = `Nonce: ${user.nonce}`;
    const web3 = new Web3();

    const signer = web3.eth.accounts.recover(message, signature);
    if (signer.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new Error('Invalid signature');
    }

    const token = await this.authService.generateJwt(user);
    return { token };
  }

  @UseGuards(JwtAuthGuard)
  @Get('getOrders')
  async getOrders(
    @Query('tokenA') tokenA?: string,
    @Query('tokenB') tokenB?: string,
    @Query('user') user?: string,
    @Query('active') active: string = 'false', // по умолчанию false
  ) {
    const activeStatus = active === 'true';
    return this.blockchainService.getOrders(tokenA, tokenB, user, activeStatus);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getMatchingOrders')
  async getMatchingOrders(
    @Query('tokenA') tokenA: string,
    @Query('tokenB') tokenB: string,
    @Query('amountA') amountA: string,
    @Query('amountB') amountB: string,
  ) {
    const amountAParsed = parseFloat(amountA);
    const amountBParsed = parseFloat(amountB);

    return this.blockchainService.getMatchingOrders(
      tokenA,
      tokenB,
      amountAParsed,
      amountBParsed,
    );
  }
}
