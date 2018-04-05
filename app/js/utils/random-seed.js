

class RandomSeed{
  constructor(seed=88675123){
    this.x = 123456789;
    this.y = 362436069;
    this.z = 521288629;
    this.w = seed;
  }

  next(){
    let t;

    t = this.x ^ (this.x << 11);
    this.x = this.y;
    this.y = this.z;
    this.z = this.w;
    return this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8));
  }


  nextInt(min, max) {
    const r = Math.abs(this.next());
    return min + (r % (max + 1 - min));
  }

  execute(min=0, max=1){
    //小数点二桁
    const n = this.nextInt(0, 100);
    const range = max-min;
    const r = n/100.0;
    return r*range+min;
  }
}

export default RandomSeed;
