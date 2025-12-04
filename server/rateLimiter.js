// Simple rate limiter middleware

class RateLimiter {
  constructor() {
    this.requests = new Map();
    this.limits = {
      chat: { max: 30, window: 60000 }, // 30 requests per minute
      agent: { max: 10, window: 60000 }, // 10 agent connections per minute
      upload: { max: 5, window: 300000 }, // 5 uploads per 5 minutes
      default: { max: 100, window: 60000 } // 100 requests per minute
    };
    
    // Cleanup old entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  cleanup() {
    const now = Date.now();
    for (const [key, data] of this.requests.entries()) {
      if (now - data.resetTime > data.window) {
        this.requests.delete(key);
      }
    }
  }

  check(identifier, type = 'default') {
    const limit = this.limits[type] || this.limits.default;
    const key = `${identifier}_${type}`;
    const now = Date.now();

    if (!this.requests.has(key)) {
      this.requests.set(key, {
        count: 1,
        resetTime: now,
        window: limit.window
      });
      return { allowed: true, remaining: limit.max - 1 };
    }

    const data = this.requests.get(key);

    // Reset if window has passed
    if (now - data.resetTime > limit.window) {
      data.count = 1;
      data.resetTime = now;
      return { allowed: true, remaining: limit.max - 1 };
    }

    // Check if limit exceeded
    if (data.count >= limit.max) {
      const resetIn = Math.ceil((data.resetTime + limit.window - now) / 1000);
      return { 
        allowed: false, 
        remaining: 0,
        resetIn 
      };
    }

    data.count++;
    return { 
      allowed: true, 
      remaining: limit.max - data.count 
    };
  }

  middleware(type = 'default') {
    return (req, res, next) => {
      // Use IP address as identifier
      const identifier = req.ip || req.connection.remoteAddress || 'unknown';
      const result = this.check(identifier, type);

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', this.limits[type].max);
      res.setHeader('X-RateLimit-Remaining', result.remaining);

      if (!result.allowed) {
        res.setHeader('X-RateLimit-Reset', result.resetIn);
        return res.status(429).json({
          error: 'Too many requests',
          message: `Rate limit exceeded. Try again in ${result.resetIn} seconds.`,
          resetIn: result.resetIn
        });
      }

      next();
    };
  }
}

export const rateLimiter = new RateLimiter();
