// the next 3 lines are added later
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

import bcrypt  from 'bcrypt';

import { createUser, findUserByUsername, findUserById ,getAllUsers, 
findUserByUsernameOrPhone, updateUser, toggleUserStatus
} from '../models/userDB.js';

// for creating a user
export async function register(req, res){
  try {
    const { user_name, phone, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser({ user_name, phone, password: hashedPassword, role });
    res.json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Helper functions
function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, user_name: user.user_name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // Short-lived
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' } // Long-lived
  );
}

export async function login(req, res) {
  try {
    const { user_name, password } = req.body;
    const rows = await findUserByUsername(user_name);
    const user = rows[0];

    if (!user) return res.status(400).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid password' });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Send refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, // Set to true in production (requires HTTPS)
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      // credentials: 'include'

    });

    // Send access token and user info in response
    res.json({
      message: 'Login successful',
      accessToken,
      user: {
        id: user.id,
        user_name: user.user_name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: err.message });
  }
}


// for the logout - new - from chatgpt - copied right after the above one
export function logout(req, res) {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  });
  res.status(200).json({ message: 'Logged out successfully' });
  // res.json({ message: 'Logged out successfully' });
}

export async function refreshToken(req, res) {
  const token = req.cookies.refreshToken;

    // console.log("req.cookies.refreshToken: ", token);

  if (!token) return res.status(401).json({ message: 'No refresh token found' });

  try {
    // Decode refresh token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // console.log("the result of jwt.verify: ", decoded)

    // 🔍 Fetch user by ID
    const rows = await findUserById(decoded.id);
    const user = rows[0];

    // console.log("Log the result of findUserById: ", user)

    if (!user) return res.status(404).json({ message: 'User not found' });

    // ✅ Create new access token with full info
    const newAccessToken = jwt.sign(
      {
        id: user.id,
        user_name: user.user_name,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // console.log("Log the newly generated accessToken: ",newAccessToken)

    // ✅ Return both accessToken and user info
    res.json({
      accessToken: newAccessToken,
      user: {
        id: user.id,
        user_name: user.user_name,
        role: user.role,
      },
    });

  } catch (err) {
    console.error('Refresh token error:', err.message);
    return res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
}

// for user table part - reading all the users in the database
export async function getUsers(req, res) {
  try {
    const users = await getAllUsers(); // ✅ no [users]
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// for searching users by their name or phone
export async function getUserByUsernameOrPhone(req, res) {
  try {
    const { identifier } = req.params;
    const user = await findUserByUsernameOrPhone(identifier);
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user[0]); // Return only the first match
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// for updating user data
export async function updateUserController(req, res) {
  try {
    const { id } = req.params;
    const { user_name, phone, role, password } = req.body;
    await updateUser(id, { user_name, phone, role, password });
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// for activating and deactivating the user
export async function toggleActivation(req, res) {
  try {
    const userId = req.params.id;
    const newStatus = await toggleUserStatus(userId);
    const statusText = newStatus === 1 ? 'activated' : 'deactivated';

    res.json({ message: `User ${statusText} successfully`, is_active: newStatus });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}
