import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthsService {

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService

  ) { }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all `;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async login(body) {
    const user = await this.userService.findByEmail(body.email);
    if (user && bcrypt.compareSync(body.password, user.password)) {
      
      return {
        ok: true,
        token: await this.jwtService.signAsync(
          { sub: user.id },
          { secret: process.env.JWT_SECRET })
      };
    }
  }
}
