import 'cytoscape';

declare module 'cytoscape' {
    interface Core {
    gridGuide(options?: any): void;
    }
}