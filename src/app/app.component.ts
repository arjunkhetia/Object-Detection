import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public modelArray: Array<object> = [
    { 'name': 'MobileNet V1', 'value': 'mobilenet_v1' },
    { 'name': 'MobileNet V2', 'value': 'mobilenet_v2' },
    { 'name': 'MobileNet V2 (Lite)', 'value': 'lite_mobilenet_v2' }
  ];
  public modelText: string = 'Select MobileNet Model';
  public modelLoaded: boolean = false;
  public title: string = 'Object Detection';
  public introline: string = '(using TensorFlow.js with Coco-SSD Model)';
  public imgBtnStatus: boolean = true;
  public webBtnStatus: boolean = false;
  public imageElement: any;
  public imageSrc: any = 'assets/cat.jpg';
  public imageWidth: number = 410;
  public imageHeight: number = 310;
  @ViewChild('videoElement', {static: false}) videoElement: ElementRef;
  public video: any;
  public videoWidth: number = 410;
  public videoHeight: number = 310;
  public videoStream: any;
  public canvas: any;
  public canvasWidth: number = 400;
  public canvasHeight: number = 300;
  public canvasContext: any;
  @ViewChild("videoCanvas", {static: false}) videoCanvas: ElementRef;
  public model: any;
  public videoModel: any;
  public prediction: any;
  public fileName: string = 'No File Chosen';
  public fileError: boolean = false;
  public predictionFont = "16px sans-serif";
  public animationFrame: any;

  public async ngOnInit() {
    this.model = await cocoSsd.load();
    this.videoModel = await cocoSsd.load('lite_mobilenet_v2');
    this.modelLoaded = true;
  }

  public async selectModel(model: any) {
    this.modelLoaded = false;
    this.modelText = model['name'];
    this.model = await cocoSsd.load(model['value']);
    this.videoModel = await cocoSsd.load(model['value']);
    this.modelLoaded = true;
  }

  public imageMode() {
    if (!this.imgBtnStatus) {
      cancelAnimationFrame(this.animationFrame);
      this.canvas = document.getElementById("canvas");
      this.canvasContext = this.canvas.getContext("2d");
      this.canvasContext.clearRect(0, 0, 400, 300);
      this.imageSrc = 'assets/white.jpg';
      this.prediction = [];
      this.imgBtnStatus = true;
      this.webBtnStatus = false;
      this.stopVideo();
    }
  }

  public videoMode() {
    if (!this.webBtnStatus) {
      this.fileName = 'No File Chosen';
      this.canvas = document.getElementById("canvas");
      this.canvasContext = this.canvas.getContext("2d");
      this.canvasContext.clearRect(0, 0, 400, 300);
      this.imageSrc = 'assets/white.jpg';
      this.prediction = [];
      this.webBtnStatus = true;
      this.imgBtnStatus = false;
      this.video = this.videoElement.nativeElement;
      this.initCamera({ video: true, audio: false });
    }
  }

  public initCamera(config:any) {
    var browser = <any>navigator;
    browser.getUserMedia = (browser.getUserMedia ||
      browser.webkitGetUserMedia ||
      browser.mozGetUserMedia ||
      browser.msGetUserMedia);
    browser.mediaDevices.getUserMedia(config).then((stream: any) => {
      if(!stream.stop && stream.getTracks) {
        stream.stop = function(){
          this.getTracks().forEach(function (track: any) {
            track.stop();
          });
        };
      }
      this.videoStream = stream;
      try {
        this.video.srcObject = this.videoStream;
      } catch(err) {
        this.video.src = window.URL.createObjectURL(this.videoStream);
      }
      this.video.play();
    });
  }

  public stopVideo() {
    this.videoStream.stop();
  }

  public async snapPhoto() {
    await cancelAnimationFrame(this.animationFrame);
    this.canvasContext = await this.canvas.getContext("2d").drawImage(this.videoElement.nativeElement, 0, 0, this.canvasWidth, this.canvasHeight);
    if (this.model) {
      setTimeout(async () => {
        this.prediction = await this.model.detect(this.canvas);
        this.drawOutline();
      }, 1000);
    }
  }

  public realTimeVideo() {
    this.videoModel.detect(this.video).then((videoPrediction: any) => {
      if (this.videoMode) {
        this.renderPredictions(videoPrediction);
        this.animationFrame = requestAnimationFrame(() => {
          this.realTimeVideo();
        });
      }
    });
  }

  public renderPredictions = (videoPrediction: any) => {
    this.canvas = document.getElementById("canvas");
    this.canvasContext = this.canvas.getContext("2d");
    this.canvasContext.clearRect(0, 0, 400, 300);
    this.canvasContext.font = this.predictionFont;
    this.canvasContext.textBaseline = "top";
    this.canvasContext.drawImage(this.video, 0, 0, 400, 300);
    videoPrediction.forEach((prediction: any) => {
      let x = prediction.bbox[0];
      let y = prediction.bbox[1];
      let width = prediction.bbox[2];
      let height = prediction.bbox[3];
      this.canvasContext.strokeStyle = "#00FFFF";
      this.canvasContext.lineWidth = 2;
      this.canvasContext.strokeRect(x, y, width, height);
      this.canvasContext.fillStyle = "#00FFFF";
      let textWidth = this.canvasContext.measureText(prediction.class).width;
      let textHeight = parseInt(this.predictionFont, 10); // base 10
      this.canvasContext.fillRect(x, y, textWidth + 4, textHeight + 4);
    });
    videoPrediction.forEach((prediction: any) => {
      let x = prediction.bbox[0];
      let y = prediction.bbox[1];
      this.canvasContext.fillStyle = "#000000";
      this.canvasContext.fillText(prediction.class, x, y);
    });
  };

  public async predict() {
    if (this.model) {
      if (this.imageSrc !== 'assets/white.jpg') {
        this.imageElement = document.getElementById('image');
        this.prediction = await this.model.detect(this.imageElement);
        this.canvas = document.getElementById("canvas");
        this.canvasContext = this.canvas.getContext("2d");
        this.canvasContext.clearRect(0, 0, 400, 300);
        this.canvasContext.drawImage(this.imageElement, 0, 0, 400, 300);
        this.drawOutline();
      }
    }
  }

  public async drawOutline() {
    this.canvas = document.getElementById("canvas");
    this.canvasContext = this.canvas.getContext("2d");
    this.prediction.forEach((prediction: any) => {
      this.canvasContext.beginPath();
      this.canvasContext.lineWidth = "2";
      this.canvasContext.strokeStyle = "#"+((1<<24)*Math.random()|0).toString(16);
      this.canvasContext.rect(prediction['bbox'][0],prediction['bbox'][1],prediction['bbox'][2],prediction['bbox'][3]);
      this.canvasContext.stroke();
      prediction['colour'] = this.canvasContext.strokeStyle;
    });
  }

  public browseFile(files: any) {
    if (files.length === 0) {
      return;
    } else {
      let mimeType = files[0].type;
      if (mimeType.match(/image\/*/) == null) {
        this.fileError = true;
        return;
      } else {
        this.fileError = false;
        this.fileName = files[0].name;
        let reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = (_event) => {
          this.imageSrc = reader.result;
        }
      }
    }
  }

}
