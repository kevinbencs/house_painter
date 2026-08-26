import { RateLimiterMemory } from "rate-limiter-flexible"

export const ipLimiter = new RateLimiterMemory({
  points: 50,
  duration: 600,
});
