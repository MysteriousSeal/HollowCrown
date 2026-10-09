// A world drawn by hand, as data: its land (heights in tiers, set by shapes), what covers it (surfaces painted by
// shapes: water, paths, plazas), named areas (a forest, a meadow), and everything placed in it (places: a village, a
// ruin, a camp), each by its kind. Readable and reviewable as plain data; checked as it's loaded (every problem listed
// at once); worked out a chunk at a time, when a chunk is first asked about (the map costs memory only where it's
// looked at).

import { CHUNK_SIZE } from './chunks';
import type { Area, MapSize } from './grid';
import { boundsOf, covers, type Point, type Shape } from './shapes';
import { RELIEF_MAX, RELIEF_MIN, RELIEF_STEP, reliefAt } from './relief';
import { TILE_HEIGHT, tileOf, type Terrain } from './terrain';

// ---- the data ----

// Land: the tiles in `shape` at `tier`. Later entries win (a hill's crown drawn over its slopes).
export interface LandPatch {
  shape: Shape;
  tier: number;
  note?: string;
}

// A kind of surface: how it's drawn and whether it can be walked on.
export interface SurfaceKind {
  color: number;
  walkable?: boolean; // (none given: yes)
}

// A surface painted on the land (`surface`: one of the map's surface kinds). Later entries win.
export interface SurfacePatch {
  shape: Shape;
  surface: string;
  note?: string;
}

// A named area of the map (a forest, a meadow): for filling with trees or grass, for gameplay, for the map.
export interface AreaData {
  id: string;
  kind: string;
  shape: Shape;
  name?: string;
  props?: Record<string, unknown>;
}

// Something placed by hand: what kind it is (the game's kinds: a village, a ruin), where (tiles), which way it faces
// (radians, 0 toward +z), its name, and its own properties (each kind's: checked by the game's rules).
export interface PlaceData {
  id: string;
  kind: string;
  at: Point;
  facing?: number;
  name?: string;
  props?: Record<string, unknown>;
}

export interface WorldMapData {
  size: MapSize;
  baseTier: number; // the land's height wherever no patch says otherwise
  relief?: boolean; // bare land a little uneven, tile by tile (relief.ts); surfaces (roads, water) stay flat. Default on.
  surfaceKinds: Record<string, SurfaceKind>;
  land: LandPatch[];
  surfaces: SurfacePatch[];
  areas: AreaData[];
  places: PlaceData[];
}

// A piece of a map (a region's own file): its land, surfaces, areas and places, appended in order.
export type WorldMapPart = Partial<Pick<WorldMapData, 'land' | 'surfaces' | 'areas' | 'places'>>;

// One map of its settings and its pieces, in order (a later piece's land and surfaces drawn over an earlier one's).
export function composeWorldMap(base: Pick<WorldMapData, 'size' | 'baseTier' | 'surfaceKinds' | 'relief'>, ...parts: WorldMapPart[]): WorldMapData {
  return {
    ...base,
    land: parts.flatMap((p) => p.land ?? []),
    surfaces: parts.flatMap((p) => p.surfaces ?? []),
    areas: parts.flatMap((p) => p.areas ?? []),
    places: parts.flatMap((p) => p.places ?? []),
  };
}

// A game's rules for its places, by kind: the problems with one (none: it's sound). A kind not listed is an error.
export type PlaceRules = Record<string, (place: PlaceData, map: WorldMapData) => string[]>;

export class WorldDataError extends Error {
  constructor(readonly problems: string[]) {
    super(`The world's data has ${problems.length} problem${problems.length === 1 ? '' : 's'}:\n- ${problems.join('\n- ')}`);
  }
}

// ---- loading ----

const MIN_TIER = 0;
const MAX_TIER = 31;

