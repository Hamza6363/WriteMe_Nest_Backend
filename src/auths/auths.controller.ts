import { Controller, Get, Req, Res, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auths')
export class AuthsController {
  constructor(private readonly authsService: AuthsService) { }

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authsService.create(createAuthDto);
  }


  @Post('login')
  async login(@Req() req, @Res() res) {
    
    const user = req.body
    await this.authsService.login(user)
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
    return this.authsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authsService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authsService.remove(+id);
  }
}
