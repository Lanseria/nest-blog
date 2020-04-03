import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatabaseConnectionService } from './database-connection.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: BatabaseConnectionService,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
