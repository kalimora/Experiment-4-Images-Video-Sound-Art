let video;
let prevFrame;
let threshold = 20; // Changes the capture sensitivity for the effect
let hoverColorChangeDistance = 50; // Distance in pixels for the hover effect to activate
let hoverEffectIntensity = []; // Array to store the intensity of the hover effect

function setup() {
  createCanvas(640, 480);
  pixelDensity(1);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  prevFrame = null;
  
  // Initialize the hover effect intensity array
  hoverEffectIntensity = new Array(640 * 480).fill(0);
}

function draw() {
  background(0);

  video.loadPixels();

  if (prevFrame) {
    loadPixels();
    for (let y = 0; y < video.height; y++) {
      for (let x = 0; x < video.width; x++) {
        let index = (x + y * video.width) * 4;

        let r = video.pixels[index + 0];
        let g = video.pixels[index + 1];
        let b = video.pixels[index + 2];

        let prevR = prevFrame[index + 0];
        let prevG = prevFrame[index + 1];
        let prevB = prevFrame[index + 2];

        // Calculate the color difference
        let diff = dist(r, g, b, prevR, prevG, prevB);

        if (diff > threshold) {
          if (dist(mouseX, mouseY, x, y) < hoverColorChangeDistance) {
            // Boost the hover effect intensity
            hoverEffectIntensity[x + y * video.width] = 255;
          }
          
          // Apply the current hover effect intensity
          let intensity = hoverEffectIntensity[x + y * video.width];
          if (intensity > 0) {
            pixels[index + 0] = intensity; // Dynamic Red based on intensity
            pixels[index + 1] = 255 - intensity; // Dynamic Green
            pixels[index + 2] = 255; // Full Blue
          } else {
            // Normal motion detected red effect
            pixels[index + 0] = 255; // Red
            pixels[index + 1] = random(0, 60); // Faint green to add depth
            pixels[index + 2] = random(0, 60); // Faint blue to add depth
          }
        } else {
          pixels[index + 0] = 0;
          pixels[index + 1] = 0;
          pixels[index + 2] = 0;
        }

        pixels[index + 3] = 255;
        
        // Fade the hover effect intensity
        hoverEffectIntensity[x + y * video.width] *= 0.9; // Slowly reduce the intensity
      }
    }
    updatePixels();
  }

  prevFrame = video.pixels.slice(); 
}

