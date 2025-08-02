import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SearchPodcastDto {
  @IsString()
  @IsNotEmpty()
  term: string;

  @IsOptional()
  @IsString()
  country?: string = 'SA';

  @IsOptional()
  @IsString()
  media?: string = 'podcast';

  @IsOptional()
  @IsString()
  entity?: string = 'podcast';
}
