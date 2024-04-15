import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User, { IUser } from '../models/userMod';  
import 'dotenv/config'; 
import { Error } from 'mongoose'; 
import jwt from 'jsonwebtoken';



require('dotenv').config();
console.log('Callback URL:', process.env.GOOGLE_CALLBACK);


passport.serializeUser((user: IUser, done) => {
  console.log('Serializing user:', user);
  done(null, user.id);  
});

passport.deserializeUser((id: string, done: (err: Error | null, user?: IUser | null) => void) => {
  console.log('Deserializing user by ID:', id);
  User.findById(id, (err: Error | null, user: IUser | null) => {
    console.log('User found by ID:', user);
    done(err, user);
  });
});


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK,
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  console.log('Received Google profile:', profile);
  try {
    let user = await User.findOne({ email: profile.emails[0].value });

    if (!user) {
      console.log('No existing user, creating new user...');
      user = new User({
        fullname: profile.displayName,
        username: profile.emails[0].value.split('@')[0],
        email: profile.emails[0].value,
        profilePicture: profile.photos[0]?.value,
        googleId: profile.id,
      });

      await user.save();
      console.log('New user created:', user);
    }

    console.log('User found or created:', user);
    done(null, user); 
  } catch (err) {
    console.error('Error in Google Strategy:', err);
    done(err, null); 
  }
}));




export default passport;