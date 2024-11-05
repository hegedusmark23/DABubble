import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChannelSelectionService } from '../../services/channel-selection.service';

@Component({
  selector: 'app-open-img',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './open-img.component.html',
  styleUrl: './open-img.component.scss',
})
export class OpenImgComponent implements OnInit {
  src = '';
  constructor(public channelSelectionService: ChannelSelectionService) {}

  imgWidth: any;
  imgHeight: any;

  ngOnInit(): void {
    this.channelSelectionService.getselectedIMG().subscribe((src) => {
      this.src = src;
      if (src) {
        this.getImageDimensionBasedOnAspect(src);
      }
    });
  }

  /**
   * Stops the propagation of the specified event, preventing it from bubbling up to parent elements.
   *
   * @param {any} event - The event object to stop propagation for.
   * @returns {void}
   */
  stopEvent(event: any): void {
    event.stopPropagation();
  }

  /**
   * Determines whether the provided image source has a greater width or height based on its aspect ratio.
   *
   * @param {string} src - The source URL of the image.
   */
  getImageDimensionBasedOnAspect(src: string) {
    const img = new Image();
    img.src = src;
    const width = img.width;
    const height = img.height;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const maxWidth = screenWidth * 0.8;
    const maxHeight = screenHeight * 0.8;

    let newWidth = width;
    let newHeight = height;

    const widthRatio = maxWidth / width;
    const heightRatio = maxHeight / height;
    const scalingFactor = Math.min(widthRatio, heightRatio);

    newWidth = width * scalingFactor;
    newHeight = height * scalingFactor;

    this.imgHeight = newHeight;
    this.imgWidth = newWidth;
  }

  downloadImg(src: string) {
    const link = document.createElement('a');
    link.href = src;
    link.target = '_blank'; // Öffnet in einem neuen Tab

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
