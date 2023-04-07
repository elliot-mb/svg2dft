![image](https://user-images.githubusercontent.com/45922387/230599416-cece4655-238f-4de3-ad54-fdd3ef653c6d.png)


# SVG2DFT

App that draws SVGs' paths by converting them to a set of points on the complex plane, then applying a Discrete Fourier transform to generate a set of rotating vectors.

The sum of these vectors over time traces the path of the SVG with an accuracy directly reflected in the number of points or Complex terms chosen. 

### Motivation

I was motivated to make this project as when I first saw this kind of visualisation. I was shocked as to how elegant the maths was behind such a seemingly complex task. 
Lining up and scaling hundreds and hundreds of little vectors rotating at a constant speed all being done by a single expression/a few lines of code really astounded me. 

For the longest time I had wanted to reproduce what I saw, and was finally motivated to do so when my course covered Fourier Transforms. Finally, I had an excuse!

### Deployment

Please visit the deployed application [here](https://pi.elliotmb.dev/static/project/svg-dft).

The program allows you to upload your own SVGs, experiment with the parameters of the DFT and the visualisation. 

It has to be said it works best on simple SVGs with a low/single path count, else many discontinuities arise and the transform begins looking messy. \
In the future I may put in place an algorithm which smooths out these jumps.
