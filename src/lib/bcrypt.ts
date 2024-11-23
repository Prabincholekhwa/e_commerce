import bcrypt from 'bcrypt';
export default class Bcrypt {
  static hash(data: string, saltOrRounds: string | number): Promise<string> {
    return bcrypt.hash(data, saltOrRounds);
  }

  static compare(data: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
