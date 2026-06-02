const { ValidationError, AuthError } = require('../utils/errors');
const { isValidEmail, isNonEmptyString } = require('../validators/common');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');

class AuthService {
  constructor({ userRepository, jwtSecret, bcryptRounds }) {
    this.userRepository = userRepository;
    this.jwtSecret = jwtSecret;
    this.bcryptRounds = bcryptRounds;
  }

  async register({ name, email, password }) {
    if (!isNonEmptyString(name)) {
      throw new ValidationError('El nombre es obligatorio');
    }

    if (!isValidEmail(email)) {
      throw new ValidationError('El correo electrónico no es válido');
    }

    if (!isNonEmptyString(password) || password.length < 8) {
      throw new ValidationError('La contraseña debe tener al menos 8 caracteres');
    }

    const existingUser = await this.userRepository.findByEmail(email.toLowerCase());
    if (existingUser) {
      throw new ValidationError('Ya existe una cuenta con este correo');
    }

    const passwordHash = await hashPassword(password, this.bcryptRounds);
    const user = await this.userRepository.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
    });

    return this.buildAuthResponse(user);
  }

  async login({ email, password }) {
    if (!isValidEmail(email)) {
      throw new ValidationError('El correo electrónico no es válido');
    }

    if (!isNonEmptyString(password)) {
      throw new ValidationError('La contraseña es obligatoria');
    }

    const user = await this.userRepository.findByEmail(email.toLowerCase());
    if (!user) {
      throw new AuthError('Credenciales inválidas');
    }

    const passwordMatches = await comparePassword(password, user.password_hash);
    if (!passwordMatches) {
      throw new AuthError('Credenciales inválidas');
    }

    return this.buildAuthResponse(user);
  }

  async profile(userId) {
    return this.userRepository.getProfile(userId);
  }

  buildAuthResponse(user) {
    const token = signToken(
      { sub: String(user.id), email: user.email, name: user.name },
      this.jwtSecret,
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}

module.exports = { AuthService };