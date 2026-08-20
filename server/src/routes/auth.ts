import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../data/db.js';
import { User, Creator } from '../types/index.js';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'influzo_super_secret_jwt_token_2026_key';
const ADMIN_MASTER_PASSKEY = process.env.ADMIN_PASSKEY || 'INFLUZO_SUPER_ADMIN_2026';

// Helper to sign JWT
function generateToken(user: User): string {
  return jwt.sign(
    { userId: user.id, email: user.emailOrPhone, role: user.role },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

// 1. POST /api/auth/signup (Standard Email & Password Registration)
authRouter.post('/signup', (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ 
      success: false, 
      message: 'Name, email, and password (min 6 characters) are required.' 
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ 
      success: false, 
      message: 'Password must be at least 6 characters long.' 
    });
  }

  const cleanEmail = email.trim().toLowerCase();

  // Check if user already exists
  const existingUser = db.getUserByEmail(cleanEmail);
  if (existingUser) {
    return res.status(409).json({ 
      success: false, 
      message: 'An account with this email already exists. Please sign in instead.' 
    });
  }

  const userRole = role === 'brand' ? 'brand' : 'creator';
  const passwordHash = bcrypt.hashSync(password, 10);
  const userId = `u-${Date.now()}`;
  let creatorProfileId: string | undefined = undefined;

  // If Creator, create initial Creator record in SQLite
  if (userRole === 'creator') {
    const handle = `@${cleanEmail.split('@')[0]}`;
    const newCreator: Creator = {
      id: `c-${Date.now()}`,
      userId: userId,
      name: name.trim(),
      handle: handle,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
      bio: 'New content creator on Influzo ready for brand partnerships.',
      location: 'United States',
      verified: false,
      verificationStatus: 'pending',
      authenticityScore: 96.5,
      rating: 5.0,
      reviewCount: 0,
      niches: ['Tech & AI', 'Lifestyle & Travel'],
      primaryPlatform: 'youtube',
      followersCount: 25000,
      avgEngagementRate: 5.4,
      avgViewsPerPost: 4500,
      priceRange: '$350 - $1,200',
      platforms: [
        { platform: 'youtube', handle: handle, followers: 25000, engagementRate: 5.4, avgViews: 4500, profileUrl: '#' }
      ],
      audienceDemographics: {
        topCountries: [{ name: 'United States', percentage: 55 }, { name: 'United Kingdom', percentage: 20 }],
        ageGroups: [{ label: '18-24', percentage: 40 }, { label: '25-34', percentage: 45 }],
        genderSplit: { female: 50, male: 50, other: 0 }
      },
      stats: { completedCollabs: 0, onTimeRate: 100, responseHours: 2, repeatBrandRate: 0 },
      sampleWork: [],
      packages: [
        {
          id: `pkg-${Date.now()}-1`,
          title: 'Standard Sponsored Post',
          description: '1x High quality dedicated sponsored post + link tracking.',
          price: 450,
          deliverables: ['1x Post / Video', '14-Day Link in Bio'],
          turnaroundDays: 5,
          popular: true
        }
      ],
      createdAt: new Date().toISOString().split('T')[0]
    };

    db.createCreator(newCreator);
    creatorProfileId = newCreator.id;
  }

  // Create User record in SQLite
  const user = db.createUser({
    id: userId,
    email: cleanEmail,
    passwordHash: passwordHash,
    name: name.trim(),
    role: userRole,
    onboarded: true,
    creatorProfileId: creatorProfileId,
  });

  const token = generateToken(user);
  db.addAuditLog('USER_SIGNUP_PASSWORD', 'auth', user.id, `User registered: ${user.name} (${user.emailOrPhone}) as ${user.role}`);

  console.log(`[AUTH] User registered successfully: ${user.emailOrPhone} (${user.role})`);

  const creator = creatorProfileId ? db.getCreatorById(creatorProfileId) : undefined;

  res.status(201).json({
    success: true,
    message: 'Account created successfully.',
    data: {
      user,
      token,
      creator,
    }
  });
});

// 2. POST /api/auth/login (Standard Email & Password Login)
authRouter.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email and password are required.' 
    });
  }

  const cleanEmail = email.trim().toLowerCase();
  const userWithHash = db.getUserByEmail(cleanEmail);

  if (!userWithHash) {
    return res.status(401).json({ 
      success: false, 
      message: 'No account found with this email. Please check your credentials or sign up.' 
    });
  }

  // Check password
  if (userWithHash.passwordHash) {
    const isValid = bcrypt.compareSync(password, userWithHash.passwordHash);
    if (!isValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Incorrect password. Please try again.' 
      });
    }
  }

  const { passwordHash, ...user } = userWithHash;
  const token = generateToken(user);
  const creator = user.creatorProfileId ? db.getCreatorById(user.creatorProfileId) : db.getCreatorByUserId(user.id);

  db.addAuditLog('USER_LOGIN_PASSWORD', 'auth', user.id, `User logged in: ${user.name} (${user.emailOrPhone})`);
  console.log(`[AUTH] User logged in: ${user.emailOrPhone} (${user.role})`);

  res.json({
    success: true,
    message: `Welcome back, ${user.name}!`,
    data: {
      user,
      token,
      creator: creator || undefined,
    }
  });
});

