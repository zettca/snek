export default class GameManager {
  ticks: number;
  tickTime: number;
  isPaused: boolean;

  gameInterval: ReturnType<typeof setInterval>;
  gameState: any;

  onStart: () => void;
  onStop: () => void;
  onTick: () => void;

  constructor({ tickTime = 100, onStart, onStop, onTick }) {
    this.ticks = 0;
    this.tickTime = tickTime;
    this.isPaused = false;

    this.gameInterval = null;
    this.gameState = null;

    this.onStart = onStart;
    this.onStop = onStop;
    this.onTick = onTick;

    this.start();
  }

  init = () => {
    this.ticks = 0;
    this.isPaused = false;
  };

  start = () => {
    this.gameInterval = setInterval(this.tick, this.tickTime);
    const initialState = this.onStart();
    this.gameState = initialState;

    this.init();
    return this;
  };

  pause = () => {
    this.isPaused = true;
    return this;
  };

  resume = () => {
    this.isPaused = false;
    return this;
  };

  stop = () => {
    clearInterval(this.gameInterval);
    this.gameInterval = null;
    this.gameState = null;
    this.onStop();
    return this;
  };

  restart = () => {
    this.stop();
    this.start();
    return this;
  };

  tick = () => {
    if (this.isPaused) return this;

    this.ticks++;
    this.onTick();
    return this;
  };
}
