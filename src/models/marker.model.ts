export interface MarkerModel {
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
        animation: any
    };
}