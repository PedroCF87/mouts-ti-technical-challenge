import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class AddTestUsers1750691277688 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);
    
    // Insert admin user
    await queryRunner.query(`
      INSERT INTO users (id, email, password, name, role, "isActive", "createdAt", "updatedAt")
      VALUES (
        uuid_generate_v4(),
        'admin@example.com',
        '${adminPassword}',
        'Admin User',
        'admin',
        true,
        NOW(),
        NOW()
      )
    `);
    
    // Insert regular user
    await queryRunner.query(`
      INSERT INTO users (id, email, password, name, role, "isActive", "createdAt", "updatedAt")
      VALUES (
        uuid_generate_v4(),
        'user@example.com',
        '${userPassword}',
        'Regular User',
        'user',
        true,
        NOW(),
        NOW()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM users WHERE email = 'admin@example.com'`);
    await queryRunner.query(`DELETE FROM users WHERE email = 'user@example.com'`);
  }
}
