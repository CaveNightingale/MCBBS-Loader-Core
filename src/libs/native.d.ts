declare function setProperty(obj: any, key: string, val: any): void;
declare function setLockedProperty(obj: any, key: string, val: any): void;
declare function getProperty(obj: any, key: string): any;
declare function getUnsafeWindow(): any;
declare function getGM(): object;
export { setProperty, getProperty, getUnsafeWindow, setLockedProperty, getGM };
