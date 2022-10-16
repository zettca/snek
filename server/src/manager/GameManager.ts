export default class GameManager {
  ticks: number;
  tickTime: number;
  isPaused: boolean;
  gameInterval: number;
  onTick: () => void;

  constructor({ tickTime = 100, onTick = () => {} }) {
    this.ticks = 0;
    this.tickTime = tickTime;
    this.isPaused = false;
    this.gameInterval = 0;
    this.onTick = onTick;
  }

  init = () => {
    this.ticks = 0;
    this.isPaused = false;
  };

  start = () => {
    this.gameInterval = setInterval(this.tick, this.tickTime);

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
    this.gameInterval = 0;
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
