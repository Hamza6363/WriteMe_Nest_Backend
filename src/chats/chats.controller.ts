import { Controller, Get, Req, Res, UseGuards, Request, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { AuthGuard } from 'src/auths/auths.guard';
import { request } from 'http';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) { }

  @UseGuards(AuthGuard)
  @Post('createChat')
  async create(@Request() request) {
    const id = request.user.sub
    return await this.chatsService.create(id, request.body)
  }

  @UseGuards(AuthGuard)
  @Get('getChats')
  async findAll(@Request() request) {
    const id = request.user.sub
    return await this.chatsService.findAll(id);
  }

  @UseGuards(AuthGuard)
  @Post('getChat')
  async getChat(@Req() req, @Res() res, @Body() body) {
    await this.chatsService.getChat(req.user.sub, body.chat_id)
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
  @Post('updateChat')
  async updateChat(@Req() req, @Res() res, @Body() body) {
    await this.chatsService.updateChat(req.user.sub, body.id, body.title)
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
  @Post('get-generated-Chat')
  async getGeneratedChat(@Req() req, @Res() res, @Body() body) {
    await this.chatsService.getGeneratedChat(req.user.sub, body.chat_id)
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
  @Post('chat-turbo')
  async chatTurbo(@Req() req, @Res() res, @Body() body) {

    await this.chatsService.chatTurbo(req.user.sub, body.messages, body.usecase)
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
  @Post('chatSave')
  async chatSave(@Req() req, @Res() res, @Body() body) {
    
    await this.chatsService.chatSave(req.user.sub, body.chat_id, body.chat)
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
  @Post('chat-api')
  async chatAPI(@Req() req, @Res() res, @Body() body) {

    await this.chatsService.chatAPI(req.user.sub, body.messages, body.usecase)
      .then(response => {
        return res.status(200).json({
          status: 200,
          response,
        });
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
  @Post('deleteChat')
  async deleteChat(@Req() req, @Res() res, @Body() body) {

    this.chatsService.deleteChat(req.user.sub, body.id)
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
}