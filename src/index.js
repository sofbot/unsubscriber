import chalk from 'chalk';
import { authorize } from './auth';
import { getUnsubscribeList } from './util';

export const setup = async () => {
  try {
        const oAuth2Client = await authorize();
        const data = await getUnsubscribeList(oAuth2Client);
        console.log(chalk.bold.green('Unsubscribe-able lists:'))
        data.map(result => {
          const { sender, email, link } = result;
          console.log(
            chalk.bold(`${sender}`) +
            ':' +
            '\n' +
            '\t' +
            chalk.red(`${email ? `email: ${email}` : ''}`) +
            '\n' +
            '\t' +
            chalk.red(`${link ? `link: ${link}` : ''}`)
          );
        })
    }
    catch (err) {
        console.log(err)
    }
}

setup();