// Every problem with `data`, as plain sentences (none: it's sound).
export function checkWorldMap(data: WorldMapData, rules: PlaceRules = {}): string[] {
  const problems: string[] = [];
  const { width, depth } = data.size;
  if (!Number.isInteger(data.baseTier) || data.baseTier < MIN_TIER || data.baseTier > MAX_TIER) problems.push(`baseTier ${data.baseTier} is outside ${MIN_TIER}..${MAX_TIER}`);
  const onMap = ([x, z]: Point) => x >= 0 && z >= 0 && x < width && z < depth;
  const shapeOnMap = (shape: Shape) => {
    const b = boundsOf(shape);
    return b.x1 > 0 && b.z1 > 0 && b.x0 < width && b.z0 < depth;
  };
  data.land.forEach((p, i) => {
    const what = `land[${i}]${p.note ? ` (${p.note})` : ''}`;
    if (!Number.isInteger(p.tier) || p.tier < MIN_TIER || p.tier > MAX_TIER) problems.push(`${what}: tier ${p.tier} is outside ${MIN_TIER}..${MAX_TIER}`);
    if (!shapeOnMap(p.shape)) problems.push(`${what}: off the map`);
  });
  data.surfaces.forEach((p, i) => {
    const what = `surfaces[${i}]${p.note ? ` (${p.note})` : ''}`;
    if (!(p.surface in data.surfaceKinds)) problems.push(`${what}: no surface kind "${p.surface}"`);
    if (!shapeOnMap(p.shape)) problems.push(`${what}: off the map`);
  });
  const ids = new Set<string>();
  const unique = (id: string, what: string) => {
    if (ids.has(id)) problems.push(`${what}: the id "${id}" is used twice`);
    ids.add(id);
  };
  for (const a of data.areas) {
    unique(a.id, `area ${a.id}`);
    if (!shapeOnMap(a.shape)) problems.push(`area ${a.id}: off the map`);
  }
  for (const p of data.places) {
    unique(p.id, `place ${p.id}`);
    if (!onMap(p.at)) problems.push(`place ${p.id}: at (${p.at.join(', ')}), off the map`);
    const rule = rules[p.kind];
    if (!rule) problems.push(`place ${p.id}: no kind "${p.kind}"`);
    else for (const problem of rule(p, data)) problems.push(`place ${p.id}: ${problem}`);
  }
  return problems;
}

// The world of `data`, checked (a WorldDataError listing every problem, if it isn't sound).
export function loadWorldMap(data: WorldMapData, rules: PlaceRules = {}): WorldMap {
  const problems = checkWorldMap(data, rules);
  if (problems.length) throw new WorldDataError(problems);
  return new WorldMap(data);
}

// ---- the world ----

interface Chunk {
  tiers: Uint8Array;
  surfaces: Uint8Array;
  relief: Int8Array | null; // (null: flat)
}

export class WorldMap implements Terrain {
  readonly size: MapSize;
  readonly surfaceNames: string[]; // surface number n is surfaceNames[n - 1]
  private readonly walkableSurface: boolean[]; // by surface number (0: the bare land)
  private readonly landByChunk = new Map<number, number[]>(); // chunk index -> land patches over it, in order
  private readonly surfacesByChunk = new Map<number, number[]>();
  private readonly flats: Array<{ shape: Shape; level: number }> = []; // ground kept level (flatten)
  private readonly flatsByChunk = new Map<number, number[]>();
  private readonly chunks = new Map<number, Chunk>();
  private readonly across: number; // chunks across z
  private readonly placesById: Map<string, PlaceData>;

  constructor(readonly data: WorldMapData) {
    this.size = data.size;
    this.across = Math.ceil(data.size.depth / CHUNK_SIZE);
    this.surfaceNames = Object.keys(data.surfaceKinds);
    this.walkableSurface = [true, ...this.surfaceNames.map((n) => data.surfaceKinds[n].walkable ?? true)];
    data.land.forEach((p, i) => this.bucket(this.landByChunk, p.shape, i));
    data.surfaces.forEach((p, i) => this.bucket(this.surfacesByChunk, p.shape, i));
    this.placesById = new Map(data.places.map((p) => [p.id, p]));
  }

  // ---- Terrain ----

  tierAt(x: number, z: number): number {
    const [tx, tz] = [tileOf(x), tileOf(z)];
    if (!this.onMap(tx, tz)) return this.data.baseTier;
    return this.chunkOf(tx, tz).tiers[this.cell(tx, tz)];
  }

  groundY(x: number, z: number): number {
    return this.tierAt(x, z) * TILE_HEIGHT + this.reliefAt(x, z) * RELIEF_STEP;
  }

  reliefAt(x: number, z: number): number {
    const [tx, tz] = [tileOf(x), tileOf(z)];
    if (!this.onMap(tx, tz)) return 0;
    return this.chunkOf(tx, tz).relief?.[this.cell(tx, tz)] ?? 0;
  }

  surfaceAt(x: number, z: number): number {
    const [tx, tz] = [tileOf(x), tileOf(z)];
    return this.onMap(tx, tz) ? this.chunkOf(tx, tz).surfaces[this.cell(tx, tz)] : 0;
  }

  // The relief under `shape` set to `level` steps (0: the tier's own height), for something standing there that needs
  // level ground (a building's footprint). Later calls win; tiles already worked out are worked out again.
  flatten(shape: Shape, level = 0): void {
    if (!Number.isInteger(level) || level < RELIEF_MIN || level > RELIEF_MAX) throw new Error(`flatten: level ${level} is outside ${RELIEF_MIN}..${RELIEF_MAX}`);
    const index = this.flats.push({ shape, level }) - 1;
    const touched = new Map<number, number[]>();
    this.bucket(touched, shape, index);
    for (const key of touched.keys()) {
      this.chunks.delete(key);
      const list = this.flatsByChunk.get(key);
      if (list) list.push(index);
      else this.flatsByChunk.set(key, [index]);
    }
  }

