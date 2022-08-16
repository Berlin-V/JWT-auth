import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Authentication,Employee } from './entity';
@Module({
  imports: [
  TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'auth',
      password: 'root',
      database: 'auth',
      entities: [Authentication,Employee],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Authentication,Employee]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
