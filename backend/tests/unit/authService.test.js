jest.mock('../../src/utils/password', () => ({
  hashPassword: jest.fn(async () => 'hashed-password'),
  comparePassword: jest.fn(async () => true),
}));

jest.mock('../../src/utils/jwt', () => ({
  signToken: jest.fn(() => 'signed-token'),
  verifyToken: jest.fn(),
}));

const { AuthService } = require('../../src/services/authService');
const { hashPassword, comparePassword } = require('../../src/utils/password');

describe('AuthService', () => {
  const repository = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    getProfile: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registers a new user and returns a JWT', async () => {
    repository.findByEmail.mockResolvedValue(null);
    repository.create.mockResolvedValue({ id: 7, name: 'Ada', email: 'ada@energyhome.com' });

    const service = new AuthService({ userRepository: repository, jwtSecret: 'secret', bcryptRounds: 10 });
    const result = await service.register({ name: 'Ada', email: 'Ada@EnergyHome.com', password: 'Password123!' });

    expect(hashPassword).toHaveBeenCalledWith('Password123!', 10);
    expect(repository.create).toHaveBeenCalledWith({
      name: 'Ada',
      email: 'ada@energyhome.com',
      passwordHash: 'hashed-password',
    });
    expect(result.token).toBe('signed-token');
    expect(result.user).toEqual({ id: 7, name: 'Ada', email: 'ada@energyhome.com' });
  });

  it('rejects duplicate emails', async () => {
    repository.findByEmail.mockResolvedValue({ id: 1, email: 'ada@energyhome.com' });
    const service = new AuthService({ userRepository: repository, jwtSecret: 'secret', bcryptRounds: 10 });

    await expect(
      service.register({ name: 'Ada', email: 'ada@energyhome.com', password: 'Password123!' }),
    ).rejects.toThrow('Ya existe una cuenta con este correo');
  });

  it('logs in an existing user', async () => {
    repository.findByEmail.mockResolvedValue({ id: 7, name: 'Ada', email: 'ada@energyhome.com', password_hash: 'hash' });
    const service = new AuthService({ userRepository: repository, jwtSecret: 'secret', bcryptRounds: 10 });

    const result = await service.login({ email: 'ada@energyhome.com', password: 'Password123!' });

    expect(comparePassword).toHaveBeenCalledWith('Password123!', 'hash');
    expect(result.token).toBe('signed-token');
  });

  it('returns the user profile', async () => {
    repository.getProfile.mockResolvedValue({ id: 7, name: 'Ada', email: 'ada@energyhome.com' });
    const service = new AuthService({ userRepository: repository, jwtSecret: 'secret', bcryptRounds: 10 });

    await expect(service.profile(7)).resolves.toEqual({ id: 7, name: 'Ada', email: 'ada@energyhome.com' });
  });

  it('rejects invalid registration input', async () => {
    const service = new AuthService({ userRepository: repository, jwtSecret: 'secret', bcryptRounds: 10 });

    await expect(
      service.register({ name: '', email: 'bad-email', password: 'short' }),
    ).rejects.toThrow('El nombre es obligatorio');
  });

  it('rejects invalid registration email', async () => {
    const service = new AuthService({ userRepository: repository, jwtSecret: 'secret', bcryptRounds: 10 });

    await expect(
      service.register({ name: 'Ada', email: 'bad-email', password: 'Password123!' }),
    ).rejects.toThrow('El correo electrónico no es válido');
  });

  it('rejects short registration passwords', async () => {
    const service = new AuthService({ userRepository: repository, jwtSecret: 'secret', bcryptRounds: 10 });

    await expect(
      service.register({ name: 'Ada', email: 'ada@energyhome.com', password: 'short' }),
    ).rejects.toThrow('La contraseña debe tener al menos 8 caracteres');
  });

  it('rejects invalid login credentials', async () => {
    repository.findByEmail.mockResolvedValue(null);
    const service = new AuthService({ userRepository: repository, jwtSecret: 'secret', bcryptRounds: 10 });

    await expect(service.login({ email: 'missing@energyhome.com', password: 'Password123!' })).rejects.toThrow(
      'Credenciales inválidas',
    );
  });

  it('rejects invalid login email and password checks', async () => {
    repository.findByEmail.mockResolvedValue({ id: 7, name: 'Ada', email: 'ada@energyhome.com', password_hash: 'hash' });
    comparePassword.mockResolvedValueOnce(false);
    const service = new AuthService({ userRepository: repository, jwtSecret: 'secret', bcryptRounds: 10 });

    await expect(service.login({ email: 'bad-email', password: 'Password123!' })).rejects.toThrow(
      'El correo electrónico no es válido',
    );
    await expect(service.login({ email: 'ada@energyhome.com', password: '' })).rejects.toThrow(
      'La contraseña es obligatoria',
    );
    await expect(service.login({ email: 'ada@energyhome.com', password: 'Password123!' })).rejects.toThrow(
      'Credenciales inválidas',
    );
  });
});