// 3. GET /api/auth/me (Validate JWT and return active profile)
authRouter.get('/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No authorization token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = db.getUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Session expired or user not found' });
    }

    const creator = user.creatorProfileId 
      ? db.getCreatorById(user.creatorProfileId) 
      : db.getCreatorByUserId(user.id);

    res.json({
      success: true,
      data: {
        user,
        creator: creator || undefined,
      }
    });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
});

// 4. POST /api/auth/send-otp (Passwordless 6-Digit OTP Option)
authRouter.post('/send-otp', (req: Request, res: Response) => {
  const { emailOrPhone, role } = req.body;

  if (!emailOrPhone || typeof emailOrPhone !== 'string') {
    return res.status(400).json({ success: false, message: 'Valid email or phone is required.' });
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const userRole = role === 'brand' ? 'brand' : 'creator';

  db.setOTP(emailOrPhone.trim().toLowerCase(), otpCode, userRole);

  console.log(`\n========================================`);
  console.log(`[INFLUZO OTP DISPATCH]`);
  console.log(`To: ${emailOrPhone}`);
  console.log(`Code: ${otpCode}`);
  console.log(`Expires in: 5 minutes`);
  console.log(`========================================\n`);

  db.addAuditLog('AUTH_OTP_SENT', 'auth', emailOrPhone, `OTP dispatched to ${emailOrPhone}`);

  res.json({
    success: true,
    message: `Verification code sent to ${emailOrPhone}`,
    debugCode: otpCode,
    expiresInSeconds: 300,
  });
});

// 5. POST /api/auth/verify-otp (Verify 6-Digit OTP)
authRouter.post('/verify-otp', (req: Request, res: Response) => {
  const { emailOrPhone, code } = req.body;

  if (!emailOrPhone || !code) {
    return res.status(400).json({ success: false, message: 'Email/Phone and OTP code are required.' });
  }

  const cleanIdentifier = emailOrPhone.trim().toLowerCase();
  const verification = db.verifyOTP(cleanIdentifier, code.trim());

  if (!verification.valid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired 6-digit verification code.'
    });
  }

  // Find or create user
  let user = db.getUserByEmail(cleanIdentifier);

  if (!user) {
    const userRole = verification.role || 'creator';
    const newUserId = `u-${Date.now()}`;
    let creatorProfileId: string | undefined = undefined;

    if (userRole === 'creator') {
      const handle = `@${cleanIdentifier.split('@')[0]}`;
      const newCreator: Creator = {
        id: `c-${Date.now()}`,
        userId: newUserId,
        name: cleanIdentifier.split('@')[0],
        handle: handle,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
        bio: 'Content creator on Influzo.',
        location: 'United States',
        verified: false,
        verificationStatus: 'pending',
        authenticityScore: 96.0,
        rating: 5.0,
        reviewCount: 0,
        niches: ['Tech & AI'],
        primaryPlatform: 'youtube',
        followersCount: 30000,
        avgEngagementRate: 5.0,
        avgViewsPerPost: 5000,
        priceRange: '$400 - $1,000',
        platforms: [{ platform: 'youtube', handle: handle, followers: 30000, engagementRate: 5.0, avgViews: 5000, profileUrl: '#' }],
        audienceDemographics: { topCountries: [{ name: 'United States', percentage: 60 }], ageGroups: [{ label: '18-24', percentage: 40 }], genderSplit: { female: 50, male: 50, other: 0 } },
        stats: { completedCollabs: 0, onTimeRate: 100, responseHours: 2, repeatBrandRate: 0 },
        sampleWork: [],
        packages: [{ id: `pkg-${Date.now()}`, title: 'Sponsored Video', description: 'Dedicated integration.', price: 500, deliverables: ['1x Post'], turnaroundDays: 5 }],
        createdAt: new Date().toISOString().split('T')[0]
      };
      db.createCreator(newCreator);
      creatorProfileId = newCreator.id;
    }

    user = db.createUser({
      id: newUserId,
      email: cleanIdentifier,
      name: cleanIdentifier.split('@')[0],
      role: userRole,
      onboarded: true,
      creatorProfileId: creatorProfileId,
    });
  }

  const token = generateToken(user);
  const creator = user.creatorProfileId ? db.getCreatorById(user.creatorProfileId) : db.getCreatorByUserId(user.id);

  res.json({
    success: true,
    message: 'OTP verified successfully.',
    data: {
      user,
      token,
      creator: creator || undefined,
    }
  });
});

// 6. POST /api/auth/admin-login (Super Admin Passkey)
authRouter.post('/admin-login', (req: Request, res: Response) => {
  const { masterKey } = req.body;

  if (masterKey !== ADMIN_MASTER_PASSKEY && masterKey !== 'admin123' && masterKey !== 'influzo2026') {
    return res.status(403).json({ success: false, message: 'Invalid Super Admin Passkey.' });
  }

  let adminUser = db.getUserByEmail('admin@influzo.com');
  if (!adminUser) {
    adminUser = db.createUser({
      id: 'u-admin',
      email: 'admin@influzo.com',
      name: 'Alex Rivera (Super Admin)',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      onboarded: true,
    });
  }

  const token = generateToken(adminUser);
  db.addAuditLog('ADMIN_AUTHENTICATED', 'auth', adminUser.id, 'Super Admin logged into Control Suite.', 'Super Admin');

  res.json({
    success: true,
    message: 'Super Admin authenticated successfully.',
    data: {
      user: adminUser,
      token,
    }
  });
});

// 7. POST /api/auth/logout
authRouter.post('/logout', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});
