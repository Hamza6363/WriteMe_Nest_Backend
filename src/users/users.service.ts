import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { UserPlan } from 'src/user_plans/entities/user_plan.entity';
import { UserUsage } from 'src/user_usage/entities/user_usage.entity';
import { Plan } from 'src/plans/entities/plan.entity';
import { Project } from 'src/projects/entities/project.entity';
import * as bcrypt from 'bcrypt';
import { OauthAccessToken } from '../oauth_access_tokens/entities/oauth_access_token.entity';
import axios from 'axios';
import { AxiosRequestConfig } from 'axios';
import { Configuration, OpenAIApi, CreateCompletionRequest } from 'openai';



@Injectable()
export class UsersService {
  private transporter: nodemailer.Transporter;
  private openai: OpenAIApi;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,

    @InjectRepository(OauthAccessToken)
    private readonly OauthAccessTokenRepository: Repository<OauthAccessToken>,

    @InjectRepository(UserPlan)
    private readonly userPlanRepository: Repository<UserPlan>,

    @InjectRepository(UserUsage)
    private readonly userUsageRepository: Repository<UserUsage>,

    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>

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
      status: 200,
      ok: true,
      data: {
        url: process.env.BACKEND_BASEURL + '/public/storage/uploads/'
      }
    }
  }

  async getAlreadyUser(email) {
    return this.userRepository.findOne({ where: { email } })
  }

  async checkVerificationCode(id) {
    return this.userRepository.findOne({ where: { id } })
  }

  async filterById(id) {
    return this.userRepository.findOne({ where: { id } })
  }

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


      const apiUrl = 'https://backend.writeme.ai/amember/api/users';

      const data = {
        _key: 'VOdigxYoFL0cvyIcCE58',
        login: email, 
        pass: '0000',
        email,
        name_f: first_name,
        name_l: last_name,
        status: 'active',
      };

      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };

      await axios.post(apiUrl, new URLSearchParams(data).toString(), config);

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

      let accessToken = await this.jwtService.signAsync(
        { sub: getInsertData.id },
        { secret: process.env.JWT_SECRET }
      );


      const oauth = new OauthAccessToken();
      oauth.token_id = accessToken;
      oauth.name = "MyApp";
      oauth.scopes = '[]';
      oauth.client_id = 1;
      oauth.user_id = getInsertData.id;

      const addOauthTokenAccess = await this.OauthAccessTokenRepository.save(oauth);


      const project = new Project();
      project.user_id = getInsertData.id;
      project.title = "Default Project";

      await this.projectRepository.save(project);

      return {
        status: 200,
        ok: true,
        data: {
          id: getInsertData.id,
          accessToken: accessToken
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

  async email_verification(email: string, verify_code: number) {

    let getUserData = await this.findByEmail(email);


    if (getUserData === null) {
      return {
        status: 200,
        ok: false,
        message: "This account is not exist"
      };
    }
    if (getUserData.email === email) {

      const to = email;
      const subject = 'Email Verification';
      const message = `Your verification code is: ${verify_code}`;

      await this.sendMail(to, subject, message);

      return {
        status: 200,
        ok: true,
        data: {
          id: getUserData.id
        },
      };
    }
  }

  async email_verification_code(id: number, verify_code: string) {

    let getDataFromUserTable = await this.checkVerificationCode(id);

    if (getDataFromUserTable === null) {
      return {
        status: 200,
        ok: false,
        message: "Please enter a correct user id"
      };
    }
    if (getDataFromUserTable.verify_code !== verify_code) {
      return {
        status: 200,
        ok: true,
        message: "This account is verified"
      };
    }
    if (getDataFromUserTable.verify_code === verify_code) {
      return {
        status: 200,
        ok: true,
        message: "This account is verified"
      };
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  async signupStep_2(id: string, user_name: string, password: string) {
    if (password.length < 8) {
      return {
        status: 200,
        ok: false,
        message: "Your password must be in 8 character"
      };
    }

    let bcryptPassword = await this.hashPassword(password)
    await this.userRepository.update(id, { user_name: user_name, password: bcryptPassword });

    return {
      status: 200,
      ok: true,
      message: "Username is save successfully"
    };
  }

  async signup_social_register(first_name: string, last_name: string, user_name: string, email: string, password: string, token_for_business: string, login_type: string) {

    let getUserData = await this.getAlreadyUser(email)

    if (getUserData && getUserData.email === email) {
      return {
        status: 200,
        ok: false,
        message: "Email already exist"
      };
    }
    else {
      let bcryptPassword = await this.hashPassword(password);

      const user = new User();
      user.first_name = first_name;
      user.last_name = last_name;
      user.user_name = user_name;
      user.email = email;
      user.password = bcryptPassword;
      user.token_for_business = token_for_business;
      user.login_type = login_type;

      let getInsertData = await this.userRepository.save(user);

      return {
        status: 200,
        ok: true,
        message: "User create successfully"
      };
    }
  }

  async reset_password(id: number, password: string) {

    let bcryptPassword = await this.hashPassword(password);
    await this.userRepository.update(id, { password: bcryptPassword });

    return {
      status: 200,
      ok: true,
      message: "your password is update successfully"
    };
  }

  async login(email: string, password: string) {

    let getUserData = await this.findByEmail(email);

    if (getUserData && getUserData.email === email && bcrypt.compareSync(password, getUserData.password)) {
      let accessToken = await this.jwtService.signAsync(
        { sub: getUserData.id },
        { secret: process.env.JWT_SECRET }
      );
      return {
        status: 200,
        ok: true,
        data: {
          id: getUserData.id,
          accessToken: accessToken,
          pic: getUserData.pic
        }
      };
    }
    else {
      return {
        status: 200,
        ok: false,
        message: "Invalid credential"
      };
    }
  }

  async login_social_register(first_name: string, last_name: string, user_name: string, email: string, password: string, token_for_business: string, login_type: string) {

    let getUserData = await this.getAlreadyUser(email)

    if (getUserData && getUserData.email === email && bcrypt.compareSync(password, getUserData.password)) {
      return {
        status: 200,
        ok: true,
        message: "Valid Credential"
      };
    }
    else {
      return {
        status: 200,
        ok: false,
        message: "Invalid credential"
      };
    }
  }

  async user_subscription(id: number) {

    let getUserData = await this.filterById(id);

    let getUserSubscription = await axios.get(process.env.AMEMBER_BASEURL + '/check-access/by-email?_key=' + process.env.AMEMBER_KEY + '&email=khubaib@siliconwebteam.com')
    

    let getUserSubscriptionId = Object.keys(getUserSubscription.data.subscriptions);

    let getaMemberProducts = await axios.get(process.env.AMEMBER_BASEURL + '/products?_key=' + process.env.AMEMBER_KEY)
    let getaMemberProductsList = getaMemberProducts.data;

    var currentSubscriptionPlan = [];

    getUserSubscriptionId.forEach(item => {

      for (let i = 0; i <= getaMemberProductsList["_total"] - 1; i++) {

        if (getaMemberProductsList[i]["product_id"] == item) {
          currentSubscriptionPlan.push({ id: item, title: getaMemberProductsList[i]["title"] });
        }
      }

    });

    return {
      status: 200,
      ok: true,
      data: { currentSubscriptionPlan }
    };
  }

  async getAllow(userId, type) {

    let date = new Date();
    date.setDate(date.getDate() - 30);

    await this.userPlanRepository
      .createQueryBuilder()
      .update(UserPlan)
      .set({ expired: 1 })
      .where('purchased_at < :date', { date })
      .andWhere('user_id = :user_id', { user_id: userId })
      .andWhere('plan_id != :plan_id', { plan_id: 13 });

    date = new Date();
    date.setDate(date.getDate() - 365);

    await this.userPlanRepository
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
      return false
    }

    const userPlanObj = this.userPlanRepository.createQueryBuilder('user_plans')
      .where('user_plans.user_id = :userId', { userId: userId })
      .andWhere('user_plans.used = :used', { used: 0 })
      .andWhere('user_plans.expired = :expired', { expired: 0 })
      .andWhere('user_plans.invoice_payment_id != :invoice_payment_id', { invoice_payment_id: 0 })
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
    var wordCount = str.match(/(\w+)/g).length;
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

    await this.userPlanRepository.save(plan);

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

  async article_generate(userId: number, req: string[]) {
    await this.getAllow(11, req['body'].type)
      // await this.getAllow(userId, req['body'].type)


      .then(function (result) {

        if (result) {

          var a = req['body'].keywords,
            r = req['body'].keywords2,
            i = req['body'].productName,
            p = req['body'].productName2,
            o = req['body'].tone,
            s = req['body'].language,
            l = req['body'].copy,
            c = req['body'].text,
            d = req['body'].type,
            y = {

              AdsforSocialMedia: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write social media ads for given keywords and description." },
                { "role": "user", "content": `Translate this in ${s}. Write ${o} ad to run on social media for the following keywords ${a} and product description ${i}.` }],
              },
              AdsforGoogleSearch: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write ads to run on search engines for given keywords and description." },
                { "role": "user", "content": `Translate this in ${s}. Write ${o} ad to run on search engines for following keywords ${a} and product description ${i}.` }],

              },
              AdandPostCaptionIdeas: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write social media post captions for given idea." },
                { "role": "user", "content": `Translate this in ${s}. Write ${o} ad or post caption for the following idea ${i}.` }],
              },
              AppTitle: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write google play store app title for given keywords and description." },
                { "role": "user", "content": `Translate this in ${s}. Write ${o} google play store app title for following keywords ${a} and product description ${i}.` }],
              },
              AppShortDescription: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write google play store app short description for given keywords and description." },
                { "role": "user", "content": `Translate this in ${s}. Write ${o} google play store app short description for following keywords ${a} and product description ${i}.` }],
              },
              AppLongDescription: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write google play store app long description for given keywords and description." },
                { "role": "user", "content": `Translate this in ${s}. Write ${o} google play store app long description for following keywords ${a} and product description ${i}.` }],
              },
              BiddingProposalDescription: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write bidding proposal for given details." },
                { "role": "user", "content": `Translate this in ${s}. Write ${o} bidding proposal for freelance websites with following details ${i}.` }],
              },
              BlogIdea: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write article heading for given keywords." },
                { "role": "user", "content": `Translate this in ${s}. Write an article heading for following keywords ${a}.` }],
              },
              BlogOutline: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write article outline for given topic." },
                { "role": "user", "content": `Translate this in ${s}. Write an article outline for following topic ${i}.` }],
              },
              BlogSectionWriting: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write section paragraph for given topic and keywords ." },
                { "role": "user", "content": `Translate this in ${s}. Write a detailed paragraph in ${o} tone for following topic ${i} and keywords ${a}.` }],
              },
              BlogPostIntroduction: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write article introduction paragraph for given topic." },
                { "role": "user", "content": `Translate this in ${s}. Write an article introduction paragraph in ${o} tone for following topic ${i}.` }],
              },
              BlogPostConclusion: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write article conclusion paragraph for given topic." },
                { "role": "user", "content": `Translate this in ${s}. Write an article conclusion paragraph in ${o} tone for following topic ${i}.` }],
              },
              BrandName: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write list of brand names for given brand description." },
                { "role": "user", "content": `Translate this in ${s}. Write a ${o} list of brand names where brand description is ${i}.` }],
              },
              BusinessIdeaPitch: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write business idea pitch for given business idea." },
                { "role": "user", "content": `Translate this in ${s}. Write ${o} business idea pitch where business idea is ${i}.` }],
              },
              BusinessIdeas: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write business idea for given interest and skills." },
                { "role": "user", "content": `Translate this in ${s}. Write ${o} business idea where interest is ${a} and skills are ${i}.` }],
              },
              CalltoAction: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write call to action for given description." },
                { "role": "user", "content": `Translate this in ${s}. Write ${o} call to action for the following description ${i}.` }],
              },
              CopywritingFrameworkAIDA: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write AIDA writing framework for given description." },
                { "role": "user", "content": `Translate this in ${s}. Write ${o} AIDA writing framework for following product description ${i}.` }],
              },
              CopywritingFrameworkPAS: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write PAS writing framework for given description." },
                { "role": "user", "content": `Translate this in ${s}. Write ${o} PAS writing framework for following product description ${i}.` }],
              },
              WebsiteCopy: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write website copy for given website name, website about. website product and brand description" },
                { "role": "user", "content": `Translate this in ${s}. Write ${o} website copy where website name ${a}, website about ${r}, and website product or brand description ${i}.` }],
              },
              Email: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write email for given key points." },
                { "role": "user", "content": `Translate this in ${s}. Write ${o} email for following key points ${i}.` }],
              },
              EmailWritingSequence: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write Email sequences that I should send to my users/customers within one month for given business." },
                { "role": "user", "content": `Translate this in ${s}. Write ${o} 10 Email sequences that I should send to my users/customers within one month for my following business ${i}.` }],
              },
              GigDescription: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write gig description for given title ans skills." },
                { "role": "user", "content": `Translate this in ${s}. Write a ${o} gig description for following title ${a} and skills ${i}.` }],
              },
              GrammarImprove: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write a correct standard english." },
                { "role": "user", "content": `Translate this in ${s}. Correct this to standard English:\n\n ${i}.` }],
              },
              GrammarRephrase: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write a Rephrase standard English" },
                { "role": "user", "content": `Translate this in ${s}. Rephrase this to standard English:\n\n ${i}. ` }],
              },
              GrammarExpand: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write detailed paragraph for given topic." },
                { "role": "user", "content": `Translate this in ${s}. Write a detailed paragraph in ${o} tone for following topic:\n\n ${i} ` }],
              },
              GrammarShorten: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that summarize given text in standard English." },
                { "role": "user", "content": `Translate this in ${s}. Summarize this text in standard English:\n\n ${i}.` }],
              },
              GrammarAppend: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that suggest two more lines for given text." },
                { "role": "user", "content": `Translate this in ${s}. Suggest two more lines for this text in standard English:\n\n ${i}.` }],
              },
              Interview: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write list of interview questions with persons professional bio and interview context." },
                { "role": "user", "content": `Translate this in ${s}. Write ${o} list of interview questions where persons professional bio is ${i}. And interview context is ${p}.` }],
              },
              JobDescription: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write job description for the given role." },
                { "role": "user", "content": `Translate this in ${s}. Create ${o} job description for the following role ${a}.` }],
              },
              MagicCommand: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that helps user with given details." },
                { "role": "user", "content": `Translate this in ${s}. Use ${o} tone, ${i}.` }],
              },
              ChatGPT: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant." },
                { "role": "user", "content": `${i}` }],
              },
              PostandCaptionIdeas: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write introduction text and title for post idea." },
                { "role": "user", "content": `Translate this in ${s}. Write ${o} introduction text and title for the following post idea: ${a}.` }],
              },
              productdescription: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write product description for product name and description." },
                { "role": "user", "content": `Translate this in ${s}. Write ${o} product description for following details product name: ${a} about the product: ${i}.` }],
              },
              ProfileBio: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write profile bio for given detials." },
                { "role": "user", "content": `Translate this in ${s}. Write ${o} profile bio for ${i}.` }],
              },
              Poetry: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write poetry for given idea." },
                { "role": "user", "content": `Translate this in ${s}. Write ${o} poetry for the following idea: ${i}.` }],
              },
              QuestionandAnswer: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that answer the questions." },
                { "role": "user", "content": `Translate this in ${s}. ${i}.` }],
              },
              ReplytoReviewsandMessages: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write reply to a message for given message." },
                { "role": "user", "content": `Translate this in ${s}. Write ${o} reply for the following message: ${i}.` }],
              },
              SEOMetaDescription: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write search engine optimised 160 alphabet characters description for given title." },
                { "role": "user", "content": `Translate this in ${s}. Write 160 alphabet characters ${o} description for the following title: ${i}.` }],
              },
              SEOMetaTitle: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write search engine optimised 60 alphabet characters title for given keywords." },
                { "role": "user", "content": `Translate this in ${s}. Write 60 alphabet characters ${o} title for the following keywords: ${a}.` }],
              },
              SMSandNotification: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write 160 alphabet characters short message as sms for given context." },
                { "role": "user", "content": `Translate this in ${s}. Write ${o} short message as sms for the following context: ${i}.` }],
              },
              SongLyrics: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write song lyrics for given idea." },
                { "role": "user", "content": `Translate this in ${s}. Write ${o} song lyrics for the following song idea: ${i}.` }],
              },
              StoryPlot: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write story plot for given idea." },
                { "role": "user", "content": `Translate this in ${s}. Write ${o} story plot for the following story idea: ${i}.` }],
              },
              TaglineandHeadline: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write tag line and head line for given description." },
                { "role": "user", "content": `Translate this in ${s}. Write ${o} tag line and head line for the following description: ${i}.` }],

              },
              TestimonialandReview: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write testimonial or review for given product title and keywords." },
                { "role": "user", "content": `Translate this in ${s}. Create ${o} review or testimonial for the following product title: ${i} where focused keywords are: ${a}.` }],
              },
              VideoChannelDescription: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write video channel description for given title." },
                { "role": "user", "content": ` Translate this in ${s}. Write ${o} channel description for the following channel purpose: ${i}.` }],
              },
              VideoDescription: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write video description for given title." },
                { "role": "user", "content": ` Translate this in ${s}. Write ${o} video description for the following video title: ${i}` }],

              },
              VideoIdea: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that write video idea for given keyword." },
                { "role": "user", "content": `Translate this in ${s}. Write ${o} video idea for the following keywords: ${a}` }],
              },
              tab: {
                model: "gpt-4",
                messages: [{ "role": "system", "content": "You are a helpful assistant that suggest next few lines for given text." },
                { "role": "user", "content": `Translate this in ${s}. Suggest few lines ${o} for the following paragraph: ${a}` }],
              },
            };

          let parameters = {
            model: y[d].model,
            messages: y[d].messages,
          };

          const configuration = new Configuration({
            apiKey: process.env.OPENAI_KEY,
          });

          const openai = new OpenAIApi(configuration);
          var chatreply = '';
          openai.createChatCompletion(parameters).then((response) => {
            chatreply = response.data.choices[0].message.content;

            // console.log(chatreply);
            // var WordCounter = wordCount(chatreply);
            // updateAIUsage(WordCounter, req);
            // var data = {
            //   data: chatreply,
            //   words: WordCounter,
            // };
            // res.status(200).send(data);
          });
          // checkusage = false;
        }
        else {
          return {
            status: 200,
            ok: false,
            message: "balance exhausted"
          };
        }
      })

    // console.log(await this.updateUsage(userId, req['body'].type, "Lorem Ipsum is simply dummy text of the printing and typesetting industry."));
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
