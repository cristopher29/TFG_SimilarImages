import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterimages'
})
export class FilterimagesPipe implements PipeTransform {

  transform(images: any[], tag: any): any {
    if (tag === 'todo'){ return images; }
    else {
      return images.filter(image => {
        return image.tags.includes(tag);
      });
    }
  }

}
