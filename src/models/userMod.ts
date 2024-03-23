import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
  fullname: string;
  username: string;
  email: string;
  password: string;
  description: string;
  profilePicture: string;
  cvLink: string;
  interests: string[];
  role: string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  fullname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  profilePicture: {
    type: String,
    required: false
  },
  cvLink: {
    type: String,
    required: false
  },
  interests: {
    type: [String],
    required: false
  },
  role: {  
    type: String,
    required: true,
    default: 'user' 
  }
});

userSchema.pre<IUser>('save', async function (next) {
  if (this.isModified('password')) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
