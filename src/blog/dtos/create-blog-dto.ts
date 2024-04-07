import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Category } from "src/category/category.entity";
import { User } from "src/user/user.entity";

export class CreateBlogDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Title cannot be empty' })
    title: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Slug cannot be empty' })
    slug: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Content cannot be empty' })
    content: string;
  
    @ApiProperty()
    @IsNotEmpty({ message: 'SEO title cannot be empty' })
    seo_title: string;
    
    @ApiProperty()
    @IsNotEmpty({ message: 'SEO description cannot be empty' })
    seo_description: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'SEO keyword cannot be empty' })
    seo_keyword: string;

    user: User;

    @ApiProperty()
    @IsNotEmpty()
    category: number;
    
}