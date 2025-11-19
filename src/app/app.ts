import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxUiLoaderModule } from 'ngx-ui-loader';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxUiLoaderModule, TranslateModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('course_platform_web');

  constructor(private translate: TranslateService) {
    // Set included languages
    this.translate.addLangs(['en', 'es', 'nl']);
    this.translate.use('es');
    this.translate.setFallbackLang('en');

    const storedLang = localStorage.getItem('language');
    if (storedLang) {
      this.translate.use(storedLang);
    } else {
      const browserLang = navigator.languages
      ? navigator.languages[0].split('-')[0]
      : navigator.language.split('-')[0];

      // Get the current browser language, if included set it
      const defaultLang = this.translate.getLangs().includes(browserLang)
      ? browserLang
      : 'en';

      this.translate.use(defaultLang);
      this.translate.setFallbackLang(defaultLang);
      localStorage.setItem('language', defaultLang);
    }
  }
  
}
