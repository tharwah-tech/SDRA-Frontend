import {Inject, Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(
    private translateService: TranslateService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    const userLang =
      localStorage.getItem('selectedLanguage') || navigator.language || 'en';
    // const languageCode = 'ar';
    const languageCode = userLang.split('-')[0];
    console.log(
      `user init lang = ${languageCode}, from language service constructor`
    );
    this.translateService.addLangs(['en', 'ar']);
    this.translateService.setDefaultLang(languageCode);
    this.translateService.use(languageCode);
    this.setLocale(languageCode);
  }

  setLanguage(lang: string, caller: string) {
    console.log(`language service lang parm = ${lang}, from ${caller}`);
    this.translateService.use(lang);
    this.translateService.setDefaultLang(lang);
    localStorage.setItem('selectedLanguage', lang);
    this.setLocale(lang);
    const htmlTag = document.getElementsByTagName('html')[0] as HTMLHtmlElement;
    if (lang === 'ar') {
      htmlTag.setAttribute('dir', 'rtl');
      document.documentElement.lang = 'ar';
    } else {
      htmlTag.setAttribute('dir', 'ltr');
      document.documentElement.lang = 'en';
    }
  }
  updateLanguage(lang: string) {
    this.translateService.use(lang);
    this.translateService.setDefaultLang(lang);
    localStorage.setItem('selectedLanguage', lang);
    this.setLocale(lang);
    const htmlTag = document.getElementsByTagName('html')[0] as HTMLHtmlElement;
    if (lang === 'ar') {
      htmlTag.setAttribute('dir', 'rtl');
      document.documentElement.lang = 'ar';
    } else {
      htmlTag.setAttribute('dir', 'ltr');
      document.documentElement.lang = 'en';
    }
    // Update the URL to reflect the new language
    const currentUrl = this.router.url;
    const newUrl = currentUrl.replace(/\/(en|ar)/, `/${lang}`);
    console.log(`new url: ${newUrl}`);

    this.router.navigateByUrl(newUrl).then(() => {
      // Force reload the page
      window.location.reload();
    });
  }

  getLanguage(): string {
    return (
      localStorage.getItem('selectedLanguage') ||
      this.translateService.defaultLang
    );
  }

  private setLocale(locale: string) {
    this.document.documentElement.lang = locale;
  }
}
