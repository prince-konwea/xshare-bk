import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './models/user.model';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(createUserDto: CreateUserDto) {
    const { email, username } = createUserDto;

    // Check if email or username already exists
    const existingUser = await this.userModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      throw new ConflictException('Email or username already exists');
    }

    // Create user (without password hashing)
    const newUser = await new this.userModel(createUserDto).save();

    // Format response
    return {
      success: true,
      message: 'User registered successfully',
      data: newUser,
    };
  }


  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    // Find user by email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Compare passwords (since password is stored as plain text, just check equality)
    if (user.password !== password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Format response
    return {
      success: true,
      message: 'User logged in successfully',
      data: user,
    };
  }

}
