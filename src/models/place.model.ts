export interface Root {
    results: Result[]
    context: Context
}

export interface Result {
    fsq_id: string
    categories: Category[]
    chains: Chain[]
    distance: number
    geocodes: Geocodes
    link: string
    location: Location
    name: string
    related_places: RelatedPlaces
    timezone: string
}

export interface Category {
    id: number
    name: string
    icon: Icon
}

export interface Icon {
    prefix: string
    suffix: string
}

export interface Chain {
    id: string
    name: string
}

export interface Geocodes {
    main: Main
    roof?: Roof
    drop_off?: DropOff
}

export interface Main {
    latitude: number
    longitude: number
}

export interface Roof {
    latitude: number
    longitude: number
}

export interface DropOff {
    latitude: number
    longitude: number
}

export interface Location {
    address?: string
    country: string
    cross_street: string
    formatted_address: string
    locality: string
    postcode?: string
    region: string
}

export interface RelatedPlaces {
    parent?: Parent
}

export interface Parent {
    fsq_id: string
    name: string
}

export interface Context {
    geo_bounds: GeoBounds
}

export interface GeoBounds {
    circle: Circle
}

export interface Circle {
    center: Center
    radius: number
}

export interface Center {
    latitude: number
    longitude: number
}
