import { forwardRef, Module } from '@nestjs/common';
import { BlockchainService } from './service/blockchain.service';
import { DatabaseModule } from '../database/database.module';
import { BlockchainController } from './controller/blockchain.controller';
import { BlockchainListenerService } from './service/blockchain.listener.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => AuthModule)],
  providers: [
    BlockchainService,
    BlockchainListenerService,
    BlockchainController,
  ],
  exports: [BlockchainService, BlockchainListenerService],
})
export class BlockchainModule {}
