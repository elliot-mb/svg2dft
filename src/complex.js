export class Complex{
    constructor(re, im){
        this.re = re === undefined ? 0 : re;
        this.im = im === undefined ? 0 : im;
    }

    static TWO_PI = Math.PI * 2;

    //asserts a complex number is defined
    static assertDefined(c){
        if(c.re === undefined || c.im === undefined){
            throw Error("Complex.assertDefined: Undefined complex number");
        }
    }

    abs(){
        return Math.sqrt((this.re * this.re) + (this.im * this.im));
    }

    arg(){
        return Math.atan2(this.im, this.re);
    }

    add(c){
        Complex.assertDefined(c);
        return new Complex(this.re + c.re, this.im + c.im);
    }

    mul(re){
        return new Complex(this.re * re, this.im * re);
    }

    div(re){
        return new Complex(this.re / re, this.im / re);
    }   

    // e^(0 + i * im)
    static exp(c){
        if(c.re !== 0) throw Error("Complex.euler: No implementation for complex exponentiation!");
        Complex.assertDefined(c);

        return new Complex(Math.cos(c.im), Math.sin(c.im));
    }
}