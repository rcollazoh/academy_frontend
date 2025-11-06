import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-language-switcher',
  imports: [NgSelectModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss'
})
export class LanguageSwitcher {

  languagesAll = [
    { code: 'en', label: 'English', flagUrl: 'assets/images/flags/en.png' },
    { code: 'es', label: 'Español', flagUrl: 'assets/images/flags/cr.png' },
    { code: 'nl', label: 'Netherlands', flagUrl: 'assets/images/flags/nl.png' },
  ];

  languages = [
    { code: 'en', label: 'English', flagUrl: 'assets/images/flags/en.png' },
    { code: 'es', label: 'Español', flagUrl: 'assets/images/flags/cr.png' },
    { code: 'nl', label: 'Netherlands', flagUrl: 'assets/images/flags/nl.png' },
  ];

  currentLanguage = 'en';

  currentUrl = 'assets/images/flags/en.png';

  constructor(private translate: TranslateService) {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      this.currentLanguage = savedLanguage;
      this.currentUrl = this.languagesAll.find(value => value.code == this.currentLanguage)!.flagUrl;
      this.languages = this.languagesAll.filter(value => value.code !== this.currentLanguage);
    }
  }

  switchLanguage(languageCode: any): void {
    this.currentLanguage = languageCode.code;
    this.translate.use(this.currentLanguage);
    this.languages = this.languagesAll.filter(value => value.code !== languageCode.code);
    localStorage.setItem('language', this.currentLanguage);
  }

}
