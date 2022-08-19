import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Authentication, Employee } from './entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constant';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 5432,
			username: 'auth',
			password: 'root',
			database: 'auth',
			entities: [Authentication, Employee],
			synchronize: true,
		}),
		TypeOrmModule.forFeature([Authentication, Employee]),
		JwtModule.register({
			secret: jwtConstants.secret,
			signOptions: { expiresIn: '60s' },
		}),
	],
	controllers: [AppController],
	providers: [AppService, JwtService],
})
export class AppModule {}
