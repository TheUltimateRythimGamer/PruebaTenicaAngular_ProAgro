export interface MarkerModel {
    id:string;
    position: {
        lat: number;
        lng: number;
    };
    label: {
        color: string;
        text: string;
    };
    title: string;
    options: {
        opacity: number;
        animation: any
    };
}