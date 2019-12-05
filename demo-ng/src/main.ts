import { platformNativeScriptDynamic } from 'nativescript-angular/platform';
import { AppModule } from './app.module';
import {ImageCacheIt} from '../../src';

ImageCacheIt.enableAutoMM();

platformNativeScriptDynamic().bootstrapModule(AppModule);
