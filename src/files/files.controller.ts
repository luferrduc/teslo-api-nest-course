import { Response } from 'express';
import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';


@ApiTags('Product Images')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits: { fileSize: 10000 }
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }))
  uploadProductImage( 
    @UploadedFile() file: Express.Multer.File
  ){

    if(!file){
      throw new BadRequestException('Make sure that file is an image')
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;
    return secureUrl 
  }

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ){

    const path = this.filesService.getStaticProductImage(imageName)

    return res.sendFile(path);
  }
}
