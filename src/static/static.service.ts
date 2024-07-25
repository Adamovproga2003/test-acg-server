import { Injectable, NotFoundException } from '@nestjs/common';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class StaticService {
  private readonly allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

  getImagePath(imageName: string): string {
    const ext = imageName.slice(imageName.lastIndexOf('.')).toLowerCase();
    if (!this.allowedExtensions.includes(ext)) {
      throw new NotFoundException('File type not allowed');
    }

    const imagePath = join(__dirname, '..', 'images', imageName);
    console.log(imagePath)
    if (!existsSync(imagePath)) {
      throw new NotFoundException('File not found');
    }

    return imagePath;
  }
}
