import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GitlabModule } from './gitlab/gitlab.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.env` }),
    GitlabModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
