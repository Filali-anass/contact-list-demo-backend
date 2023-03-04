import { Strategy, ExtractJwt } from "passport-jwt";
import User from "../model/User.js";

export const config = {
  passport: {
    secret: "jcskdcbjksdcsdcs",
    expiresIn: 10000,
  },
};

const applyPassportStrategy = (passport) => {
  const options = {};
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  options.secretOrKey = config.passport.secret;
  passport.use(
    new Strategy(options, async (payload, done) => {
      const user = await User.findOne({ email: payload.email });
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
  );
};

export default applyPassportStrategy;
