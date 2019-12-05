import {ImageCacheItBase, SimpleHeader} from './image-cache-it.common';
import {ImageSource} from 'tns-core-modules/image-source';

export declare class ImageCacheIt extends ImageCacheItBase {
    /**
     * Store item in the cache
     *
     *   - ios: puts image source to the cache immediately
     *   - android: makes http request with authorization headers and then puts image to cache
     *
     * @param url link
     * @param src image native source (ios: UIImage; android: android.graphics.Bitmap)
     * @param header authorization header
     */
    public static storeItem(url: string, src: any | null, header?: SimpleHeader): Promise<any>;

    public static getItem(src: string): Promise<string>;

    public static deleteItem(src: string): Promise<string>;

    public static hasItem(src: string): Promise<any>;

    public static clear(): Promise<any>;

    public static enableAutoMM(): void;

    public static disableAutoMM(): void;
}
