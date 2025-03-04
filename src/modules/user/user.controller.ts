import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Patch(':id')
  async updateUser(
    @Param('id') userId: string,
    @Body() updateData: Partial<CreateUserDto>,
  ) {
    return this.userService.updateUser(userId, updateData);
  }
  @Delete(':id')
  async deleteUser(@Param('id') userId: string) {
    return this.userService.deleteUser(userId);
  }

  @Post(':id/generate-pin')
  async generatePin(@Param('id') userId: string) {
    return this.userService.generateAndUpdatePin(userId);
  }

  @Post(':id/verify-pin')
  async verifyPin(@Param('id') userId: string, @Body('pin') pin: number) {
    return this.userService.verifyUserPin(userId, pin);
  }
}
