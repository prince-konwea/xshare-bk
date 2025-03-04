import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
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

  async getAllUsers() {
    try {
      const users = await this.userModel.find();
      return {
        success: true,
        message: 'Users retrieved successfully',
        data: users,
      };
    } catch (error) {
      throw new Error('Error fetching users');
    }
  }

  async updateUser(userId: string, updateData: Partial<CreateUserDto>) {
    if (updateData.email || updateData.username) {
      const existingUser = await this.userModel.findOne({
        $or: [{ email: updateData.email }, { username: updateData.username }],
        _id: { $ne: userId }, // Exclude current user from search
      });

      if (existingUser) {
        throw new ConflictException('Email or username already taken');
      }
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true },
    );

    if (!updatedUser) {
      throw new UnauthorizedException('User not found');
    }

    return {
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    };
  }

  async generateAndUpdatePin(userId: string) {
    const pin = Math.floor(1000 + Math.random() * 9000);

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { pin },
      { new: true },
    );

    if (!updatedUser) {
      throw new UnauthorizedException('User not found');
    }

    return {
      success: true,
      message: 'PIN generated and updated successfully',
      data: { pin },
    };
  }

  async verifyUserPin(userId: string, pin: number) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.pin !== pin) {
      throw new UnauthorizedException('Invalid PIN');
    }

    return {
      success: true,
      message: 'PIN verified successfully',
    };
  }

  async deleteUser(userId: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      throw new UnauthorizedException('User not found');
    }

    return {
      success: true,
      message: 'User deleted successfully',
    };
  }
}
