// A building as one voxel grid, from a spec: walls of a style (timber-framed plaster, coursed stone, daubed wattle)
// on a stone footing, storeys (the upper ones jettied out, if it has a jetty), a gable roof of a covering (thatch,
// slate, shingle) with its ridge across the front, a door in the front, windows lit from inside (or shuttered and
// boarded), a chimney stack at one gable end. A game gives its palette's colors for each part, and paints anything of
// its own over the result (a sign, a bell-cote) from the layout it's told.
//
// The grid's front looks toward +z (as a model faces); x runs across the front, y up. Its walls sit in its middle,
// a margin round them for the eaves and whatever's painted on.

import { hashUnit } from '../math';
import { createGrid, setColor, type VoxelGrid } from '../voxel';

export const STRUCTURE_VOXEL = 1 / 16; // world units a voxel: a tile is 16 across

export type WallStyle = 'timber' | 'stone' | 'wattle';
export type RoofStyle = 'thatch' | 'slate' | 'shingle';

// The palette entries a building is painted in.
export type StructureColor =
  | 'plaster' | 'plasterShade' | 'timber' | 'timberDark' | 'stone' | 'stoneLight' | 'stoneDark'
  | 'roof' | 'roofLight' | 'roofDark' | 'door' | 'doorDark' | 'window' | 'shutter' | 'inside';

export interface DoorSpec {
  width: number;
  height: number;
  offset?: number; // voxels right (+x) of the front's middle
  open?: boolean; // a wide way in, the dark inside showing (a forge, a barn)
}

export interface WindowSpec {
  width: number;
  height: number;
  sill: number; // voxels up from its storey's floor
  every: number; // voxels between windows along a wall
}

export interface StructureSpec {
  width: number; // the walls, voxels across the front (x)
  depth: number; // and deep (z)
  storeys: number;
  storeyHeight: number; // voxels
  walls: WallStyle;
  roof: RoofStyle;
  colors: Record<StructureColor, number>;
  pitch?: number; // the roof's rise per voxel across (1: 45 degrees)
  overhang?: number; // the eaves beyond the walls, voxels
  plinth?: number; // the stone footing's height, voxels
  jetty?: boolean; // upper storeys stand out a voxel over the front and back
  door?: DoorSpec;
  windows?: WindowSpec;
  chimney?: -1 | 1; // a stack at the left (-x) or right (+x) gable end
  shut?: boolean; // nobody lives there: windows shuttered, the door boarded
  seed?: number; // varies its stones, thatch and plaster
  paint?: (grid: VoxelGrid, layout: StructureLayout) => void; // anything more, painted over it
}

// Where things ended up in the grid (voxels, inclusive): for painting more on, and for placing props.
export interface StructureLayout {
  size: [number, number, number];
  x0: number;
  x1: number;
  z0: number; // the ground storey's back wall
  z1: number; // and its front
  eaves: number; // the first voxel above the walls
  ridge: number; // the roof's top voxel
  door: { x0: number; x1: number; height: number } | null;
}

const MARGIN = 8; // room round the walls: the eaves, a chimney, a step, a sign

