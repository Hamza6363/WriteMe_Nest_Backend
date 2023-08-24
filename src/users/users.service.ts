import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService
  ) {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async findByEmail(email) {
    return this.userRepository.findOne({ where: { email } })
  }

  async getApiFilePath() {
    return {
      url: process.env.BACKEND_BASEURL + '/public/storage/uploads/'
    }
  }

  async getAlreadyUser(email) {
    return this.userRepository.findOne({ where: { email } })
  }

  async checkVerificationCode(id) {
    return this.userRepository.findOne({ where: { id } })
  }
  // async updateUserStep_2(id){
  //   return this.userRepository.update(id)
  // }

  async sendMail(to: string, subject: string, message: string): Promise<void> {
    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_SENDER,
      to,
      subject,
      text: message,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(error);
    }
  }

  async signupStep_1(first_name: string, last_name: string, email: string, verify_code, pic) {

    let getUserData = await this.getAlreadyUser(email);

    if (getUserData && getUserData.email === email) {
      return {
        status: 200,
        ok: false,
        message: "Email already exist"
      };
    }
    else {

      const to = email;
      const subject = 'Email Verification';
      const message = `Your verification code is: ${verify_code}`;

      this.sendMail(to, subject, message)

      const user = new User();
      user.first_name = first_name;
      user.last_name = last_name;
      user.email = email;
      user.verify_code = verify_code;
      user.pic = pic;
      
      let getInsertData = await this.userRepository.save(user);

      return {
        status: 200,
        ok: true,
        data: {
          id: getInsertData.id,
          accessToken: await this.jwtService.signAsync(
            { sub: user.id },
            { secret: process.env.JWT_SECRET }
          )
        },
      };
    }
  }

  async signup_check_verify_code(id: number, verify_code: string) {

    let getDataFromUserTable = await this.checkVerificationCode(id);

    if (
      getDataFromUserTable.verify_code === verify_code && getDataFromUserTable.id === id
    ) {
      return {
        status: 200,
        ok: true,
        message: "your Verification is matched"
      };
    }
    else {
      return {
        status: 200,
        ok: false,
        message: "your Verification is not matched"
      };
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  async signupStep_2(id: string, user_name: string, password: string) {
    if(password.length < 8){
      return {
        status: 200,
        ok: false,
        message: "Your password must be in 8 character"
      };
    }

    let bcryptPassword = await this.hashPassword(password)    
    await this.userRepository.update(id, {user_name: user_name, password: bcryptPassword});

    return {
      status: 200,
      ok: true,
      message: "Username is save successfully"
    };
    

  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }


}
