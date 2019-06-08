# Object Detection (using TensorFlow.js with Coco-SSD Model)  ![Version][version-image]

![Linux Build][linuxbuild-image]
![Windows Build][windowsbuild-image]
![NSP Status][nspstatus-image]
![Test Coverage][coverage-image]
![Dependency Status][dependency-image]
![devDependencies Status][devdependency-image]

The quickest way to get start with Object Detection (using TensorFlow.js with Coco-SSD Model), just clone the project:

```bash
$ git clone https://github.com/arjunkhetia/Object-Detection.git
```

Install dependencies:

```bash
$ npm install
```

Start the angular app at `http://localhost:4200/`:

```bash
$ npm start
```

## TensorFlow.js

[TensorFlow](https://www.tensorflow.org) is an open source software library for numerical computation using data flow graphs. The graph nodes represent mathematical operations, while the graph edges represent the multidimensional data arrays (tensors) that flow between them. [TensorFlow.js](https://www.tensorflow.org/js) is a library for developing and training ML models in JavaScript, and deploying in browser or on Node.js.

```ts
import * as tfjs from '@tensorflow/tfjs';
```

## Coco-SSD

This model detects objects defined in the COCO dataset, which is a large-scale object detection, segmentation, and captioning dataset.The model is capable of detecting [90 classes of objects](https://github.com/tensorflow/tfjs-models/blob/master/coco-ssd/src/classes.ts). (SSD stands for Single Shot MultiBox Detection).

This TensorFlow.js model does not require you to know about machine learning. It can take as input any browser-based image elements (<img>, <video>, <canvas> elements, for example) and returns an array of most likely predictions and their confidences.

```ts
import * as cocoSsd from '@tensorflow-models/coco-ssd';

const img = document.getElementById('img');

// Load the model.
const model = await cocoSsd.load();

// Classify the image.
const predictions = await model.detect(img);

console.log('Predictions: ');
console.log(predictions);
```

# Image Mode -

![Image Mode](https://github.com/arjunkhetia/Object-Detection/blob/master/src/assets/imagemode.png "Image Mode")

# Video Mode -

![Video Mode](https://github.com/arjunkhetia/Object-Detection/blob/master/src/assets/videomode.png "Video Mode")

# MobileNet V2 Model (high classification accuracy) -

![MobileNet V2 Model](https://github.com/arjunkhetia/Object-Detection/blob/master/src/assets/mobilenetv2.png "MobileNet V2 Model")

[version-image]: https://img.shields.io/badge/Version-1.0.0-orange.svg
[linuxbuild-image]: https://img.shields.io/badge/Linux-passing-brightgreen.svg
[windowsbuild-image]: https://img.shields.io/badge/Windows-passing-brightgreen.svg
[nspstatus-image]: https://img.shields.io/badge/nsp-no_known_vulns-blue.svg
[coverage-image]: https://img.shields.io/coveralls/expressjs/express/master.svg
[dependency-image]: https://img.shields.io/badge/dependencies-up_to_date-brightgreen.svg
[devdependency-image]: https://img.shields.io/badge/devdependencies-up_to_date-yellow.svg
