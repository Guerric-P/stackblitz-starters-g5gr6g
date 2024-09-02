import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { TestService } from './test.service';
import { saveAs } from 'file-saver';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <h1>Hello from {{ name }}!</h1>
    <a target="_blank" href="https://angular.dev/overview">
      Learn more about Angular
    </a>
    <button (click)="downloadFile()">Download</button>
  `,
})
export class App {
  name = 'Angular';

  constructor(private testService: TestService) {}

  async downloadFile() {
    const stream = await this.testService.testFetch();

    if (stream) {
      const pickerOpts = {
        types: [
          {
            description: 'Images',
            accept: {
              'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
            },
          },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
      };
      // Open file picker and destructure the result the first handle
      const [fileHandle] = ((await window) as any).showOpenFilePicker(
        pickerOpts
      );

      // get file contents
      const fileData = await fileHandle.getFile();
      stream.pipeTo(fileData);
    }
  }
}

bootstrapApplication(App, {
  providers: [provideHttpClient(withInterceptorsFromDi())],
});
