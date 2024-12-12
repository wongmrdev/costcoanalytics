declare module 'modern-random-ua' {
  interface RandomUA {
    generate(): string;
  }

  const randomUA: RandomUA;
  export = randomUA;
}