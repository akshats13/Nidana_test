import { Controller, Get, Query, Patch, Param } from '@nestjs/common';
import { SongsService } from './songs.service';
import { Song } from './song.entity';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get()
  async findAll(@Query('search') search?: string): Promise<Song[]> {
    return this.songsService.findAll(search);
  }

  @Patch(':id/like')
  async likeSong(@Param('id') id: number): Promise<Song> {
    return this.songsService.likeSong(id);
  }

  @Patch(':id/unlike')
  async unlikeSong(@Param('id') id: number): Promise<Song> {
    return this.songsService.unlikeSong(id);
  }

  @Get('/liked')
  async getLikedSongs(): Promise<Song[]> {
    return this.songsService.getLikedSongs();
  }
}
