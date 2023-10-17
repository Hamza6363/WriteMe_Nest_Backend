import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat } from './entities/chat.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { UserPlan } from 'src/user_plans/entities/user_plan.entity';
import { Plan } from 'src/plans/entities/plan.entity';
import { UserUsage } from 'src/user_usage/entities/user_usage.entity';
import { Configuration, OpenAIApi, CreateCompletionRequest } from 'openai';

@Injectable()
export class ChatsService {

  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,

    @InjectRepository(UserPlan)
    private readonly userPlanRepository: Repository<UserPlan>,

    @InjectRepository(UserUsage)
    private readonly userUsageRepository: Repository<UserUsage>,

    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,

  ) { }

  async create(id, request) {
    const chat = new Chat()
    chat.user_id = id
    chat.title = (request.title !== undefined && request.title !== null && request.title !== '') ? request.title : '';

    let findChat = await this.chatRepository.findOne({ where: { user_id: request.id, title: request.title } })

    if (findChat == null) {
      await this.chatRepository.save(chat)

      return {
        ok: true,
        message: 'Chat Created Successfully'
      }
    }
    else {
      return {
        status: 200,
        ok: false,
        message: "Chat already exist"
      };
    }
  }

  async findAll(id) {
    const chats = await this.chatRepository.find({
      where: {
        user_id: id
      },
      order: {
        created_at: 'DESC',
      },
    })

    return {
      ok: true,
      chats: chats
    }
  }


  async getChat(userId: number, id: number) {

    let getChat = await this.chatRepository.find({ where: { user_id: userId, id: id } });

    return {
      status: 200,
      ok: true,
      result: getChat
    };
  }

  async findOne(id, request) {
    const chat = await this.chatRepository.findOne({
      where: {
        id: request.id
      }
    })

    return {
      ok: true,
      chat: chat
    }
  }

  async getGeneratedChat (userId: number, id: number) {
    let getChats = await this.chatRepository.find({ where: { id } });

    return {
      status: 200,
      ok: true,
      result: getChats
    };

  }

  async updateChat(user_id: number, id: number, title: string) {

    await this.chatRepository.update(id, { title: title });

    return {
      ok: true,
      status: 200,
      message: 'Chat Updated Successfully'
    }
  }

  async getAllow(userId, type = "article") {
console.log("here");
    console.log(type);

    let date = new Date();
    date.setDate(date.getDate() - 30);

    let getMember = await this.userPlanRepository
      .createQueryBuilder()
      .update(UserPlan)
      .set({ expired: 1 })
      .where('purchased_at < :date', { date })
      .andWhere('user_id = :user_id', { user_id: userId })
      .andWhere('plan_id != :plan_id', { plan_id: 13 });

    date = new Date();
    date.setDate(date.getDate() - 365);

    let getLifeTimeMember = await this.userPlanRepository
      .createQueryBuilder()
      .update(UserPlan)
      .set({ expired: 1 })
      .where('purchased_at < :date', { date })
      .andWhere('user_id = :user_id', { user_id: userId })
      .andWhere('plan_id = :plan_id', { plan_id: 13 });

    const balance = await this.userPlanRepository
      .createQueryBuilder('user_plans')
      .select('SUM(user_plans.credit_tabs) - SUM(user_plans.debit_tabs)', 'tabs_total')
      .addSelect('SUM(user_plans.credit_articles) - SUM(user_plans.debit_articles)', 'articles_total')
      .where('user_plans.user_id = :userId', { userId })
      .andWhere('user_plans.used = :used', { used: 0 })
      .andWhere('user_plans.expired = :expired', { expired: 0 })
      .groupBy('user_plans.user_id')
      .getRawOne();

    if (type === 'tab' && Number(balance.tabs_total) < 1 || type == 'article' && Number(balance.articles_total) < 1) {
      console.log("not balance available balance");
      return false
    }

    const userPlanObj = this.userPlanRepository.createQueryBuilder('user_plans')
      .where('user_plans.user_id = :userId', { userId: userId })
      .andWhere('user_plans.used = :used', { used: 0 })
      .andWhere('user_plans.expired = :expired', { expired: 0 })
      .andWhere('user_plans.invoice_payment_id != :invoice_payment_id', { invoice_payment_id: 1 })
      .select([
        'user_plans.user_id',
        'user_plans.debit_tabs',
        'user_plans.debit_articles',
        'user_plans.id',
        'user_plans.plan_id',
        `SUM(user_plans.credit_tabs) - SUM(user_plans.debit_tabs) AS tabs_total`,
        `SUM(user_plans.credit_articles) - SUM(user_plans.debit_articles) AS articles_total`,
      ]);


    if (type === 'tab') {
      userPlanObj.having('tabs_total > 0');
    } else {
      userPlanObj.having('articals_total > 0');
    }

    const userPlanObjPlans = await this.userPlanRepository.createQueryBuilder('user_plans').getOne();

    if (!userPlanObjPlans) {
      return false;
    }

    if (type === 'tab') {
      userPlanObjPlans.debit_tabs = userPlanObjPlans.debit_tabs ? userPlanObjPlans.debit_tabs + 1 : 1;
    } else {
      userPlanObjPlans.debit_articles = userPlanObjPlans.debit_articles ? userPlanObjPlans.debit_articles + 1 : 1;
    }

    await this.userPlanRepository.save(userPlanObjPlans);

    const planDetails = await this.planRepository.find({ where: { plan_id: userPlanObjPlans.plan_id } });

    const userUsage = new UserUsage();
    if (type === 'tab') {
      userUsage.tab = 1;
    } else {
      userUsage.article = 1;
    }
    userUsage.user_plan_id = userPlanObjPlans.id;
    userUsage.plan_id = userPlanObjPlans.plan_id;
    userUsage.plan_name = planDetails[0].name;
    await this.userUsageRepository.save(userUsage);

    return true;

  }

  async wordCount(str) {
    var wordCount = str.trim().split(/\s+/).length;
    return wordCount;
  }

  async updateUsage(userId, type, words) {

    if (type === "tab" && type === "article") {
      return { error: { message: 'article or tab usage update not mentioned' } };
    }

    let userPlanObj = await this.userPlanRepository
      .createQueryBuilder("user_plans")
      .where("user_plans.user_id = :user_id", { user_id: userId })
      .andWhere("user_plans.used = false")
      .andWhere("user_plans.expired = false")
      .andWhere("user_plans.invoice_payment_id IS NOT NULL")
      .select([
        'user_plans.user_id',
        'user_plans.debit_tabs',
        'user_plans.debit_articles',
        'SUM(user_plans.credit_tabs) - SUM(user_plans.debit_tabs) AS tabs_total',
        'SUM(user_plans.credit_articles) - SUM(user_plans.debit_articles) AS articles_total',
        'user_plans.id',
        'user_plans.plan_id'
      ]);

    const userUsage = new UserUsage();
    if (type === 'tab') {
      userUsage.tab = 1;
      userPlanObj.having('tabs_total > 0');
    } else if (type === 'article') {
      userUsage.article = words;
      userPlanObj.having('articles_total > 0');
    }

    let plan = await userPlanObj.getRawOne();

    if (type === 'tab') {
      plan.user_plans_debit_tabs = plan.user_plans_debit_tabs ? plan.user_plans_debit_tabs + 1 : 1;
    } else if (type === 'article') {
      plan.user_plans_debit_articles = plan.user_plans_debit_articles ? plan.user_plans_debit_articles + words : words;
    }

    // await this.userPlanRepository.save(plan);

    const planDetails = await this.planRepository.findOne({ where: { id: plan.plan_id } });


    userUsage.user_plan_id = plan.id;
    userUsage.plan_id = plan.plan_id;
    userUsage.plan_name = planDetails.name;
    // user.usage = userUsage;

    const balance = await this.userPlanRepository
      .createQueryBuilder('user_plans')
      .where('user_plans.user_id = :userId', { userId })
      .andWhere("user_plans.used = :used AND user_plans.expired = :expired", { used: 0, expired: 0 })
      .select([
        'user_plans.user_id',
        'SUM(user_plans.credit_tabs) - SUM(user_plans.debit_tabs) AS tabs_total',
        'SUM(user_plans.credit_articles) - SUM(user_plans.debit_articles) AS articles_total'
      ])
      .groupBy('user_plans.user_id')
      .getRawOne();

    const data = {
      articles_total: balance.articles_total,
      tabs_total: balance.tabs_total,
    };

    const response = {
      success: { usage: { ...data, tabs: data.tabs_total > 0, articles: data.articles_total > 0 } },
    };

    return response;
  }

  async chatTurbo(id:number, text:string, usecase:string) {

    let getArticleResponse = await this.getAllow(id, "article");
    

    if (getArticleResponse) {

      let messages = text;

      var createCompletionParam = {
        ChatCall: {
          model: "gpt-4",
          messages: messages,
        },
        timeout: 500000,
      };

      let parameters = {
        model: createCompletionParam[usecase].model,
        messages: createCompletionParam[usecase].messages,
      };

      const configuration = new Configuration({
        apiKey: process.env.OPENAI_KEY,
      });

      const openai = new OpenAIApi(configuration);
      console.log(openai);
      var chatreply = '';

      let OpenAICall = await openai.createChatCompletion(parameters).then(async (response) => {

        chatreply = response.data.choices[0].message.content;
        var WordCounter = await this.wordCount(chatreply);
        await this.updateUsage(id, "article", WordCounter);
        var data = {
          data: chatreply,
          words: WordCounter,
        };

        return data;
      });

      return OpenAICall;
    }
    else {
      return {
        status: 200,
        ok: false,
        message: "balance exhausted"
      };
    }

    // const chat = await this.chatRepository.findOne({
    //   where: {
    //     id: request.id
    //   }
    // })

    // chat.chat = (request.chat !== undefined && request.chat !== null && request.chat !== '') ? request.chat : ''

    // await this.chatRepository.save(chat)

    // const updatedChat = await this.chatRepository.findOne({
    //   where: {
    //     id: request.id
    //   }
    // })

    // return {
    //   ok: true,
    //   chat: updatedChat
    // }
  }
  async chatAPI(id:number, text:string, usecase:string) {
    

    let getArticleResponse = await this.getAllow(id, "article");
    

    if (getArticleResponse) {

      let messages = text;
      
      var createCompletionParam = {
        ChatCall: {
          model: "gpt-3.5-turbo",
          messages: messages,
        }
      };

      let parameters = {
        model: createCompletionParam[usecase].model,
        messages: createCompletionParam[usecase].messages,
      };

      const configuration = new Configuration({
        apiKey: process.env.OPENAI_KEY,
      });

      const openai = new OpenAIApi(configuration);

      var chatreply = '';

      let OpenAICall = await openai.createChatCompletion(parameters).then(async (response) => {
        console.log(response);

        chatreply = response.data.choices[0].message.content;
        console.log(chatreply);

        var WordCounter = await this.wordCount(chatreply);
        console.log(WordCounter);

        await this.updateUsage(id, "article", WordCounter);
        var data = {
          data: chatreply,
          words: WordCounter,
        };

        return data;
      });
      console.log(OpenAICall);

      return OpenAICall;
    }
    else {
      return {
        status: 200,
        ok: false,
        message: "balance exhausted"
      };
    }
  }

  async chatSave(user_id: number, id: number, chat: string) {

    await this.chatRepository.update(id, { chat: chat });

    return {
      ok: true,
      status: 200,
      message: 'Chat Updated Successfully'
    }
  }

  async deleteChat(user_id, id) {
    const date = new Date();
    let time = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)) + "-" + ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);

    await this.chatRepository.update(id, { deleted_at: time });

    return {
      status: 200,
      ok: true,
      message: "Chat deleted successfully"
    };

  }
}