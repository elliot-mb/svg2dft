# Index
- [Intro](#svg2dft)
- [Deployment](#deployment)
- [Gallery](#gallery)


# SVG2DFT

App that draws SVGs' paths by converting them to a set of points on the complex plane, then applying a Discrete Fourier transform to generate a set of rotating vectors.

The sum of these vectors over time traces the path of the SVG with an accuracy directly reflected in the number of points or Complex terms chosen. 

### Motivation

I was motivated to make this project from the moment I first saw this kind of visualisation; I was shocked as to how elegant the maths was behind such a seemingly complex task. 
Lining up and scaling hundreds and hundreds of little vectors rotating at a constant speed all being done by a single expression/a few lines of code really astounded me. 

For the longest time I had wanted to reproduce what I saw, and was finally motivated to do so when my course covered Fourier Transforms. Finally, I had an excuse!

### Deployment

Please visit the deployed application [here](https://pi.elliotmb.dev/static/project/svg-dft).

The program allows you to upload your own SVGs, experiment with the parameters of the DFT and the visualisation. 

It has to be said it works best on simple SVGs with a low/single path count, else many discontinuities arise and the transform begins looking messy. \
In the future I may put in place an algorithm which smooths out these jumps.

## Gallery 

A collection of some images that work well, and their respective fourier transforms with the specified number of points/samples. Feel free to download these SVGs and play with the settings yourself!

<img src="https://user-images.githubusercontent.com/45922387/230635968-bd5d1a9d-bf22-4e96-bdd1-5cd851364d08.svg" height="300">

#### Set to 12 points

[Screencast from 07-04-23 16:32:58.webm](https://user-images.githubusercontent.com/45922387/230636009-584beb41-7ace-436f-8c1b-b7c39b9b86df.webm)

---

<img src="https://user-images.githubusercontent.com/45922387/230632956-b391799c-9513-47b9-ac73-265e0bacaf2a.svg" height="300">

#### Set to 250 points

[Screencast from 07-04-23 16:12:46.webm](https://user-images.githubusercontent.com/45922387/230633470-272ff7df-1494-4e80-866a-1c954459941c.webm)

---

<img src="https://user-images.githubusercontent.com/45922387/230633668-ad496b12-93af-48dc-9110-2c2086e5fe17.svg" height="400">

#### Set to 251 points 

[Screencast from 07-04-23 16:07:29.webm](https://user-images.githubusercontent.com/45922387/230633645-ede9d433-f3ad-4fe5-a629-54ce75d7b135.webm)

---

<img src="https://user-images.githubusercontent.com/45922387/230633796-e4d2d081-26e8-4fa8-bedb-d75b4df2fa08.svg" height="300">

#### Set to 1000 points

[Screencast from 07-04-23 16:03:16.webm](https://user-images.githubusercontent.com/45922387/230633843-15b73d06-1c3f-4006-bbea-8c4647a3b26f.webm)



