/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/auth/dto/register.dto.ts
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'mohamed@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'mohamed abdellhay', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '01012345678', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}
