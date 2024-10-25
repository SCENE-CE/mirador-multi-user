import { Module } from '@nestjs/common';
import { ManifestService } from './manifest.service';
import { ManifestController } from './manifest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manifest } from './entities/manifest.entity';
import { Tag } from "../tag/entities/tag.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Manifest,Tag])],
  controllers: [ManifestController],
  providers: [ManifestService],
  exports: [ManifestService],
})
export class ManifestModule {}
