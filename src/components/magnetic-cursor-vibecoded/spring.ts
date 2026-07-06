export type SpringOptions = {
  stiffness: number;
  damping: number;
};

/**
 * Minimal spring integrator (semi-implicit Euler), the same physics model
 * Motion uses under its useSpring/animate calls. Instead of transitioning
 * CSS properties over a fixed duration, we pull a value toward a target
 * with spring forces every frame — retargeting mid-flight keeps velocity,
 * which is why springs never show the "restart" stutter CSS transitions do.
 */
export class Spring {
  current: number;
  target: number;
  velocity = 0;
  private stiffness: number;
  private damping: number;

  constructor(initial: number, { stiffness, damping }: SpringOptions) {
    this.current = initial;
    this.target = initial;
    this.stiffness = stiffness;
    this.damping = damping;
  }

  /** Retarget; the spring animates toward it from its current state. */
  set(target: number) {
    this.target = target;
  }

  /** Teleport with no animation (Motion calls this `jump`). */
  jump(value: number) {
    this.current = value;
    this.target = value;
    this.velocity = 0;
  }

  get isAnimating() {
    return (
      Math.abs(this.velocity) > 0.01 ||
      Math.abs(this.target - this.current) > 0.01
    );
  }

  step(dt: number) {
    const acceleration =
      this.stiffness * (this.target - this.current) -
      this.damping * this.velocity;
    this.velocity += acceleration * dt;
    this.current += this.velocity * dt;
    if (!this.isAnimating) {
      this.current = this.target;
      this.velocity = 0;
    }
    return this.current;
  }
}
