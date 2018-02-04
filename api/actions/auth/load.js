import { User } from '../../models/User';
import { parseToken } from '../../common/utils';

export default function load(req) {
  return new Promise((resolve, reject) => {
    if (req.cookies && req.cookies.accessToken) {
      console.log('>>>>>>>>>>>>>> api > actions > auth > load > YES! > req.cookies', req.cookies);
      let payload = {};
      try {
        payload = parseToken(req.cookies.accessToken);
      } catch (e) {
        console.log('>>>>>>>>>>>>>> api > actions > auth > load > YES! > req.cookies > Cookie NOT valid');
        reject(new Error('Cookie is not valid'));
      }

      console.log('>>>>>>>>>>>>>> api > actions > auth > load > YES! > req.cookies > Cookie IS valid');

      if (Math.round(new Date().getTime() / 1000) < payload.exp) {
        console.log('>>>>>>>>>>>>>> api > actions > auth > load > YES! > req.cookies > Cookie NOT expired!');
        User.findOne({ email: payload.sub.email }, (err, user) => {
          if (err) {
            console.log('>>>>>>>>>>>>>> api > actions > auth > load > User.findOne > ERROR!');
            reject(new Error('Something went wrong'));
            return;
          }

          if (!user) {
            console.log('>>>>>>>>>>>>>> api > actions > auth > load > User.findOne > User NOT found!');
            reject(new Error('User not found!'));
            return;
          }

          console.log('>>>>>>>>>>>>>> api > actions > auth > load > User.findOne > User IS found!', user);

          resolve({
            accessToken: req.cookies.accessToken,
            user: {
              fullName: user.fullName,
              email: user.email
            }
          });
        });
      } else {
        console.log('>>>>>>>>>>>>>> api > actions > auth > load > YES! > req.cookies > Cookie IS expired!');
        reject(new Error('Cookie expired!'));
      }
    } else {
      console.log('>>>>>>>>>>>>>> api > actions > auth > load > NO! > req.cookies', req.cookies);
      resolve({ isAnonymous: true });
    }
  });
}
