import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User, { IUser } from '../models/userMod';  
import 'dotenv/config'; 
import { Error } from 'mongoose'; 
import jwt from 'jsonwebtoken';



require('dotenv').config();

passport.serializeUser((user: IUser, done) => {
  console.log('usuario serializado:', user);
  done(null, user.id);  
});

passport.deserializeUser((id: string, done: (err: Error | null, user?: IUser | null) => void) => {
  console.log('usuario deserializado:', id);
  User.findById(id, (err: Error | null, user: IUser | null) => {
    console.log('Usuario encontrado con ID:', user);
    done(err, user);
  });
});


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK,
  scope: ['profile', 'email']
}, (accessToken, refreshToken, profile, done) => {
  console.log('perfil recibido de la configuracion:', profile);
  process.nextTick(async () => {
    try {
      const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
      if (!email) {
        return done(new Error('No email found'), null);
      }

      let user = await User.findOne({ googleId: profile.id }) || await User.findOne({ email: email });
      if (!user) {
        user = new User({
          fullname: profile.displayName,
          username: email.split('@')[0],
          email: email,
          profilePicture: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : undefined,
          googleId: profile.id,
        });
        await user.save();
      }
      return done(null, user);
    } catch (err) {
      console.error('Error en la configuracion:', err);
      return done(err, null); 
    }
  });
}));







export default passport;