export type Dims = { width: number; height: number };

export type Vec2 = { x: number; y: number };

export type Entity = { position: Vec2; direction: Vec2 };

export type GameState = {
  snakes: (Entity & { body: Vec2[] })[];
  apples: Entity[];
  obstacles: Entity[];
};

export type GameConfig = {
  tileCount: Vec2;
};
