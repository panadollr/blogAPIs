import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateCategoryDto{
    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    slug: string;

    @ApiProperty()
    @IsNotEmpty()
    seo_title: string;

    @ApiProperty()
    @IsNotEmpty()
    seo_description: string;

    @ApiProperty()
    @IsNotEmpty()
    seo_keyword: string;
}