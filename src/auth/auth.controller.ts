import { Controller, Get, Post, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('')
export class AuthController {
  constructor(private readonly Service: AuthService) {}

  @Post()
  create() {
    return this.Service.create();
  }

  @Get()
  findAll() {
    return this.Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.Service.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.Service.remove(+id);
  }
}
