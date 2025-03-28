import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Song } from './song.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songsRepository: Repository<Song>,
  ) {}

  async findAll(search?: string): Promise<Song[]> {
    if (search) {
      return this.songsRepository.find({
        where: [
          { title: ILike(`%${search}%`) },
          { artist: ILike(`%${search}%`) },
          { album: ILike(`%${search}%`) },
        ],
      });
    }
    return this.songsRepository.find();
  }

  async seedSongs() {
    const songs = [
      { title: 'Song 1', artist: 'Artist 1', album: 'Album 1', duration: 180 },
      { title: 'Song 2', artist: 'Artist 2', album: 'Album 2', duration: 240 },
      { title: 'Song 3', artist: 'Artist 3', album: 'Album 3', duration: 200 },
    ];
    await this.songsRepository.save(songs);
  }

  async likeSong(id: number): Promise<Song> {
    const song = await this.songsRepository.findOneBy({ id });
    if (!song) {
      throw new Error('Song not found');
    }
    song.liked = true;
    return this.songsRepository.save(song);
  }

  async unlikeSong(id: number): Promise<Song> {
    const song = await this.songsRepository.findOneBy({ id });
    if (!song) {
      throw new Error('Song not found');
    }
    song.liked = false;
    return this.songsRepository.save(song);
  }

  async getLikedSongs(): Promise<Song[]> {
    return this.songsRepository.find({ where: { liked: true } });
  }
}