  walkable(x: number, z: number): boolean {
    return this.walkableSurface[this.surfaceAt(x, z)];
  }

  // Each surface's color, by its number (1..), for the terrain layer.
  surfaceColors(): number[] {
    return this.surfaceNames.map((n) => this.data.surfaceKinds[n].color);
  }

  // Every tier the land has (for the terrain layer to make their materials up front).
  tiers(): number[] {
    return [...new Set([this.data.baseTier, ...this.data.land.map((p) => p.tier)])].sort((a, b) => a - b);
  }

  // ---- areas and places ----

  areasAt(x: number, z: number): AreaData[] {
    const [tx, tz] = [tileOf(x), tileOf(z)];
    return this.data.areas.filter((a) => covers(a.shape, tx, tz));
  }

  place(id: string): PlaceData | undefined {
    return this.placesById.get(id);
  }

  // Every place of `kind` (none given: every place).
  places(kind?: string): PlaceData[] {
    return kind ? this.data.places.filter((p) => p.kind === kind) : this.data.places;
  }

  // Every place within `area`.
  placesIn(area: Area): PlaceData[] {
    return this.data.places.filter(({ at: [x, z] }) => x >= area.x0 && x < area.x1 && z >= area.z0 && z < area.z1);
  }

  // ---- chunks ----

  private onMap(x: number, z: number): boolean {
    return x >= 0 && z >= 0 && x < this.size.width && z < this.size.depth;
  }

  private cell(x: number, z: number): number {
    return (x % CHUNK_SIZE) + (z % CHUNK_SIZE) * CHUNK_SIZE;
  }

  private chunkIndex(cx: number, cz: number): number {
    return cx * this.across + cz;
  }

  // Each shape listed under every chunk its box touches, in the data's order.
  private bucket(into: Map<number, number[]>, shape: Shape, index: number): void {
    const b = boundsOf(shape);
    for (let cx = Math.max(0, Math.floor(b.x0 / CHUNK_SIZE)); cx * CHUNK_SIZE < Math.min(b.x1, this.size.width); cx++) {
      for (let cz = Math.max(0, Math.floor(b.z0 / CHUNK_SIZE)); cz * CHUNK_SIZE < Math.min(b.z1, this.size.depth); cz++) {
        const key = this.chunkIndex(cx, cz);
        const list = into.get(key);
        if (list) list.push(index);
        else into.set(key, [index]);
      }
    }
  }

  // The chunk round tile (x, z), worked out the first time it's asked for: the land patches over it applied in order,
  // then the surfaces.
  private chunkOf(x: number, z: number): Chunk {
    const [cx, cz] = [Math.floor(x / CHUNK_SIZE), Math.floor(z / CHUNK_SIZE)];
    const key = this.chunkIndex(cx, cz);
    const cached = this.chunks.get(key);
    if (cached) return cached;
    const chunk: Chunk = { tiers: new Uint8Array(CHUNK_SIZE * CHUNK_SIZE).fill(this.data.baseTier), surfaces: new Uint8Array(CHUNK_SIZE * CHUNK_SIZE), relief: null };
    const [x0, z0] = [cx * CHUNK_SIZE, cz * CHUNK_SIZE];
    for (const i of this.landByChunk.get(key) ?? []) {
      const { shape, tier } = this.data.land[i];
      this.paint(shape, x0, z0, (c) => (chunk.tiers[c] = tier));
    }
    for (const i of this.surfacesByChunk.get(key) ?? []) {
      const { shape, surface } = this.data.surfaces[i];
      const n = this.surfaceNames.indexOf(surface) + 1;
      this.paint(shape, x0, z0, (c) => (chunk.surfaces[c] = n));
    }
    if (this.data.relief ?? true) {
      const relief = (chunk.relief = new Int8Array(CHUNK_SIZE * CHUNK_SIZE));
      for (let z = 0; z < CHUNK_SIZE; z++) for (let x = 0; x < CHUNK_SIZE; x++) {
        const c = x + z * CHUNK_SIZE;
        if (chunk.surfaces[c] === 0) relief[c] = reliefAt(x0 + x, z0 + z);
      }
      for (const i of this.flatsByChunk.get(key) ?? []) {
        const { shape, level } = this.flats[i];
        this.paint(shape, x0, z0, (c) => (relief[c] = level));
      }
    }
    this.chunks.set(key, chunk);
    return chunk;
  }

  private paint(shape: Shape, x0: number, z0: number, set: (cell: number) => void): void {
    const b = boundsOf(shape);
    for (let z = Math.max(z0, b.z0); z < Math.min(z0 + CHUNK_SIZE, b.z1); z++) {
      for (let x = Math.max(x0, b.x0); x < Math.min(x0 + CHUNK_SIZE, b.x1); x++) if (covers(shape, x, z)) set(x - x0 + (z - z0) * CHUNK_SIZE);
    }
  }
}
