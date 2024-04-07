import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class FilterBlogDto {
   @ApiProperty({ required: false })
   page:string;

   @ApiProperty({ required: false })
   items_per_page:string 

   @ApiProperty({ required: false })
   search:string
}