export function structureGrid(spec: StructureSpec): { grid: VoxelGrid; layout: StructureLayout } {
  const { width, depth, storeys, storeyHeight, colors: C } = spec;
  const pitch = spec.pitch ?? 1;
  const overhang = spec.overhang ?? 2;
  const plinth = spec.plinth ?? 2;
  const seed = spec.seed ?? 0;
  const jut = spec.jetty && storeys > 1 ? 1 : 0;
  const thick = spec.roof === 'thatch' ? 3 : 2;

  const eaves = storeys * storeyHeight;
  const roofDepth = depth + 2 * jut;
  const halfSpan = (roofDepth - 1) / 2 + overhang;
  const rise = Math.ceil(halfSpan * pitch);
  const size: [number, number, number] = [width + 2 * MARGIN, eaves + rise + 8, depth + 2 * MARGIN];
  const grid = createGrid(size);
  const [x0, x1, z0, z1] = [MARGIN, MARGIN + width - 1, MARGIN, MARGIN + depth - 1];
  const zc = (z0 + z1) / 2;
  const ridge = eaves + rise - 1;
  const roofTop = (z: number) => Math.floor(eaves + (halfSpan - Math.abs(z - zc)) * pitch); // (the roof's surface over z)

  // ---- walls ----
  const stone = (u: number, y: number, face: number) => {
    const row = Math.floor(y / 3);
    const block = Math.floor((u + (row % 2) * 3) / 5);
    const h = hashUnit(block * 13 + face, row, seed + 1);
    return h < 0.55 ? C.stone : h < 0.8 ? C.stoneLight : C.stoneDark;
  };
  const plaster = (u: number, y: number, face: number, blotchy: number) => (hashUnit(Math.floor(u / 3) + face * 97, Math.floor(y / 3), seed + 2) < blotchy ? C.plasterShade : C.plaster);

  // The color of the wall at (u along the face, y), a face `length` long; `gable`: in the triangle under the roof.
  const wallColor = (u: number, y: number, length: number, face: number, gable: boolean): number => {
    if (y < plinth || spec.walls === 'stone') return stone(u, y, face);
    const corner = u === 0 || u === length - 1;
    if (spec.walls === 'wattle') {
      if (corner || y === eaves - 1) return C.timber;
      return y < plinth + 2 ? C.plasterShade : plaster(u, y, face, 0.3);
    }
    if (gable) return Math.abs(u - (length - 1) / 2) < 1 || y === eaves ? C.timber : plaster(u, y, face, 0.12);
    const yIn = y % storeyHeight;
    if (corner || u % 8 === 0 || yIn === storeyHeight - 1 || y === plinth || (yIn === 0 && y > 0)) return C.timber;
    const panel = Math.floor(u / 8);
    const last = Math.floor((length - 1) / 8) - (length % 8 === 1 ? 1 : 0);
    const a = u % 8;
    const lift = Math.round(((yIn - (y < storeyHeight ? plinth : 0)) / (storeyHeight - 1)) * 7);
    if ((panel === 0 && a === lift) || (panel === last && a === 7 - lift)) return C.timberDark; // (the braces by the corners)
    return plaster(u, y, face, 0.12);
  };

  // The walls, storey by storey (a jettied storey a voxel deeper each way), and the gables under the roof.
  for (let y = 0; y < eaves + rise; y++) {
    const gable = y >= eaves;
    const out = y >= storeyHeight ? jut : 0;
    const [za, zb] = [z0 - (gable ? jut : out), z1 + (gable ? jut : out)];
    for (let x = x0; x <= x1; x++) {
      for (let z = za; z <= zb; z++) {
        if (gable && y > roofTop(z) - thick) continue;
        const front = z === zb;
        const back = z === za;
        const side = x === x0 || x === x1;
        let c = C.inside;
        if (side && !gable) c = wallColor(z - za, y, zb - za + 1, x === x0 ? 2 : 3, false);
        else if (side) c = wallColor(z - za, y, zb - za + 1, x === x0 ? 2 : 3, true);
        else if (front || back) c = wallColor(x - x0, y, width, front ? 0 : 1, false);
        setColor(grid, x, y, z, c);
      }
    }
    if (out && y === storeyHeight) for (let x = x0; x <= x1; x++) [z0 - 1, z1 + 1].forEach((z) => setColor(grid, x, y, z, C.timberDark)); // (the jetty's beam)
  }

  // ---- the roof: two slopes from the eaves to the ridge, running across the front ----
  for (let x = x0 - 1; x <= x1 + 1; x++) {
    for (let z = Math.ceil(zc - halfSpan); z <= Math.floor(zc + halfSpan); z++) {
      const top = roofTop(z);
      const fromRidge = Math.abs(z - zc);
      for (let y = top - thick + 1; y <= top; y++) {
        let c: number;
        if (fromRidge < 1.5) c = spec.roof === 'thatch' && x % 4 === 0 ? C.roofLight : C.roofDark; // (the ridge: a capping, pegged)
        else if (halfSpan - fromRidge < 1.5 || x === x0 - 1 || x === x1 + 1) c = C.roofDark; // (the eaves' and verges' edge)
        else if (spec.roof === 'thatch') {
          const h = hashUnit(Math.floor(x / 3), Math.floor(top / 4), seed + 3); // (laid in bundles: strands 3 wide)
          c = h < 0.6 ? C.roof : h < 0.85 ? C.roofLight : C.roofDark;
        } else {
          const course = Math.floor(fromRidge / 2);
          const size = spec.roof === 'slate' ? 4 : 3;
          const h = hashUnit(Math.floor((x + (course % 2) * 2) / size), course, seed + 4);
          c = h < 0.5 ? C.roof : h < 0.8 ? C.roofLight : C.roofDark;
        }
        setColor(grid, x, y, z, c);
      }
    }
  }

  // ---- the door, in the front of the ground storey: framed, recessed, a step before it ----
  let door: StructureLayout['door'] = null;
  if (spec.door) {
    const { width: w, height: h, offset = 0, open = false } = spec.door;
    const dx0 = Math.round((x0 + x1) / 2 + offset - (w - 1) / 2);
    const dx1 = dx0 + w - 1;
    door = { x0: dx0, x1: dx1, height: h };
    const recess = open ? 5 : 1;
    for (let x = dx0; x <= dx1; x++) {
      for (let y = 0; y < h; y++) {
        for (let r = 0; r < recess; r++) setColor(grid, x, y, z1 - r, 0);
        const planks = spec.shut ? (y % 3 === 1 ? C.timberDark : C.door) : (x - dx0) % 3 === 0 ? C.doorDark : C.door;
        setColor(grid, x, y, z1 - recess, open ? C.inside : planks);
      }
      setColor(grid, x, h, z1, C.timber); // (the lintel)
      setColor(grid, x, 0, z1 + 1, C.stoneLight); // (the step)
    }
    for (let y = 0; y <= h; y++) [dx0 - 1, dx1 + 1].forEach((x) => setColor(grid, x, y, z1, C.timber));
  }

  // ---- windows: along every wall of every storey, clear of the corners and the door ----
  if (spec.windows) {
    const { width: w, height: h, sill, every } = spec.windows;
    for (let s = 0; s < storeys; s++) {
      const out = s > 0 ? jut : 0;
      const base = s * storeyHeight + sill;
      // Each wall: its length, and the voxel at u along it, the way out of it.
      const walls: Array<{ length: number; at: (u: number) => [number, number, number]; out: [number, number] }> = [
        { length: width, at: (u) => [x0 + u, 0, z1 + out], out: [0, 1] },
        { length: width, at: (u) => [x0 + u, 0, z0 - out], out: [0, -1] },
        { length: depth + 2 * out, at: (u) => [x0, 0, z0 - out + u], out: [-1, 0] },
        { length: depth + 2 * out, at: (u) => [x1, 0, z0 - out + u], out: [1, 0] },
      ];
      walls.forEach((wall, i) => {
        const count = Math.max(0, Math.floor((wall.length - 10) / every) + 1);
        for (let k = 0; k < count; k++) {
          const centre = Math.round((wall.length - 1) / 2 + (k - (count - 1) / 2) * every);
          const u0 = centre - Math.floor(w / 2);
          if (u0 < 3 || u0 + w > wall.length - 3) continue;
          const [ax] = wall.at(u0);
          if (i === 0 && s === 0 && door && ax + w + 2 >= door.x0 && ax - 2 <= door.x1) continue;
          for (let du = -1; du <= w; du++) {
            for (let y = base - 1; y <= base + h; y++) {
              const [x, , z] = wall.at(u0 + du);
              const edge = du === -1 || du === w;
              if (y === base - 1) {
                setColor(grid, x, y, z, C.timber); // (the sill, standing out)
                setColor(grid, x + wall.out[0], y, z + wall.out[1], C.timber);
              } else if (y === base + h) {
                setColor(grid, x, y, z, C.timber);
              } else if (edge) {
                setColor(grid, x + wall.out[0], y, z + wall.out[1], C.shutter); // (the shutters, folded back)
              } else if (spec.shut) {
                setColor(grid, x, y, z, y % 2 ? C.shutter : C.timberDark);
              } else {
                setColor(grid, x, y, z, 0);
                setColor(grid, x - wall.out[0], y, z - wall.out[1], du === Math.floor(w / 2) ? C.timberDark : C.window);
              }
            }
          }
        }
      });
    }
  }

  // ---- the chimney: a stone stack against a gable end, through the eaves, above the ridge ----
  if (spec.chimney) {
    const cx0 = spec.chimney < 0 ? x0 - 3 : x1 - 0;
    const top = ridge + 4;
    for (let x = cx0; x < cx0 + 4; x++) {
      for (let z = Math.floor(zc) - 1; z <= Math.floor(zc) + 2; z++) {
        for (let y = 0; y <= top; y++) {
          const rim = y === top;
          const hole = rim && x > cx0 && x < cx0 + 3 && z > Math.floor(zc) - 1 && z < Math.floor(zc) + 2;
          setColor(grid, x, y, z, hole ? C.inside : rim ? C.stoneDark : stone(x + z, y, 5));
        }
      }
    }
  }

  const layout: StructureLayout = { size, x0, x1, z0, z1, eaves, ridge, door };
  spec.paint?.(grid, layout);
  return { grid, layout };
}
