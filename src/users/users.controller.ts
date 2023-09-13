import { Controller, Get, Req, Res, UseGuards, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/auths/auths.guard';


@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('signupStep-1')
  @UsePipes(new ValidationPipe())
  async signupStep_1(@Req() req, @Res() res, @Body() body, createUserDto: CreateUserDto) {

    let verify_code = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
    let pic = "default.png";
    await this.usersService.signupStep_1(
      body.first_name,
      body.last_name,
      body.email,
      verify_code,
      pic
    )
      .then(response => {
        return res.status(200).json({ response });
      })
      .catch(error => {
        return res.status(500).json({
          status: 500,
          code: 'error',
          message: 'An error occurred.',
        });
      });
  }

  @Post('signup-verification')
  @UsePipes(new ValidationPipe())
  async signup_verification(@Req() req, @Res() res, @Body() body, createUserDto: CreateUserDto) {

    await this.usersService.signup_check_verify_code(body.id, body.verify_code)
      .then(response => {
        return res.status(200).json({ response });
      })
      .catch(error => {
        return res.status(500).json({
          status: 500,
          code: 'error',
          message: 'An error occurred.',
        });
      });
  }

  @Post('signupStep-2')
  @UsePipes(new ValidationPipe())
  async signupStep_2(@Req() req, @Res() res, @Body() body, createUserDto: CreateUserDto) {

    await this.usersService.signupStep_2(
      body.id,
      body.user_name,
      body.password
    )
      .then(response => {
        return res.status(200).json({ response });
      })
      .catch(error => {
        return res.status(500).json({
          status: 500,
          code: 'error',
          message: 'An error occurred.',
        });
      });
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Req() req, @Res() res, @Body() body, createUserDto: CreateUserDto) {

    await this.usersService.login(
      body.email,
      body.password
    )
      .then(response => {
        return res.status(200).json({ response });
      })
      .catch(error => {
        return res.status(500).json({
          status: 500,
          code: 'error',
          message: 'An error occurred.',
        });
      });
  }

  @Post('email-verification')
  @UsePipes(new ValidationPipe())
  async email_verification(@Req() req, @Res() res, @Body() body, createUserDto: CreateUserDto) {

    let verify_code = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);

    await this.usersService.email_verification(body.email, verify_code)
      .then(response => {
        return res.status(200).json({ response });
      })
      .catch(error => {
        return res.status(500).json({
          status: 500,
          code: 'error',
          message: 'An error occurred.',
        });
      });
  }

  @Post('email-verification-code')
  @UsePipes(new ValidationPipe())
  async email_verification_code(@Req() req, @Res() res, @Body() body, createUserDto: CreateUserDto) {

    await this.usersService.email_verification_code(body.id, body.verify_code)
      .then(response => {
        return res.status(200).json({ response });
      })
      .catch(error => {
        return res.status(500).json({
          status: 500,
          code: 'error',
          message: 'An error occurred.',
        });
      });
  }

  @Post('login-reset-password')
  @UsePipes(new ValidationPipe())
  async login_reset_password(@Req() req, @Res() res, @Body() body, createUserDto: CreateUserDto) {

    await this.usersService.reset_password(body.id, body.password)
      .then(response => {
        return res.status(200).json({ response });
      })
      .catch(error => {
        return res.status(500).json({
          status: 500,
          code: 'error',
          message: 'An error occurred.',
        });
      });
  }

  @Post('signup-social-register')
  @UsePipes(new ValidationPipe())
  async signup_social_register(@Req() req, @Res() res, @Body() body, createUserDto: CreateUserDto) {

    await this.usersService.signup_social_register(body.first_name, body.last_name, body.user_name, body.email, body.password, body.token_for_business, body.login_type)
      .then(response => {
        return res.status(200).json({ response });
      })
      .catch(error => {
        return res.status(500).json({
          status: 500,
          code: 'error',
          message: 'An error occurred.',
        });
      });
  }

  @Post('login-social-register')
  @UsePipes(new ValidationPipe())
  async login_social_register(@Req() req, @Res() res, @Body() body, createUserDto: CreateUserDto) {

    await this.usersService.login_social_register(body.first_name, body.last_name, body.user_name, body.email, body.password, body.token_for_business, body.login_type)
      .then(response => {
        return res.status(200).json({ response });
      })
      .catch(error => {
        return res.status(500).json({
          status: 500,
          code: 'error',
          message: 'An error occurred.',
        });
      });
  }

  @UseGuards(AuthGuard)
  @Get('getApiFilePath')
  async getToken(@Req() req, @Res() res) {
    await this.usersService.getApiFilePath()

      .then(response => {
        return res.status(200).json({
          status: 200,
          response,
        });
      })
      .catch(error => {
        // Handle error
        return res.status(500).json({
          status: 500,
          code: 'error',
          message: 'An error occurred.',
        });
      });
  }

  @UseGuards(AuthGuard)
  @Get('user-subscription')
  async user_subscription(@Req() req, @Res() res) {
    await this.usersService.user_subscription(req.user.sub)

      .then(response => {
        return res.status(200).json({
          status: 200,
          response,
        });
      })
      .catch(error => {
        // Handle error
        return res.status(500).json({
          status: 500,
          code: 'error',
          message: 'An error occurred.',
        });
      });
  }

  @UseGuards(AuthGuard)
  @Post('article-generate')
  async article_generate(@Req() req, @Res() res, @Body() body) {

    await this.usersService.article_generate(req.user.sub, req)
      .then(response => {
        return res.status(200).json({
          status: 200,
          response,
        });

      })
      .catch(error => {
        // Handle error
        return res.status(500).json({
          status: 500,
          code: 'error',
          message: 'An error occurred.',
        });
      });
  }

  @UseGuards(AuthGuard)
  @Post('set-latest-article')
  async set_latest_article(@Req() req, @Res() res, @Body() body) {

    await this.usersService.set_latest_article(req.user.sub, body.article_id)
      .then(response => {
        return res.status(200).json({
          status: 200,
          response,
        });
      })
      .catch(error => {
        // Handle error
        return res.status(500).json({
          status: 500,
          code: 'error',
          message: 'An error occurred.',
        });
      });
  }

  @UseGuards(AuthGuard)
  @Get('get-latest-article')
  async get_latest_article(@Req() req, @Res() res, @Body() body) {

    await this.usersService.get_latest_article(req.user.sub)
      .then(response => {
        return res.status(200).json({
          status: 200,
          response,
        });
      })
      .catch(error => {
        // Handle error
        return res.status(500).json({
          status: 500,
          code: 'error',
          message: 'An error occurred.',
        });
      });
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
