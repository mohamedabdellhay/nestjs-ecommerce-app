import {
  IsObject,
  ValidateNested,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class ShippingAddressDto {
  @ApiProperty({ example: 'Zizo' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '01012345678' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: '6 October - 8th District' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'Giza' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Egypt', required: false })
  @IsString()
  country?: string = 'Egypt';
}

export class CreateOrderDto {
  @ApiProperty({ type: ShippingAddressDto })
  @IsObject()
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;
}
