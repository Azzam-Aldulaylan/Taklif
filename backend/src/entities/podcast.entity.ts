import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('podcasts')
export class Podcast {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  trackId: number;

  @Column()
  trackName: string;

  @Column()
  artistName: string;

  @Column({ nullable: true })
  collectionName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  artworkUrl100: string;

  @Column({ nullable: true })
  artworkUrl600: string;

  @Column({ nullable: true })
  feedUrl: string;

  @Column({ nullable: true })
  trackViewUrl: string;

  @Column({ nullable: true })
  country: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  trackPrice: number;

  @Column({ nullable: true })
  currency: string;

  @Column({ type: 'int', nullable: true })
  trackCount: number;

  @Column({ type: 'timestamp', nullable: true })
  releaseDate: Date;

  @Column({ type: 'text', nullable: true })
  genres: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
