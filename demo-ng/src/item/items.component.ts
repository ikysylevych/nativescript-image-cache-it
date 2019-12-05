import {ImageSource, isAndroid} from '@nativescript/core';
import {ImageCacheIt} from 'nativescript-image-cache-it';
import {SimpleHeader} from 'nativescript-image-cache-it/image-cache-it.common';
import { getImage } from 'tns-core-modules/http';
import {Component, OnInit} from '@angular/core';
import {ItemService} from './item.service';

@Component({
    selector: 'ns-items',
    moduleId: module.id,
    templateUrl: './items.component.html',
})
export class ItemsComponent implements OnInit {

    readonly IMAGE_URL = 'https://www.toadi.com/wp-content/uploads/2018/11/foto_Toadi.png';

    // Check authorization headers for android
    // readonly IMAGE_URL = 'https://sharp-starfish-34.localtunnel.me/toadi-image.png';

    readonly AUTH_HEADER = new SimpleHeader('Authorization', 'Bearer: ${token}');

    isAndroid: boolean;

    status = 'Loading...';
    statusCls = 'warning';
    src = null;

    constructor(private itemService: ItemService) {
        this.isAndroid = isAndroid;
    }

    ngOnInit(): void {
        this.reloadImage();
    }

    reloadImage() {
        this.src = null;

        this.getImage(this.IMAGE_URL).then((imageSource) => {
            this.src = imageSource;
        });
    }

    getImage(imageUrl): Promise<any> {

        return new Promise((resolve, reject) => {
            ImageCacheIt.hasItem(imageUrl)
                .then(() => {
                    this.log('Get image from cache');

                    ImageCacheIt.getItem(imageUrl)
                        .then((imageSource) => {
                            resolve(imageSource);
                        })
                        .catch(() => {
                            this.error('Image not found in cache');
                            reject();
                        });

                })
                .catch(() => {
                    this.log('Fetch image from remote source...', 'warning');

                    if (this.isAndroid) {
                        this.storeItem(imageUrl, null, this.AUTH_HEADER, resolve, reject);

                    } else {
                        getImage({url: imageUrl, method: 'GET'})
                            .then((image: ImageSource) => {
                                this.storeItem(imageUrl, image.ios, null, resolve, reject);
                            })
                            .catch((e) => {
                                this.error('Fetch image failed', e);
                                reject();
                            });
                    }
                });
        });
    }

    private storeItem(imageUrl: string, src: any, header: SimpleHeader, resolve: any, reject: any) {
        ImageCacheIt.storeItem(imageUrl, src, header)
            .then((source) => {
                this.log('Stored image in cache', null, source);
                resolve(source);
            })
            .catch((e) => {
                this.error('Store image failed', e);
                reject();
            });
    }

    deleteImage() {
        this.src = null;

        ImageCacheIt.deleteItem(this.IMAGE_URL)
            .then(() => this.log('Image deleted from cache', 'warning'))
            .catch((e) => this.error('Image delete error', e));
    }

    clearCache() {
        this.src = null;

        ImageCacheIt.clear()
            .then(() => this.log('Cache cleared', 'warning'))
            .catch((e) => this.error('Clear cache error', e));
    }

    log(message: string, statusCls?: string, arg?: any) {
        this.status = message;
        this.statusCls = statusCls != null ? statusCls : 'success';

        if (arg) {
            console.log(message, arg);
        } else {
            console.log(message);
        }
    }

    error(message: string, e?: string) {
        this.status = message;
        this.statusCls = 'error';

        if (e) {
            console.error(message, e);
        } else {
            console.error(message);
        }
    }
}
