import {FBXLoader} from "three/addons/loaders/FBXLoader.js";

const fbxLoader = new FBXLoader();

export function loadFBX(url) {
    return new Promise((resolve, reject) => {
        fbxLoader.load(url, (obj) => {
            resolve(obj)
        }, () => {
        }, (err) => {
            reject(err)
        },)
    })
}
