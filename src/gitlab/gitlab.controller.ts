import { Controller, Post, Req, Res, Logger } from '@nestjs/common';
import axios from 'axios';

@Controller('gitlab')
export class GitlabController {
  private readonly BOT_TOKEN = process.env.BOT_TOKEN;
  private readonly CHAT_ID = process.env.CHAT_ID;
  private readonly MY_USERNAME = process.env.MY_USERNAME;
  private readonly logger = new Logger(GitlabController.name);

  @Post()
  async handleWebhook(@Req() req, @Res() res) {
    const data = req.body;
    this.logger.log(`USER: ${this.MY_USERNAME}`)
    // Только события Merge Request
    if (data.object_kind === 'merge_request') {
      const mr = data.object_attributes;
      const reviewers = data.reviewers || [];

      // Проверяем: вас назначили reviewer?
      const assignedToMe = reviewers.some(r => r.username === this.MY_USERNAME);

      if (assignedToMe) {
        const title = mr.title;
        const url = mr.url;
        const author = data.user.username;

        const text =
          `📢 *Вас назначили ревьюером!*\n\n` +
          `*${title}*\n` +
          `Автор: \`${author}\`\n\n` +
          `${url}`;

        await axios.get(
          `https://api.telegram.org/bot${this.BOT_TOKEN}/sendMessage`,
          {
            params: {
              chat_id: this.CHAT_ID,
              text,
              parse_mode: 'Markdown'
            }
          }
        );
      }
    }

    return res.status(200).send('OK');
  }
}
