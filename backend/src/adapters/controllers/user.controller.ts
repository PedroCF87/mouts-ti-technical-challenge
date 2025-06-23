import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UserService } from '@/core/use-cases/user.service';
import { User } from '@/core/domain/entities/user';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() userData: Partial<User>) {
    return this.userService.create(userData);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':userId')
  findById(@Param('userId') userId: string) {
    return this.userService.findById(userId);
  }

  @Put(':userId')
  update(
    @Param('userId') userId: string,
    @Body() userData: Partial<User>
  ) {
    return this.userService.update(userId, userData);
  }

  @Delete(':userId')
  delete(@Param('userId') userId: string) {
    return this.userService.delete(userId);
  }
}
