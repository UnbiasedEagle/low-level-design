class Song {
  constructor(
    public title: string,
    public artist: string,
    public duration: number,
  ) {}

  getTitle(): string {
    return this.title;
  }

  getArtist(): string {
    return this.artist;
  }
}

class Playlist {
  private songs: Song[];

  constructor(public name: string) {
    this.name = name;
    this.songs = [];
  }

  addSong(song: Song): void {
    this.songs.push(song);
  }

  getSize(): number {
    return this.songs.length;
  }

  getSong(index: number): Song {
    return this.songs[index];
  }
}

interface PlayOrder {
  first(): number;
  after(current: number): number;
}

class Inorder implements PlayOrder {
  constructor(private size: number) {}

  first(): number {
    if (this.size === 0) return -1;
    return 0;
  }

  after(current: number): number {
    if (current === this.size - 1) return -1;
    return current + 1;
  }
}

class ShuffleOrder implements PlayOrder {
  constructor(private shuffledPositions: number[]) {}

  first(): number {
    if (this.shuffledPositions.length === 0) return -1;
    return this.shuffledPositions[0];
  }

  after(current: number): number {
    const at = this.shuffledPositions.indexOf(current);
    if (at === this.shuffledPositions.length - 1) return -1;
    return this.shuffledPositions[at + 1];
  }
}

class Player {
  private current: number;
  private startedPlaying: boolean;

  constructor(
    private playlist: Playlist,
    private playOrder: PlayOrder,
  ) {
    this.current = -1;
    this.startedPlaying = false;
  }

  playNext(): string {
    if (!this.startedPlaying) {
      this.current = this.playOrder.first();
      this.startedPlaying = true;
    } else {
      this.current = this.playOrder.after(this.current);
    }
    if (this.current === -1) {
      return "end of playlist";
    }
    return `Playing ${this.playlist.getSong(this.current).title}`;
  }
}

const playlist = new Playlist("My Playlist");
playlist.addSong(new Song("Song 1", "Artist 1", 300));
playlist.addSong(new Song("Song 2", "Artist 2", 400));
const player = new Player(playlist, new Inorder(playlist.getSize()));
console.log(player.playNext());
console.log(player.playNext());
console.log(player.playNext());

// Shuffle demo
function shuffledIndices(size: number): number[] {
  const indices = Array.from({ length: size }, (_, i) => i);
  // Fisher-Yates shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

console.log("--- Shuffle ---");
const shufflePlaylist = new Playlist("Shuffle Playlist");
shufflePlaylist.addSong(new Song("Song A", "Artist A", 200));
shufflePlaylist.addSong(new Song("Song B", "Artist B", 250));
shufflePlaylist.addSong(new Song("Song C", "Artist C", 180));
shufflePlaylist.addSong(new Song("Song D", "Artist D", 220));
const order = shuffledIndices(shufflePlaylist.getSize());
console.log(`Shuffled order: ${order.join(", ")}`);
const shufflePlayer = new Player(shufflePlaylist, new ShuffleOrder(order));
for (let i = 0; i <= shufflePlaylist.getSize(); i++) {
  console.log(shufflePlayer.playNext());
}
