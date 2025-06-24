import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common'
import { UserService } from '@/core/use-cases/user.service'
import { User } from '@/core/domain/entities/user'
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto'
import { JwtAuthGuard } from './jwt-auth.guard'

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() userData: CreateUserDto) {
    return this.userService.create(userData)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.userService.findAll()
  }

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  findById(@Param('userId') userId: string) {
    return this.userService.findById(userId)
  }

  @Put(':userId')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('userId') userId: string,
    @Body() userData: UpdateUserDto
  ) {
    return this.userService.update(userId, userData)
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.OK)
  delete(@Param('userId') userId: string) {
    return this.userService.delete(userId)
  }
}
