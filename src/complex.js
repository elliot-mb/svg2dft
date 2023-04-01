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
        if(c.re === NaN || c.im === NaN){
            throw Error("Complex.assertDefined: NaN complex number");
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

    sub(c){
        Complex.assertDefined(c);
        return this.add(c.mul(new Complex(-1, 0)));
    }

    mul(c){
        Complex.assertDefined(c);
        return new Complex((this.re * c.re) - (this.im * c.im), (this.re * c.im) + (this.im * c.re));
    }

    div(re){
        return new Complex(this.re / re, this.im / re);
    }   

    //returns string representation
    see(){
        return `${this.re} + ${this.im}i`
    }

    // e^(a + b * i) = e^a * e^(b * i)
    static exp(c){
        Complex.assertDefined(c);
        const scalar = Math.exp(c.re);
        return new Complex(scalar * Math.cos(c.im), scalar * Math.sin(c.im));
    }
}