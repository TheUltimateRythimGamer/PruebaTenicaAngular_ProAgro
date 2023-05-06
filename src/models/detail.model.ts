
export interface PhotoDetail {
  id: string
  created_at: string
  prefix: string
  suffix: string
  width: number
  height: number
}


export interface Detail {
    fsq_id: string
    categories: Category[]
    chains: any[]
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
  
  export interface Geocodes {
    main: Main
    roof: Roof
  }
  
  export interface Main {
    latitude: number
    longitude: number
  }
  
  export interface Roof {
    latitude: number
    longitude: number
  }
  
  export interface Location {
    address: string
    address_extended: string
    census_block: string
    country: string
    dma: string
    formatted_address: string
    locality: string
    postcode: string
    region: string
  }
  
  export interface RelatedPlaces {}
  